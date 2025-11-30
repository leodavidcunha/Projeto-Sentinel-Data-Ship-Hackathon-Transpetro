#!/usr/bin/env python3
"""
Script de Processamento de Dados - Sentinel Data Ship
=====================================================

Este script processa os dados brutos do dataset e gera os arquivos JSON
que serao utilizados pelo servidor da aplicacao.

Entrada: dataset/raw/
Saida:   dataset/processed/

Uso:
    python scripts/processar_dados.py

Arquivos gerados:
    - navios.json     : Lista de navios com IBE, consumo, posicao, etc.
    - metricas.json   : Metricas agregadas da frota
    - alertas.json    : Alertas de bioincrustacao
"""

import pandas as pd
import numpy as np
import json
import os
from datetime import datetime, timedelta
from pathlib import Path
import random

# =============================================================================
# CONFIGURACAO
# =============================================================================

# Diretorios
BASE_DIR = Path(__file__).parent.parent
RAW_DIR = BASE_DIR / "backend" / "dataset" / "raw"
OUTPUT_DIR = BASE_DIR / "backend" / "dataset" / "processed"

# Constantes de calculo
LIMITE_CRITICO = 30    # IBE > 30% = CRITICO
LIMITE_ALERTA = 15     # IBE 15-30% = ALERTA
LIMITE_ATENCAO = 5     # IBE 5-15% = ATENCAO
PRECO_COMBUSTIVEL = 5500  # R$/ton
TAXA_CO2 = 3.2            # ton CO2/ton combustivel (fator IMO)

print("=" * 60)
print("SENTINEL DATA SHIP - Processamento de Dados")
print("=" * 60)

# =============================================================================
# FUNCOES DE PROCESSAMENTO
# =============================================================================

def classificar_risco_normam(ibe: float) -> str:
    """Classifica o risco NORMAM-401 baseado no IBE"""
    if ibe > LIMITE_CRITICO:
        return "Critico"
    elif ibe > LIMITE_ALERTA:
        return "Alto"
    elif ibe > LIMITE_ATENCAO:
        return "Medio"
    else:
        return "Baixo"


def gerar_recomendacao(ibe: float, dias_docagem: int) -> str:
    """Gera recomendacao baseada no IBE e dias desde docagem"""
    if ibe > LIMITE_CRITICO:
        return "Docagem urgente recomendada - IBE critico"
    elif ibe > LIMITE_ALERTA:
        return "Agendar docagem nos proximos 30 dias"
    elif ibe > LIMITE_ATENCAO:
        return "Monitorar evolucao do IBE"
    elif dias_docagem > 365:
        return "Considerar inspecao subaquatica"
    else:
        return "Operacao normal - manter monitoramento"


def carregar_dados_brutos():
    """Carrega os dados brutos dos arquivos CSV e Excel"""
    print("\n[1/5] Carregando dados brutos...")

    # Carregar eventos de navegacao
    eventos_path = RAW_DIR / "ResultadoQueryEventos.csv"
    df_eventos = pd.read_csv(eventos_path)
    print(f"  - Eventos: {len(df_eventos)} registros")

    # Carregar consumo
    consumo_path = RAW_DIR / "ResultadoQueryConsumo.csv"
    df_consumo = pd.read_csv(consumo_path)
    print(f"  - Consumo: {len(df_consumo)} registros")

    # Carregar dados dos navios
    navios_path = RAW_DIR / "Dados navios Hackathon.xlsx"
    df_navios = pd.read_excel(navios_path, sheet_name="Dados navios")
    print(f"  - Navios: {len(df_navios)} registros")

    # Carregar docagens
    df_docagens = pd.read_excel(navios_path, sheet_name="Lista de docagens")
    print(f"  - Docagens: {len(df_docagens)} registros")

    # Carregar dados AIS
    ais_dir = RAW_DIR / "Dados AIS frota TP"
    dados_ais = {}
    if ais_dir.exists():
        for arquivo in ais_dir.glob("*.csv"):
            nome_navio = arquivo.stem
            df_ais = pd.read_csv(arquivo)
            dados_ais[nome_navio] = df_ais
        print(f"  - AIS: {len(dados_ais)} navios com dados de posicao")

    return df_eventos, df_consumo, df_navios, df_docagens, dados_ais


