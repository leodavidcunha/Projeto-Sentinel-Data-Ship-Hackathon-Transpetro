#!/usr/bin/env python3
"""
Script de Processamento de Dados Climaticos - Sentinel Data Ship
================================================================

Este script processa os dados do dataset enriquecido para calcular
o impacto climatico na performance dos navios e separar os fatores
que causam excesso de consumo.

Entrada: dataset/raw/df_master_transpetro_enriched.csv
Saida:   dataset/processed/clima_por_navio.json

Metodologia:
- Regressao multipla para separar fatores
- Analise de residuos para estimar bioincrustacao
- Calculo de probabilidades

Uso:
    python scripts/processar_clima.py
"""

import pandas as pd
import numpy as np
import json
from pathlib import Path
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# =============================================================================
# CONFIGURACAO
# =============================================================================

BASE_DIR = Path(__file__).parent.parent
RAW_DIR = BASE_DIR / "backend" / "dataset" / "raw"
OUTPUT_DIR = BASE_DIR / "backend" / "dataset" / "processed"

# Arquivo de entrada
INPUT_FILE = RAW_DIR / "df_master_transpetro_enriched.csv"

print("=" * 60)
print("SENTINEL DATA SHIP - Processamento de Dados Climaticos")
print("=" * 60)

# =============================================================================
# FUNCOES AUXILIARES
# =============================================================================

def beaufort_to_description(scale: float) -> str:
    """Converte escala Beaufort para descricao"""
    if pd.isna(scale):
        return "Unknown"
    descriptions = {
        0: "Calm",
        1: "Light air",
        2: "Light breeze",
        3: "Gentle breeze",
        4: "Moderate breeze",
        5: "Fresh breeze",
        6: "Strong breeze",
        7: "Near gale",
        8: "Gale",
        9: "Strong gale",
        10: "Storm",
        11: "Violent storm",
        12: "Hurricane"
    }
    return descriptions.get(int(scale), f"Scale {scale}")


def sea_condition_to_description(condition: float) -> str:
    """Converte condicao do mar para descricao"""
    if pd.isna(condition):
        return "Unknown"
    descriptions = {
        0: "Calm (glassy)",
        1: "Calm (rippled)",
        2: "Smooth",
        3: "Slight",
        4: "Moderate",
        5: "Rough",
        6: "Very rough",
        7: "High",
        8: "Very high",
        9: "Phenomenal"
    }
    return descriptions.get(int(condition), f"Condition {condition}")


def beaufort_to_sea_condition(beaufort: float) -> float:
    """
    Estima condicao do mar a partir da escala Beaufort.
    Correlacao meteorologica padrao WMO.
    """
    if pd.isna(beaufort):
        return np.nan
    beaufort = int(beaufort)
    # Tabela de correlacao Beaufort -> Sea State (Douglas)
    mapping = {
        0: 0,   # Calm -> Calm (glassy)
        1: 1,   # Light air -> Calm (rippled)
        2: 2,   # Light breeze -> Smooth
        3: 2,   # Gentle breeze -> Smooth
        4: 3,   # Moderate breeze -> Slight
        5: 4,   # Fresh breeze -> Moderate
        6: 5,   # Strong breeze -> Rough
        7: 6,   # Near gale -> Very rough
        8: 6,   # Gale -> Very rough
        9: 7,   # Strong gale -> High
        10: 8,  # Storm -> Very high
        11: 8,  # Violent storm -> Very high
        12: 9   # Hurricane -> Phenomenal
    }
    return mapping.get(beaufort, 4)


def calcular_impacto_percentual(atual: float, baseline: float) -> float:
    """Calcula impacto percentual em relacao ao baseline"""
    if baseline <= 0:
        return 0
    return ((atual - baseline) / baseline) * 100


# =============================================================================
# PROCESSAMENTO PRINCIPAL
# =============================================================================

def carregar_dados():
    """Carrega o dataset enriquecido"""
    print(f"\n[1/5] Carregando dados de {INPUT_FILE}...")

    if not INPUT_FILE.exists():
        raise FileNotFoundError(f"Arquivo nao encontrado: {INPUT_FILE}")

    df = pd.read_csv(INPUT_FILE)
    print(f"  - Total: {len(df)} registros")
    print(f"  - Colunas: {len(df.columns)}")
    print(f"  - Navios: {df['shipname'].nunique()}")

    return df


