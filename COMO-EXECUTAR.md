# SentinelDataShip - Hackathon Transpetro 2025

Sistema de monitoramento de bioincrustacao (fouling) da frota de navios petroleiros.

## Como Executar

### Backend (API)

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --port 8001
```

API disponivel em: http://localhost:8001

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Interface disponivel em: http://localhost:5173

## Endpoints da API

- `GET /api/navios` - Lista todos os navios
- `GET /api/metricas` - Metricas agregadas da frota
- `GET /api/alertas` - Alertas de manutencao
- `GET /api/navio/{id}` - Detalhes de um navio
- `GET /api/navio/{id}/analise-clima` - Analise climatica
- `GET /api/clima/navios` - Analise climatica de toda frota

## Tecnologias

- **Backend**: Python, FastAPI, Pandas, NumPy
- **Frontend**: React, TypeScript, Tailwind CSS, Recharts
- **Dados**: CSV, JSON, Excel (dados reais da Transpetro)