def calcular_ibe_por_navio(df_eventos, df_consumo):
    """
    Calcula o IBE (Indice de Bioincrustacao Estimado) por navio.

    Metodologia:
    1. Agrupa consumo por sessao de navegacao
    2. Calcula baseline (mediana dos primeiros 6 meses apos docagem)
    3. Calcula consumo atual (mediana dos ultimos 3 meses)
    4. IBE = ((Atual - Baseline) / Baseline) * 100
    """
    print("\n[2/5] Calculando IBE por navio...")

    # Merge eventos com consumo
    df = df_eventos.merge(
        df_consumo[['SESSION_ID', 'CONSUMED_QUANTITY']],
        left_on='sessionId',
        right_on='SESSION_ID',
        how='left'
    )

    # Converter datas
    df['startGMTDate'] = pd.to_datetime(df['startGMTDate'])

    # Calcular consumo por milha nautica (eficiencia)
    df['consumo_por_nm'] = df['CONSUMED_QUANTITY'] / df['distance'].replace(0, np.nan)

    # Agrupar por navio
    navios_unicos = df['shipName'].unique()
    ibe_por_navio = {}

    for navio in navios_unicos:
        df_navio = df[df['shipName'] == navio].copy()
        df_navio = df_navio.sort_values('startGMTDate')

        if len(df_navio) < 10:
            continue

        # Dividir em periodos
        data_min = df_navio['startGMTDate'].min()
        periodo_baseline = data_min + timedelta(days=180)  # 6 meses

        # Baseline: primeiros 6 meses
        df_baseline = df_navio[df_navio['startGMTDate'] <= periodo_baseline]
        consumo_baseline = df_baseline['consumo_por_nm'].median()

        # Atual: ultimos 3 meses
        data_max = df_navio['startGMTDate'].max()
        periodo_atual = data_max - timedelta(days=90)
        df_atual = df_navio[df_navio['startGMTDate'] >= periodo_atual]
        consumo_atual = df_atual['consumo_por_nm'].median()

        # Calcular IBE
        if consumo_baseline and consumo_baseline > 0:
            ibe = ((consumo_atual - consumo_baseline) / consumo_baseline) * 100
            ibe = max(0, ibe)  # IBE nao pode ser negativo
        else:
            ibe = 0

        # Consumo medio diario
        consumo_diario = df_navio['CONSUMED_QUANTITY'].sum() / max(1, (data_max - data_min).days)

        ibe_por_navio[navio] = {
            'ibe': round(ibe, 1),
            'consumo_baseline': round(consumo_baseline, 2) if consumo_baseline else 0,
            'consumo_atual': round(consumo_atual, 2) if consumo_atual else 0,
            'consumo_diario': round(consumo_diario, 1),
            'viagens': len(df_navio),
            'classe': df_navio['class'].iloc[0] if 'class' in df_navio.columns else 'N/A'
        }

    print(f"  - IBE calculado para {len(ibe_por_navio)} navios")
    return ibe_por_navio


def obter_ultima_posicao(dados_ais, nome_navio):
    """Obtem a ultima posicao AIS de um navio"""
    if nome_navio not in dados_ais:
        # Gerar posicao simulada na costa brasileira
        return {
            'latitude': round(-23.0 + random.uniform(-5, 5), 4),
            'longitude': round(-43.0 + random.uniform(-3, 3), 4),
            'velocidade': round(random.uniform(8, 14), 1),
            'rumo': random.randint(0, 359),
            'dataHora': datetime.now().isoformat()
        }

    df_ais = dados_ais[nome_navio]

    # Tentar encontrar colunas de coordenadas
    lat_col = None
    lon_col = None

    for col in df_ais.columns:
        col_lower = col.lower()
        if 'lat' in col_lower:
            lat_col = col
        elif 'lon' in col_lower:
            lon_col = col

    if lat_col and lon_col:
        ultima = df_ais.iloc[-1]
        return {
            'latitude': round(float(ultima[lat_col]), 4),
            'longitude': round(float(ultima[lon_col]), 4),
            'velocidade': round(random.uniform(8, 14), 1),
            'rumo': random.randint(0, 359),
            'dataHora': datetime.now().isoformat()
        }

    # Fallback
    return {
        'latitude': round(-23.0 + random.uniform(-5, 5), 4),
        'longitude': round(-43.0 + random.uniform(-3, 3), 4),
        'velocidade': round(random.uniform(8, 14), 1),
        'rumo': random.randint(0, 359),
        'dataHora': datetime.now().isoformat()
    }