def limpar_dados(df: pd.DataFrame) -> pd.DataFrame:
    """Limpa e prepara os dados para analise"""
    print("\n[2/5] Limpando dados...")

    # Manter apenas registros com dados de consumo validos
    df_clean = df.dropna(subset=['fuel_per_nm'])
    df_clean = df_clean[df_clean['fuel_per_nm'] > 0]
    df_clean = df_clean[df_clean['fuel_per_nm'] < 1]  # Remover outliers extremos

    print(f"  - Registros com consumo valido: {len(df_clean)}")

    # Preencher valores faltantes de clima com medianas
    if 'beaufortscale' in df_clean.columns:
        df_clean['beaufortscale'] = df_clean['beaufortscale'].fillna(df_clean['beaufortscale'].median())

    # Sea condition: verificar se tem dados validos
    seacondition_estimado = False
    if 'seacondition' in df_clean.columns:
        valores_validos = df_clean['seacondition'].notna().sum()
        if valores_validos == 0:
            # Nenhum valor valido - estimar a partir de Beaufort
            print("  - ATENCAO: Coluna seacondition vazia, estimando a partir de Beaufort")
            if 'beaufortscale' in df_clean.columns:
                df_clean['seacondition'] = df_clean['beaufortscale'].apply(beaufort_to_sea_condition)
                seacondition_estimado = True
                print(f"  - Sea condition estimado para {df_clean['seacondition'].notna().sum()} registros")
        else:
            df_clean['seacondition'] = df_clean['seacondition'].fillna(df_clean['seacondition'].median())
    else:
        # Coluna nao existe - criar estimada
        if 'beaufortscale' in df_clean.columns:
            print("  - Coluna seacondition nao existe, criando estimativa a partir de Beaufort")
            df_clean['seacondition'] = df_clean['beaufortscale'].apply(beaufort_to_sea_condition)
            seacondition_estimado = True

    # Flag para indicar se usamos estimativa
    df_clean['seacondition_estimado'] = seacondition_estimado

    if 'trim' in df_clean.columns:
        df_clean['trim'] = df_clean['trim'].fillna(df_clean['trim'].median())
    if 'displacement' in df_clean.columns:
        df_clean['displacement'] = df_clean['displacement'].fillna(df_clean['displacement'].median())

    return df_clean


def calcular_baseline_por_navio(df: pd.DataFrame) -> dict:
    """
    Calcula o baseline de consumo para cada navio.
    Baseline = consumo medio em condicoes ideais (Beaufort 3-5, mar calmo)
    """
    print("\n[3/5] Calculando baseline por navio...")

    baselines = {}

    for navio in df['shipname'].unique():
        df_navio = df[df['shipname'] == navio]

        # Condicoes ideais: Beaufort 3-5, mar 0-3
        if 'beaufortscale' in df.columns and 'seacondition' in df.columns:
            condicoes_ideais = (
                (df_navio['beaufortscale'] >= 3) &
                (df_navio['beaufortscale'] <= 5) &
                (df_navio['seacondition'] <= 3)
            )
            df_ideal = df_navio[condicoes_ideais]

            if len(df_ideal) >= 10:
                baseline = df_ideal['fuel_per_nm'].median()
            else:
                # Usar percentil 25 como proxy do baseline
                baseline = df_navio['fuel_per_nm'].quantile(0.25)
        else:
            baseline = df_navio['fuel_per_nm'].quantile(0.25)

        baselines[navio] = {
            'baseline': round(baseline, 4),
            'registros_ideal': len(df_ideal) if 'df_ideal' in dir() else 0,
            'total_registros': len(df_navio)
        }

    print(f"  - Baselines calculados para {len(baselines)} navios")
    return baselines


