<img width="883" height="453" alt="logo sentinel data ship" src="https://github.com/user-attachments/assets/23d6f64c-75ab-42a2-aa1a-61ad95abb214" />
<h1 align="center">
  🛰️ Sentinel Data Ship
</h1>

<h3 align="center">
  Plataforma inteligente para monitoramento, previsão e compliance de bioincrustação na frota Transpetro
</h3>

<p align="center">
  <strong>Monitorar • Prever • Economizar Combustível • Reduzir Emissões • Garantir NORMAM-401</strong>
</p>

<p align="center">
  Hackathon Transpetro 2025
</p>


<h2 align="center">🧪 Protótipo Navegável / MVP</h2>

<p align="center">
  O protótipo oficial do <strong>Sentinel Data Ship</strong> está disponível online.<br>
  Pensando na melhor experiência do usuário, jurados, avaliadores e mentores<br>
  podem acessar a plataforma de forma simples e rápida clicando em:
</p>

<br>

<p align="center">
  <a href="https://hackaton-test-njly.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🔗 Entrar%20na%20Plataforma-1E90FF?style=for-the-badge" alt="Entrar na Plataforma com Dados Reais"><br>
    <i>Esta link é da plataforma desenvolvida com dados reais do DataSet da TransPetro e Dados Externos Meteorologicos
  </a>
</p>

<p align="center">
  <i>Clique diretamente em "Entrar" ou "Acessar Versão Demo" para explorar o MVP.</i>
</p>
---

## 🧭 Visão Geral

**Sentinel Data Ship** é uma plataforma de análise preditiva e apoio à decisão
focada em **bioincrustação (biofouling)** em embarcações da Transpetro.

O sistema integra:

- Dados operacionais da frota (AIS, consumo MCP, eventos)
- Inspeções de casco e histórico de docagens (IWS)
- Informações de tintas e características técnicas dos navios
- Dados meteo-oceanográficos via APIs (Open-Meteo)
- Regras de **compliance NORMAM-401**

Com isso, o Sentinel calcula o **Índice de Biofouling (IBI)**, prevê o crescimento da
incrustação, estima impacto energético e econômico e sugere o melhor momento
para manutenção, com aprovação final do gestor.

---

## 📊 Funcionalidades da Plataforma

### 🔹 1. Índice de Biofouling Estimada (IBE)

- Cálculo do IBE por navio e período
- Correção por condições meteo-oceanográficas
- Explicação dos fatores que mais impactaram o índice
- Histórico e tendência de degradação do casco

### 🔹 2. Previsão de Fouling e Consumo

- Previsão do IBE para 7 / 15 / 30 dias
- Estimativa de consumo extra de combustível (Δ t/dia, Δ t/nm)
- Cenários de economia caso a limpeza seja realizada

### 🔹 3. Compliance NORMAM-401

- Geofencing das regiões biogeográficas brasileiras
- Verificação automática do grau de incrustação permitido antes de travessias
- Alertas de risco de não conformidade (multas / detenção de navio)
- Relatórios de suporte à área regulatória

### 🔹 4. Recomendações de Manutenção

- Sugestão de janelas ideais para limpeza / inspeção
- Comparação de cenários (manter, limpar, alterar rota, limpar em porto)
- Estimativa de impacto financeiro e de emissões
- Fluxo de aprovação do gestor (Aprovar / Rejeitar / Reavaliar depois)

### 🔹 5. Input Manual & Upload Inteligente

- Formulário para inserção manual de dados operacionais
- Upload de planilhas e relatórios (CSV/XLSX)
- Interpretação automática por IA e integração ao dataset mestre

### 🔹 6. Dashboards e Alertas

- Painel por navio e visão consolidada da frota
- Linha do tempo do IBI (histórico + previsão)
- Indicadores de consumo, emissões e economia potencial
- Lista de alertas críticos e recomendações pendentes

---

## 🧱 Arquitetura Resumida