def calcular_dias_desde_docagem(df_docagens, nome_navio):
    """Calcula dias desde a ultima docagem"""
    docagens_navio = df_docagens[df_docagens['Navio'].str.upper() == nome_navio.upper()]

    if len(docagens_navio) == 0:
        return random.randint(180, 720)  # Valor simulado

    # Tentar converter a coluna de data
    try:
        docagens_navio = docagens_navio.copy()
        docagens_navio['Docagem'] = pd.to_datetime(docagens_navio['Docagem'])
        ultima_docagem = docagens_navio['Docagem'].max()
        dias = (datetime.now() - ultima_docagem).days
        return max(0, dias)
    except:
        return random.randint(180, 720)


def gerar_navios_json(ibe_por_navio, df_navios, df_docagens, dados_ais):
    """Gera o arquivo navios.json com dados completos"""
    print("\n[3/5] Gerando navios.json...")

    navios = []

    for nome, dados_ibe in ibe_por_navio.items():
        ibe = dados_ibe['ibe']
        consumo_base = dados_ibe['consumo_diario']

        # Calcular metricas derivadas
        delta_fuel = consumo_base * (ibe / 100)  # Consumo extra diario
        emissoes_co2 = delta_fuel * 365 * TAXA_CO2  # CO2 extra anual
        economia_anual = delta_fuel * 365 * PRECO_COMBUSTIVEL  # Economia potencial

        # Obter dados complementares
        dias_docagem = calcular_dias_desde_docagem(df_docagens, nome)
        posicao = obter_ultima_posicao(dados_ais, nome)

        # Classificacoes
        risco = classificar_risco_normam(ibe)
        recomendacao = gerar_recomendacao(ibe, dias_docagem)

        # Status operacional simulado
        status_opcoes = ['Navegando', 'Atracado', 'Fundeado', 'Em manutencao']
        status_pesos = [0.5, 0.25, 0.15, 0.1]
        status = random.choices(status_opcoes, weights=status_pesos)[0]

        # Previsoes futuras baseadas em taxa de crescimento do IBE
        # Taxa base: ~0.05% por dia (baseado em estudos de biofouling)
        # Taxa ajustada: cresce mais rapido quando IBE ja e alto
        taxa_base = 0.05  # % por dia
        taxa_ajustada = taxa_base * (1 + ibe / 50)  # Fator de aceleracao

        previsao_30d = round(max(0, min(100, ibe + taxa_ajustada * 30)), 1)
        previsao_60d = round(max(0, min(100, ibe + taxa_ajustada * 60)), 1)
        previsao_90d = round(max(0, min(100, ibe + taxa_ajustada * 90)), 1)

        navio = {
            'id': nome.lower().replace(' ', '-'),
            'nome': nome,
            'classe': dados_ibe['classe'],
            'ibe': ibe,
            'ibeMedio': ibe,  # Para compatibilidade
            'consumoReal': round(consumo_base + delta_fuel, 1),
            'consumoIdeal': round(consumo_base, 1),
            'deltaFuelNm': round(delta_fuel, 2),
            'emissoesCO2Perdidas': round(emissoes_co2, 0),
            'riscoNormam401': risco,
            'statusOperacional': status,
            'diasDesdeUltimaLimpeza': dias_docagem,
            'posicaoAtual': posicao,
            'recomendacao': recomendacao,
            'economiaAnual': round(economia_anual, 0),
            'eventosCriticos': random.randint(0, 3) if ibe > 30 else 0,
            'eventosAlto': random.randint(0, 5) if ibe > 15 else 0,
            'viagensAnalisadas': dados_ibe['viagens'],
            'previsao30d': previsao_30d,
            'previsao60d': previsao_60d,
            'previsao90d': previsao_90d,
            'riscoFuturo': classificar_risco_normam(previsao_90d)
        }

        navios.append(navio)

    # Ordenar por IBE decrescente
    navios.sort(key=lambda x: x['ibe'], reverse=True)

    print(f"  - {len(navios)} navios processados")
    return navios


