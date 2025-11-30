"""
SentinelDataShip API - Backend para o Dashboard de Bioincrustacao
Serve dados REAIS processados pelo data_processor.py
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from datetime import datetime
import json

app = FastAPI(
    title="SentinelDataShip API",
    description="API para monitoramento de bioincrustacao da frota Transpetro",
    version="1.0.0"
)

# CORS para o frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Caminho dos dados processados - absoluto resolvido
DATA_PATH = Path(__file__).resolve().parent / "dataset" / "processed"
print(f"[INFO] DATA_PATH resolvido para: {DATA_PATH}")

# =============================================================================
# CACHE DE DADOS
# =============================================================================

_cache = {}

def carregar_json(nome: str):
    """Carrega arquivo JSON processado"""
    if nome not in _cache:
        path = DATA_PATH / f"{nome}.json"
        if path.exists():
            with open(path, 'r', encoding='utf-8') as f:
                _cache[nome] = json.load(f)
        else:
            _cache[nome] = None
    return _cache[nome]

def recarregar_dados():
    """Limpa cache para recarregar dados"""
    _cache.clear()

# =============================================================================
# ENDPOINTS DA API
# =============================================================================

@app.get("/")
def root():
    """Endpoint raiz"""
    return {
        "api": "SentinelDataShip",
        "version": "1.0.0",
        "descricao": "API com dados REAIS da frota Transpetro",
        "endpoints": [
            "/api/navios",
            "/api/metricas",
            "/api/alertas",
            "/api/navio/{id}",
            "/api/navio/{id}/analise-clima",
            "/api/clima/navios",
            "/api/health",
            "/api/reload"
        ]
    }

@app.get("/api/navios")
def listar_navios():
    """Lista todos os navios da frota"""
    navios = carregar_json("navios")
    return navios if navios else []

@app.get("/api/navio/{navio_id}")
def obter_navio(navio_id: str):
    """Obtem detalhes de um navio especifico"""
    navios = carregar_json("navios")
    if navios:
        for nav in navios:
            if nav['id'] == navio_id.upper():
                return nav
    return {"error": "Navio nao encontrado"}


@app.get("/api/navio/{navio_id}/analise-clima")
def analise_clima_navio(navio_id: str):
    """
    Retorna analise de impacto climatico para um navio especifico.
    Inclui separacao de fatores e probabilidades de causa.
    """
    clima_indice = carregar_json("clima_por_navio_indice")

    # Converter ID de SNAKE_CASE para kebab-case
    # Ex: HENRIQUE_ALVES -> henrique-alves
    navio_id_normalizado = navio_id.lower().replace('_', '-')

    if clima_indice and navio_id_normalizado in clima_indice:
        return clima_indice[navio_id_normalizado]

    # Tentar ID original
    if clima_indice and navio_id in clima_indice:
        return clima_indice[navio_id]

    # Tentar buscar pelo nome do navio
    if clima_indice:
        for key, dados in clima_indice.items():
            if dados.get('navio', '').lower().replace(' ', '-') == navio_id.lower():
                return dados

    return {
        "error": "Analise climatica nao encontrada para este navio",
        "navioId": navio_id
    }


@app.get("/api/clima/navios")
def listar_analise_clima_todos():
    """Lista analise climatica de todos os navios"""
    clima = carregar_json("clima_por_navio")
    return clima if clima else []

@app.get("/api/metricas")
def obter_metricas():
    """Retorna metricas agregadas da frota"""
    metricas = carregar_json("metricas")
    return metricas if metricas else {}

@app.get("/api/alertas")
def listar_alertas():
    """Lista alertas criticos da frota"""
    alertas = carregar_json("alertas")
    return alertas if alertas else []

@app.get("/api/health")
def health_check():
    """Verificacao de saude da API"""
    recarregar_dados()  # Sempre recarrega para evitar cache
    navios = carregar_json("navios")
    metricas = carregar_json("metricas")
    alertas = carregar_json("alertas")
    clima = carregar_json("clima_por_navio")

    # Debug: verificar arquivos
    navios_path = DATA_PATH / "navios.json"

    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "data_path": str(DATA_PATH.resolve()),
        "navios_path": str(navios_path),
        "navios_exists": navios_path.exists(),
        "dados_disponiveis": {
            "navios": navios is not None,
            "metricas": metricas is not None,
            "alertas": alertas is not None,
            "clima": clima is not None,
            "qtd_navios": len(navios) if navios else 0,
            "qtd_clima": len(clima) if clima else 0
        }
    }

@app.post("/api/reload")
def reload_data():
    """Recarrega dados do disco"""
    recarregar_dados()
    return {"status": "dados recarregados", "timestamp": datetime.now().isoformat()}

# =============================================================================
# MAIN
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    print(f"Carregando dados de: {DATA_PATH}")
    uvicorn.run(app, host="0.0.0.0", port=8000)
