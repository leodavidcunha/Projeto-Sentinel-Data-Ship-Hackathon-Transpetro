================================================================================
SENTINELDATASHIP - COMO OS DADOS FORAM PROCESSADOS
================================================================================


DE ONDE VIERAM OS DADOS
--------------------------------------------------------------------------------

Usamos os dados fornecidos pelo hackathon da Transpetro:

1. POSICAO DOS NAVIOS (AIS)
   - Pasta: `Dados AIS frota TP/`
   - Arquivos: Um CSV por navio (ex: `RAUL MARTINS.csv`, `BRUNO LIMA.csv`, etc)
   - Conteudo: latitude, longitude, velocidade, rumo de cada navio

2. VIAGENS E CONSUMO
   - Arquivo principal: `df_master_transpetro_enriched.csv`
   - Este arquivo ja veio enriquecido com todas as informacoes cruzadas
   - Conteudo: cada linha e uma viagem com consumo, distancia, clima, etc

   Arquivos originais que geraram o enriched:
   - `ResultadoQueryEventos.csv` - registros de eventos/viagens
   - `ResultadoQueryConsumo.csv` - dados de consumo de combustivel

3. INFORMACOES DOS NAVIOS
   - Arquivo: `Dados navios Hackathon.xlsx`
   - Conteudo: caracteristicas de cada navio da frota

4. HISTORICO DE LIMPEZAS
   - Arquivo: `Relatorios IWS.xlsx`
   - Conteudo: datas de docagem e limpeza de casco


================================================================================
LIMPEZA DOS DADOS
================================================================================

O QUE ENCONTRAMOS DE ERRADO
--------------------------------------------------------------------------------

- Viagens sem dados de consumo
- Valores zerados ou negativos
- Consumos muito altos (provavelmente erros de medicao)


O QUE FIZEMOS
--------------------------------------------------------------------------------

1. Removemos viagens com dados faltando ou errados

2. Quando faltava informacao do tempo, estimamos:
   - Se tinha dado de vento, calculamos como estaria o mar
   - Se nao tinha nada, usamos a media geral

3. Padronizamos tudo para mesma unidade (kg por milha)


================================================================================
COMO CALCULAMOS O IBE
================================================================================

IBE = Indice de Bioincrustacao Estimado
Em outras palavras: quanto combustivel extra o navio esta gastando (em %)


PASSO 1 - DESCOBRIR O CONSUMO NORMAL (BASELINE)
--------------------------------------------------------------------------------

Primeiro precisamos saber quanto o navio gasta quando esta "limpo".

Como fizemos:
- Pegamos todas as viagens do navio
- Filtramos so as viagens em que o tempo estava bom:
  * Vento entre 3 e 5 na escala Beaufort (brisa leve a moderada)
  * Mar entre 0 e 3 (mar tranquilo)
- Calculamos o consumo medio dessas viagens
- Esse valor e o "consumo normal" daquele navio

Por que so viagens com tempo bom?
- Porque assim eliminamos o efeito do clima
- O consumo nessas condicoes reflete so as caracteristicas do navio

Se nao tinha viagens suficientes com tempo bom (menos de 10):
- Pegamos todas as viagens
- Usamos os 25% menores consumos como referencia
- Assim temos uma estimativa do "melhor caso" do navio


PASSO 2 - VER O CONSUMO ATUAL
--------------------------------------------------------------------------------

Agora precisamos saber quanto o navio esta gastando hoje.

Como fizemos:
- Pegamos todas as viagens recentes do navio
- Calculamos a media do consumo por milha

Por que a media?
- Porque uma viagem so pode ter sido em condicoes ruins
- A media de varias viagens da um valor mais confiavel


PASSO 3 - COMPARAR E CALCULAR O IBE
--------------------------------------------------------------------------------

Agora comparamos o consumo atual com o consumo normal.

Conta simples:
- IBE = (Consumo Atual - Consumo Normal) / Consumo Normal x 100