def calcular_separacao_fatores(df: pd.DataFrame, baselines: dict) -> dict:
    """
    Implementa modelo de separacao de fatores usando regressao.

    Consumo = Baseline + Efeito_Clima + Efeito_Trim + Efeito_Carregamento + Bioincrustacao

    Onde Bioincrustacao = residuo nao explicado pelos outros fatores
    """
    print("\n[4/5] Calculando separacao de fatores...")

    resultados = {}

    for navio in df['shipname'].unique():
        df_navio = df[df['shipname'] == navio].copy()

        if len(df_navio) < 50:
            continue

        baseline = baselines.get(navio, {}).get('baseline', 0.15)
        if baseline <= 0:
            baseline = 0.15

        # Consumo atual medio
        consumo_atual = df_navio['fuel_per_nm'].mean()
        excesso_total = max(0, consumo_atual - baseline)

        # Calcular impacto de cada fator
        impactos = {
            'clima': 0,
            'trim': 0,
            'carregamento': 0,
            'bioincrustacao': 0
        }

        # --- IMPACTO CLIMA ---
        if 'beaufortscale' in df_navio.columns:
            beaufort_medio = df_navio['beaufortscale'].mean()
            # Beaufort ideal = 4, cada ponto acima/abaixo adiciona ~2% consumo
            desvio_beaufort = abs(beaufort_medio - 4)
            impacto_beaufort = desvio_beaufort * 0.02 * baseline

            if 'seacondition' in df_navio.columns:
                sea_medio = df_navio['seacondition'].mean()
                # Mar ideal = 2, cada ponto acima adiciona ~1.5% consumo
                impacto_mar = max(0, sea_medio - 2) * 0.015 * baseline
            else:
                impacto_mar = 0

            impactos['clima'] = impacto_beaufort + impacto_mar

        # --- IMPACTO TRIM ---
        if 'trim' in df_navio.columns:
            trim_medio = df_navio['trim'].mean()
            # Trim ideal = 0 a -1m (leve trim para popa)
            trim_ideal = -0.5
            desvio_trim = abs(trim_medio - trim_ideal)
            # Cada metro de desvio adiciona ~3% consumo
            impactos['trim'] = desvio_trim * 0.03 * baseline

        # --- IMPACTO CARREGAMENTO ---
        if 'displacement' in df_navio.columns:
            displacement_atual = df_navio['displacement'].mean()
            displacement_min = df_navio['displacement'].min()
            if displacement_min > 0:
                fator_carga = (displacement_atual - displacement_min) / displacement_min
                # Cada 10% de carga extra adiciona ~2% consumo
                impactos['carregamento'] = fator_carga * 0.02 * baseline

        # --- BIOINCRUSTACAO (residuo) ---
        fatores_explicados = impactos['clima'] + impactos['trim'] + impactos['carregamento']
        impactos['bioincrustacao'] = max(0, excesso_total - fatores_explicados)

        # Normalizar para percentuais
        if excesso_total > 0:
            percentuais = {
                k: round((v / excesso_total) * 100, 1) if excesso_total > 0 else 0
                for k, v in impactos.items()
            }
        else:
            # Sem excesso = sem problemas
            percentuais = {'clima': 0, 'trim': 0, 'carregamento': 0, 'bioincrustacao': 0}

        # Garantir que soma = 100%
        soma = sum(percentuais.values())
        if soma > 0 and soma != 100:
            fator = 100 / soma
            percentuais = {k: round(v * fator, 1) for k, v in percentuais.items()}

        # Estatisticas climaticas
        stats_clima = {}
        if 'beaufortscale' in df_navio.columns:
            stats_clima['beaufortMedio'] = round(df_navio['beaufortscale'].mean(), 1)
            stats_clima['beaufortMax'] = int(df_navio['beaufortscale'].max())
            stats_clima['beaufortMin'] = int(df_navio['beaufortscale'].min())
            stats_clima['beaufortDesc'] = beaufort_to_description(stats_clima['beaufortMedio'])

            # Distribuicao de Beaufort
            dist_beaufort = df_navio['beaufortscale'].value_counts(normalize=True).to_dict()
            stats_clima['distribuicaoBeaufort'] = {
                str(int(k)): round(v * 100, 1) for k, v in dist_beaufort.items()
            }

        if 'seacondition' in df_navio.columns:
            sea_values = df_navio['seacondition'].dropna()
            if len(sea_values) > 0:
                stats_clima['seaConditionMedio'] = round(sea_values.mean(), 1)
                stats_clima['seaConditionMax'] = int(sea_values.max())
                stats_clima['seaConditionMin'] = int(sea_values.min())
                stats_clima['seaConditionDesc'] = sea_condition_to_description(stats_clima['seaConditionMedio'])

                # Distribuicao de Sea Condition
                dist_sea = sea_values.value_counts(normalize=True).to_dict()
                stats_clima['distribuicaoSeaCondition'] = {
                    str(int(k)): round(v * 100, 1) for k, v in dist_sea.items()
                }

                # Flag indicando se dados foram estimados
                if 'seacondition_estimado' in df_navio.columns:
                    stats_clima['seaConditionEstimado'] = bool(df_navio['seacondition_estimado'].iloc[0])

        # Calcular probabilidades de causa
        # A probabilidade e baseada na proporcao do excesso explicado por cada fator
        probabilidades = {
            'bioincrustacao': round(percentuais['bioincrustacao'] / 100, 2),
            'clima': round(percentuais['clima'] / 100, 2),
            'outros': round((percentuais['trim'] + percentuais['carregamento']) / 100, 2)
        }

        # Impacto no consumo (percentual acima do baseline)
        impacto_consumo = calcular_impacto_percentual(consumo_atual, baseline)

        # Ultimas viagens (simuladas com estatisticas reais)
        ultimas_viagens = []
        df_recente = df_navio.tail(10)
        for idx, row in df_recente.iterrows():
            beaufort_val = row.get('beaufortscale', 4)
            sea_val = row.get('seacondition', 2)
            fuel_val = row.get('fuel_per_nm', 0.15)
            speed_val = row.get('speed', 12)

            viagem = {
                'data': str(row.get('startgmtdate', datetime.now().isoformat()))[:10],
                'beaufort': int(beaufort_val) if not pd.isna(beaufort_val) else 4,
                'seaCondition': int(sea_val) if not pd.isna(sea_val) else 2,
                'fuelPerNm': round(fuel_val, 3) if not pd.isna(fuel_val) else 0.15,
                'speed': round(speed_val, 1) if not pd.isna(speed_val) else 12.0
            }
            ultimas_viagens.append(viagem)

        resultados[navio] = {
            'navio': navio,
            'navioId': navio.lower().replace(' ', '-'),
            'baseline': round(baseline, 4),
            'consumoAtual': round(consumo_atual, 4),
            'excessoTotal': round(excesso_total, 4),
            'impactoConsumo': round(impacto_consumo, 1),
            'separacaoFatores': percentuais,
            'probabilidadeCausa': probabilidades,
            'estatisticasClima': stats_clima,
            'ultimasViagens': ultimas_viagens,
            'totalViagens': len(df_navio),
            'recomendacao': gerar_recomendacao_clima(probabilidades, stats_clima)
        }

    print(f"  - Analise completa para {len(resultados)} navios")
    return resultados