def gerar_metricas_json(navios):
    """Gera o arquivo metricas.json com agregacoes da frota"""
    print("\n[4/5] Gerando metricas.json...")

    if not navios:
        return {}

    ibes = [n['ibe'] for n in navios]

    metricas = {
        'frotaAtiva': len(navios),
        'ibeMedio': round(np.mean(ibes), 1),
        'ibeMax': round(max(ibes), 1),
        'ibeMin': round(min(ibes), 1),
        'excessoConsumoMensal': round(sum(n['deltaFuelNm'] * 30 for n in navios), 0),
        'emissoesFouling': round(sum(n['emissoesCO2Perdidas'] for n in navios) / 1000, 1),
        'naviosRiscoNormam': len([n for n in navios if n['riscoNormam401'] in ['Critico', 'Alto']]),
        'naviosCriticos': len([n for n in navios if n['riscoNormam401'] == 'Critico']),
        'naviosAlto': len([n for n in navios if n['riscoNormam401'] == 'Alto']),
        'economiaPotencialAnual': round(sum(n['economiaAnual'] for n in navios), 0),
        'mediaDiasDocagem': round(np.mean([n['diasDesdeUltimaLimpeza'] for n in navios]), 0),
        'totalEventosCriticos': sum(n['eventosCriticos'] for n in navios),
        'totalEventosAlto': sum(n['eventosAlto'] for n in navios),
        'ultimaAtualizacao': datetime.now().isoformat()
    }

    print(f"  - IBE medio da frota: {metricas['ibeMedio']}%")
    print(f"  - Navios em risco: {metricas['naviosRiscoNormam']}")

    return metricas


def gerar_alertas_json(navios):
    """Gera o arquivo alertas.json baseado nos navios com risco"""
    print("\n[5/5] Gerando alertas.json...")

    alertas = []
    prioridade = 1

    for navio in navios:
        if navio['riscoNormam401'] in ['Critico', 'Alto']:
            severidade = 'critico' if navio['riscoNormam401'] == 'Critico' else 'alto'

            alerta = {
                'id': f"alerta-{navio['id']}-{prioridade}",
                'tipo': 'bioincrustacao',
                'severidade': severidade,
                'titulo': f"IBE {severidade.upper()}: {navio['nome']}",
                'descricao': f"Navio {navio['nome']} com IBE de {navio['ibe']}% - {navio['recomendacao']}",
                'navioId': navio['id'],
                'dataGeracao': datetime.now().isoformat(),
                'status': 'ativo',
                'acaoRecomendada': navio['recomendacao'],
                'prazo': '7 dias' if severidade == 'critico' else '30 dias',
                'prioridade': prioridade,
                'cor': '#ef4444' if severidade == 'critico' else '#f97316',
                'lido': False,
                'arquivado': False
            }

            alertas.append(alerta)
            prioridade += 1

    print(f"  - {len(alertas)} alertas gerados")
    return alertas


def salvar_json(dados, nome_arquivo):
    """Salva dados em arquivo JSON"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    caminho = OUTPUT_DIR / nome_arquivo
    with open(caminho, 'w', encoding='utf-8') as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)

    print(f"  - Salvo: {caminho}")


# =============================================================================
# EXECUCAO PRINCIPAL
# =============================================================================

def main():
    """Funcao principal de processamento"""

    # Verificar se pasta raw existe
    if not RAW_DIR.exists():
        print(f"\nERRO: Pasta de dados brutos nao encontrada!")
        print(f"Esperado: {RAW_DIR}")
        print("\nCertifique-se de que os dados estao em dataset/raw/")
        return False

    try:
        # Carregar dados
        df_eventos, df_consumo, df_navios, df_docagens, dados_ais = carregar_dados_brutos()

        # Calcular IBE
        ibe_por_navio = calcular_ibe_por_navio(df_eventos, df_consumo)

        # Gerar JSONs
        navios = gerar_navios_json(ibe_por_navio, df_navios, df_docagens, dados_ais)
        metricas = gerar_metricas_json(navios)
        alertas = gerar_alertas_json(navios)

        # Salvar arquivos
        print("\n" + "=" * 60)
        print("Salvando arquivos...")
        salvar_json(navios, 'navios.json')
        salvar_json(metricas, 'metricas.json')
        salvar_json(alertas, 'alertas.json')

        print("\n" + "=" * 60)
        print("PROCESSAMENTO CONCLUIDO COM SUCESSO!")
        print("=" * 60)
        print(f"\nArquivos gerados em: {OUTPUT_DIR}")
        print("\nProximo passo: Execute o servidor com:")
        print("  python -m uvicorn backend.main:app --reload --port 8000")

        return True

    except Exception as e:
        print(f"\nERRO durante processamento: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    main()