Exemplo pratico:
- Consumo normal do navio: 0.10 kg por milha
- Consumo atual do navio: 0.12 kg por milha
- Diferenca: 0.02 kg por milha
- IBE = 0.02 / 0.10 x 100 = 20%

O que isso significa:
- O navio esta gastando 20% mais combustivel do que deveria
- Esse excesso pode ser por sujeira no casco, clima ruim, ou outros fatores


PASSO 4 - SEPARAR AS CAUSAS DO GASTO EXTRA
--------------------------------------------------------------------------------

O IBE mostra o gasto extra total, mas precisamos saber a causa.

O gasto extra pode ser por:

1. TEMPO RUIM (vento e mar)
   - Vento forte aumenta a resistencia do ar
   - Mar agitado faz o navio balançar e perder eficiencia
   - Calculamos: quanto do excesso e por causa do tempo?

2. CARGA (peso do navio)
   - Navio mais pesado afunda mais na agua
   - Mais area em contato com a agua = mais arrasto
   - Calculamos: quanto do excesso e por causa da carga?

3. TRIM (inclinacao do navio)
   - Se o navio esta inclinado demais pra frente ou pra tras
   - Isso aumenta o arrasto e o consumo
   - Calculamos: quanto do excesso e por causa do trim?

4. SUJEIRA NO CASCO (bioincrustacao)
   - O que sobra depois de descontar os outros fatores
   - Se nao conseguimos explicar pelo tempo, carga ou trim
   - Provavelmente e sujeira no casco

Resultado:
- O sistema mostra a porcentagem de cada fator
- Exemplo: "60% do excesso e por sujeira, 30% por clima, 10% por carga"


================================================================================
CRUZAMENTO COM DADOS DO CLIMA
================================================================================

O arquivo `df_master_transpetro_enriched.csv` ja veio com varias informacoes
cruzadas em cada viagem. Nos usamos essas informacoes para calcular o impacto
de cada fator no consumo.

DADOS QUE CADA VIAGEM TEM:
--------------------------------------------------------------------------------

- Nome do navio
- Data da viagem
- Consumo de combustivel (em kg)
- Distancia percorrida (em milhas)
- Velocidade media
- Escala Beaufort (forca do vento)
- Sea Condition (estado do mar)
- Trim (inclinacao do navio)
- Displacement (peso total do navio com carga)


COMO CRUZAMOS OS DADOS:
--------------------------------------------------------------------------------

Para cada navio, agrupamos todas as viagens e calculamos:

1. MEDIA DO VENTO (Beaufort)
   - Pegamos o Beaufort de cada viagem
   - Calculamos a media de todas as viagens
   - Comparamos com o ideal (Beaufort 4)
   - Cada ponto de diferenca = mais impacto no consumo

2. MEDIA DO MAR (Sea Condition)
   - Pegamos o estado do mar de cada viagem
   - Calculamos a media
   - Comparamos com o ideal (Sea Condition 2)
   - Mar mais agitado = mais impacto no consumo

3. MEDIA DO TRIM
   - Pegamos o trim de cada viagem
   - Calculamos a media
   - Comparamos com o ideal (-0.5 metros)
   - Quanto mais longe do ideal = mais impacto

4. MEDIA DA CARGA
   - Pegamos o peso (displacement) de cada viagem
   - Comparamos com o peso minimo registrado (navio vazio)
   - Calculamos quanto de carga extra tinha em media

5. CONSUMO POR MILHA
   - Dividimos o combustivel gasto pela distancia
   - Isso da o consumo "por milha" de cada viagem
   - Permite comparar viagens de distancias diferentes


VENTO E MAR - O QUE SIGNIFICAM OS NUMEROS:
--------------------------------------------------------------------------------

VENTO (Escala Beaufort):
- 0 = sem vento (calmaria)
- 1-3 = vento fraco (brisa leve)
- 4-5 = vento normal (brisa moderada) <-- IDEAL
- 6-7 = vento forte
- 8+ = temporal/tempestade