```text
Data Layer
 ├─ Dados AIS
 ├─ Consumo MCP
 ├─ Eventos de operação
 ├─ Inspeções / Limpezas (IWS)
 ├─ Dados dos navios e tintas
 └─ APIs Open-Meteo (clima, ondas, correntes)

Model & Analytics
 ├─ Índice de Biofouling (IBI)
 ├─ Modelo de previsão de IBI
 ├─ Modelo de consumo extra
 └─ Motor de compliance NORMAM-401

Application Layer
 ├─ Dashboards web
 ├─ Módulo de recomendações
 ├─ Módulo de manutenção & limpeza
 └─ API interna para integrações

Infra
 ├─ Backend: Python (FastAPI)
 ├─ Modelagem: Python, Pandas, Scikit-Learn / XGBoost
 ├─ Banco: PostgreSQL / TimescaleDB
 └─ Frontend: React / Styled Components

▶️ Como Executar o Projeto (MVP)

Exemplo de comandos – ajuste conforme a estrutura real do repositório.

1. Clonar o repositório
git clone https://github.com/seu-usuario/sentineldataship.git
cd sentineldataship

2. Backend (API + Modelos)
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn api.main:app --reload


API disponível em: http://localhost:8000

3. Frontend (Dashboards)
cd frontend
npm install
npm start


Frontend disponível em: http://localhost:3000

## 🌦️ Integração com API Open-Meteo (Meteorologia e Oceanografia)

O Sentinel Data Ship utiliza dados avançados da **Open-Meteo API**, uma plataforma gratuita e de alta confiabilidade que
fornece informações meteorológicas, oceânicas e climáticas essenciais para diferenciar **bioincrustação real** de **perdas
hidrodinâmicas causadas por condições ambientais**.

### 🔗 APIs Integradas
As seguintes APIs da Open-Meteo são utilizadas no projeto:

- **API de Meteorologia Marinha**  
  ➝ Altura de ondas, direção, período, correntes marítimas, swell, SWH (Significant Wave Height).

- **API de Clima Histórico**  
  ➝ Condições ambientais passadas alinhadas ao AIS e consumo histórico para modelagem.

- **API de Previsão GFS / HRRR**  
  ➝ Previsões de vento, ondas e correntes para estimar impacto futuro no consumo.

- **API do ECMWF**  
  ➝ Modelos meteorológicos globais de alta precisão, reforçando previsões de fouling.

- **API de Ícones DWD**  
  ➝ Informações de tempo superficial com previsões rápidas e de alta resolução.

- **API de Mudanças Climáticas**  
  ➝ Variáveis macroambientais que influenciam regimes sazonais de bioincrustação.

---

### 📡 Como os dados são utilizados no Sentinel Data Ship

A cada registro de telemetria (AIS, consumo, velocidade, aproamento), a plataforma consulta as
APIs para obter o contexto ambiental do mesmo timestamp:

| Tipo de Dado | Fonte | Uso no Sistema |
|--------------|--------|----------------|
| **Vento (velocidade/direção)** | GFS / HRRR | Ajuste de resistência aerodinâmica e impacto em consumo |
| **Altura de ondas (SWH)** | Marine API | Correção de consumo para mares agitados |
| **Período e direção das ondas** | Marine API | Modelagem de impacto hidrodinâmico |
| **Correntes marítimas (velocidade/direção)** | Marine API | Ajustes de desempenho baseado em corrente contrária |
| **Condições meteorológicas gerais** | ECMWF, GFS | Exclusão de ruído ambiental no cálculo do IBI |
| **Histórico climático** | Climate API | Linhas de base sazonais de fouling |

---

### 🧠 Por que isso é essencial?

A bioincrustação **não pode ser estimada apenas** por consumo ou perda de velocidade.  
O Sentinel Data Ship utiliza dados da API Meteo para:

✔ Separar **impactos ambientais** de **impactos causados por fouling**  
✔ Evitar falsos alertas (ventos fortes ≠ casco sujo)  
✔ Aumentar a precisão do **Índice de Biofouling Estimado (IBE)**  
✔ Aprimorar a previsão de manutenção  
✔ Gerar economia real para a frota

---

```

<h2 align="center">👥 Equipe Sentinel Data Ship</h2>

<div align="center">

<table>
  <tr>
    <td align="center">
      <strong>Léo David Cunha</strong><br>
      📊 Negócios & Design UX UI
    </td>
    <td align="center">
      <strong>Glauber Honorato Paniago</strong><br>
      💻 Backend & Frontend
    </td>
    <td align="center">
      <strong>Matheus Guerson</strong><br>
      💻 Backend & Frontend
    </td>
  </tr>
</table>

</div>

<hr>