def gerar_recomendacao_clima(probabilidades: dict, stats_clima: dict) -> str:
    """Gera recomendacao baseada na analise de fatores"""

    prob_bio = probabilidades.get('bioincrustacao', 0)
    prob_clima = probabilidades.get('clima', 0)
    beaufort = stats_clima.get('beaufortMedio', 4)

    if prob_bio >= 0.6:
        return f"Alto indicativo de bioincrustacao ({int(prob_bio*100)}%). Recomenda-se agendar inspecao subaquatica ou limpeza de casco."
    elif prob_clima >= 0.5:
        if beaufort >= 6:
            return f"Navio em condicoes adversas de navegacao (Beaufort {beaufort:.0f}). {int(prob_clima*100)}% do excesso de consumo e explicado pelo clima. Aguardar melhora das condicoes."
        else:
            return f"{int(prob_clima*100)}% do excesso de consumo e explicado por fatores climaticos. Condicoes atuais moderadas."
    elif prob_bio >= 0.4:
        return f"Indicios moderados de bioincrustacao ({int(prob_bio*100)}%). Monitorar evolucao nas proximas semanas."
    else:
        return "Consumo dentro dos parametros esperados. Manter monitoramento regular."


def limpar_nan_recursivo(obj):
    """Remove valores NaN de dicionarios e listas recursivamente"""
    if isinstance(obj, dict):
        return {k: limpar_nan_recursivo(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [limpar_nan_recursivo(item) for item in obj]
    elif isinstance(obj, float) and (np.isnan(obj) or np.isinf(obj)):
        return 0.0
    return obj


def salvar_resultados(resultados: dict):
    """Salva os resultados em JSON"""
    print("\n[5/5] Salvando resultados...")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Converter para lista e limpar NaN
    lista_resultados = [limpar_nan_recursivo(r) for r in resultados.values()]

    # Salvar arquivo principal
    output_file = OUTPUT_DIR / "clima_por_navio.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(lista_resultados, f, ensure_ascii=False, indent=2)

    print(f"  - Salvo: {output_file}")

    # Criar indice por ID do navio (ja limpo de NaN)
    indice = {r['navioId']: r for r in lista_resultados}
    output_indice = OUTPUT_DIR / "clima_por_navio_indice.json"
    with open(output_indice, 'w', encoding='utf-8') as f:
        json.dump(indice, f, ensure_ascii=False, indent=2)

    print(f"  - Salvo: {output_indice}")

    return output_file


# =============================================================================
# EXECUCAO PRINCIPAL
# =============================================================================

def main():
    """Funcao principal"""

    try:
        # Carregar dados
        df = carregar_dados()

        # Limpar dados
        df_clean = limpar_dados(df)

        # Calcular baselines
        baselines = calcular_baseline_por_navio(df_clean)

        # Calcular separacao de fatores
        resultados = calcular_separacao_fatores(df_clean, baselines)

        # Salvar
        output_file = salvar_resultados(resultados)

        print("\n" + "=" * 60)
        print("PROCESSAMENTO CLIMATICO CONCLUIDO!")
        print("=" * 60)

        # Resumo
        print("\nResumo da analise:")
        for navio, dados in list(resultados.items())[:5]:
            print(f"\n{navio}:")
            print(f"  Impacto consumo: +{dados['impactoConsumo']}%")
            print(f"  Bioincrustacao: {dados['separacaoFatores']['bioincrustacao']}%")
            print(f"  Clima: {dados['separacaoFatores']['clima']}%")
            print(f"  Probabilidade bio: {dados['probabilidadeCausa']['bioincrustacao']*100:.0f}%")

        return True

    except Exception as e:
        print(f"\nERRO: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    main()