MAR (Sea Condition):
- 0 = mar espelho (sem ondas)
- 1-2 = mar calmo (ondas pequenas) <-- IDEAL
- 3-4 = mar moderado
- 5-6 = mar agitado
- 7+ = mar muito agitado


COMO CALCULAMOS O IMPACTO DE CADA FATOR:
--------------------------------------------------------------------------------

IMPACTO DO VENTO:
- Vento ideal = Beaufort 4
- Cada ponto de diferenca do ideal adiciona ~2% no consumo
- Exemplo: Beaufort medio 6 = 2 pontos acima = +4% de consumo

IMPACTO DO MAR:
- Mar ideal = Sea Condition 2
- Cada ponto acima do ideal adiciona ~1.5% no consumo
- Exemplo: Sea Condition medio 4 = 2 pontos acima = +3% de consumo

IMPACTO DO TRIM:
- Trim ideal = -0.5 metros (leve inclinacao pra popa)
- Cada metro de diferenca adiciona ~3% no consumo
- Exemplo: Trim medio +1m = 1.5m de diferenca = +4.5% de consumo

IMPACTO DA CARGA:
- Comparamos com o navio vazio
- Cada 10% de carga extra adiciona ~2% no consumo
- Exemplo: 30% mais carga = +6% de consumo

O QUE SOBRA = BIOINCRUSTACAO:
- Somamos os impactos: vento + mar + trim + carga
- Subtraimos do excesso total
- O resto e provavelmente sujeira no casco


EXEMPLO PRATICO COMPLETO:
--------------------------------------------------------------------------------

Navio "Exemplo" esta gastando 25% a mais que o normal.

Analise:
- Vento medio foi Beaufort 6 (2 acima do ideal) = +4%
- Mar medio foi Sea Condition 5 (3 acima do ideal) = +4.5%
- Trim medio foi +0.5m (1m do ideal) = +3%
- Carga foi 20% acima do minimo = +4%

Soma dos fatores conhecidos: 4% + 4.5% + 3% + 4% = 15.5%
Excesso total: 25%
Sobra inexplicada: 25% - 15.5% = 9.5%

Conclusao: ~9.5% do excesso e provavelmente por sujeira no casco.


================================================================================
COMO PREVEMOS O FUTURO
================================================================================

1. Olhamos como o IBE foi crescendo nos ultimos meses
2. Projetamos como vai estar em 30, 60 e 90 dias

Exemplo:
- IBE hoje: 18%
- Cresce 2% por mes
- Daqui 3 meses: 24%


CLASSIFICACAO
--------------------------------------------------------------------------------

- CRITICO (vermelho): mais de 30% - limpar urgente
- ALTO (laranja): entre 15% e 30% - agendar limpeza
- MEDIO (amarelo): entre 5% e 15% - ficar de olho
- NORMAL (verde): menos de 5% - OK


================================================================================
ALERTAS AUTOMATICOS
================================================================================

O sistema avisa automaticamente quando:

- Um navio passa de 15% de IBE
- Um navio passa de 30% de IBE
- A previsao mostra que vai passar do limite em breve


================================================================================
RESUMO DO PROCESSO
================================================================================

DADOS DO HACKATHON
      |
      v
LIMPEZA (tira dados errados)
      |
      v
CALCULO DO CONSUMO NORMAL (baseline)
      |
      v
CALCULO DO IBE (consumo atual vs normal)
      |
      v
CRUZAMENTO COM CLIMA (vento, mar, trim, carga)
      |
      v
SEPARACAO DE FATORES (desconta tempo, carga, etc)
      |
      v
PREVISAO (projeta para 30, 60, 90 dias)
      |
      v
ALERTAS (avisa quem precisa de atencao)
      |
      v
DASHBOARD (mostra tudo na tela)


================================================================================
