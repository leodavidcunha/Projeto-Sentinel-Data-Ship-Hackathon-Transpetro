import { MetricasESG, IndicadorAmbiental, ProjetoDescarbonizacao } from '../types/ESG';

/**
 * Métricas ESG consolidadas da frota
 */
export const metricasESGFrotaMock: MetricasESG = {
  navioId: 'frota-completa',
  periodo: '2024',
  emissoesCO2Total: 458920,
  emissoesCO2Fouling: 89340,
  emissoesCO2Evitadas: 12450,
  consumoCombustivelTotal: 145680,
  consumoExcessoFouling: 28350,
  economiaFinanceira: 42525000,
  eficienciaEnergetica: 8.45,
  intensidadeCarbono: 6.82,
  metaDescarbonizacao: 25,
  progressoMeta: 18.7
};

/**
 * Indicadores ambientais principais
 */
export const indicadoresAmbientaisMock: IndicadorAmbiental[] = [
  {
    nome: 'Emissões CO₂ por Milha Náutica',
    valor: 6.82,
    unidade: 'kg/nm',
    meta: 5.5,
    variacao: -8.3,
    status: 'Abaixo da Meta',
    tendencia: 'Melhorando'
  },
  {
    nome: 'Eficiência Energética (EEOI)',
    valor: 8.45,
    unidade: 'gCO₂/t.nm',
    meta: 7.8,
    variacao: -12.5,
    status: 'Abaixo da Meta',
    tendencia: 'Melhorando'
  },
  {
    nome: 'Consumo Médio da Frota',
    valor: 38.7,
    unidade: 'L/nm',
    meta: 32.5,
    variacao: -5.2,
    status: 'Abaixo da Meta',
    tendencia: 'Melhorando'
  },
  {
    nome: 'IBI Médio da Frota',
    valor: 56.3,
    unidade: 'pontos',
    meta: 40,
    variacao: -3.8,
    status: 'Abaixo da Meta',
    tendencia: 'Melhorando'
  },
  {
    nome: 'Taxa de Conformidade NORMAM-401',
    valor: 85.7,
    unidade: '%',
    meta: 95,
    variacao: 4.2,
    status: 'Abaixo da Meta',
    tendencia: 'Melhorando'
  },
  {
    nome: 'Economia Anual com Gestão',
    valor: 42.5,
    unidade: 'milhões R$',
    meta: 35,
    variacao: 21.4,
    status: 'Acima da Meta',
    tendencia: 'Melhorando'
  }
];

/**
 * Projetos de descarbonização em andamento
 */
export const projetosDescarbonizacaoMock: ProjetoDescarbonizacao[] = [
  {
    id: 'proj-001',
    nome: 'Programa de Limpeza Preventiva',
    descricao: 'Implementação de limpezas subaquáticas preventivas para manter IBI &lt; 40',
    naviosEnvolvidos: ['nav-001', 'nav-002', 'nav-003', 'nav-005', 'nav-010'],
    dataInicio: '2024-01-01',
    dataFim: '2025-12-31',
    investimento: 8500000,
    reducaoEsperadaCO2: 15600,
    economiaEsperada: 23400000,
    status: 'Em Execução',
    progresso: 42
  },
  {
    id: 'proj-002',
    nome: 'Otimização de Rotas com IA',
    descricao: 'Sistema de recomendação de rotas considerando condições meteo-oceânicas e risco de fouling',
    naviosEnvolvidos: ['nav-001', 'nav-002', 'nav-003', 'nav-004', 'nav-005', 'nav-006', 'nav-007', 'nav-008'],
    dataInicio: '2024-06-01',
    dataFim: '2025-06-30',
    investimento: 3200000,
    reducaoEsperadaCO2: 8900,
    economiaEsperada: 13350000,
    status: 'Em Execução',
    progresso: 68
  },
  {
    id: 'proj-003',
    nome: 'Revestimento Anti-fouling Avançado',
    descricao: 'Aplicação de tintas de última geração com tecnologia de liberação controlada',
    naviosEnvolvidos: ['nav-011', 'nav-021'],
    dataInicio: '2024-09-01',
    dataFim: '2025-03-31',
    investimento: 5600000,
    reducaoEsperadaCO2: 12400,
    economiaEsperada: 18600000,
    status: 'Em Execução',
    progresso: 55
  },
  {
    id: 'proj-004',
    nome: 'Sistema de Monitoramento Contínuo',
    descricao: 'Instalação de sensores IoT para monitoramento em tempo real de fouling',
    naviosEnvolvidos: ['nav-001', 'nav-003', 'nav-011'],
    dataInicio: '2025-01-01',
    dataFim: '2025-12-31',
    investimento: 2800000,
    reducaoEsperadaCO2: 5200,
    economiaEsperada: 7800000,
    status: 'Planejado',
    progresso: 5
  },
  {
    id: 'proj-005',
    nome: 'Compliance NORMAM-401 Total',
    descricao: 'Adequação completa da frota aos requisitos da NORMAM-401',
    naviosEnvolvidos: ['nav-001', 'nav-002', 'nav-003', 'nav-004', 'nav-005', 'nav-006', 'nav-007', 'nav-008', 'nav-009', 'nav-010', 'nav-011', 'nav-012', 'nav-013', 'nav-014', 'nav-015', 'nav-016', 'nav-017', 'nav-018', 'nav-019', 'nav-020', 'nav-021'],
    dataInicio: '2024-03-01',
    dataFim: '2025-12-31',
    investimento: 12500000,
    reducaoEsperadaCO2: 0,
    economiaEsperada: 0,
    status: 'Em Execução',
    progresso: 78
  }
];

/**
 * Iniciativas ESG da frota
 */
export const iniciativasESG = [
  {
    id: 'init-001',
    titulo: 'Programa de Limpeza Preventiva',
    categoria: 'Ambiental',
    descricao: 'Implementação de limpezas subaquáticas preventivas para manter IBI < 40 e reduzir emissões de CO₂',
    status: 'Em Andamento',
    progresso: 42,
    impactoCO2: 15600,
    investimento: 8500000,
    economiaEsperada: 23400000,
    dataInicio: '2024-01-01',
    dataFim: '2025-12-31',
    objetivos: [
      'Reduzir emissões de CO₂ em 15.600 toneladas/ano',
      'Manter IBI médio abaixo de 40 pontos',
      'Economizar R$ 23,4 milhões em combustível'
    ],
    beneficios: [
      'Redução de 3,4% nas emissões totais da frota',
      'Melhoria na eficiência energética',
      'Conformidade com metas ESG'
    ],
    cronograma: [
      { fase: 'Planejamento', status: 'Concluída', data: '2024-01-01' },
      { fase: 'Implementação', status: 'Em Andamento', data: '2024-06-01' },
      { fase: 'Monitoramento', status: 'Planejada', data: '2025-01-01' }
    ]
  },
  {
    id: 'init-002',
    titulo: 'Otimização de Rotas com IA',
    categoria: 'Tecnologia',
    descricao: 'Sistema de recomendação de rotas considerando condições meteo-oceânicas e risco de fouling',
    status: 'Em Andamento',
    progresso: 68,
    impactoCO2: 8900,
    investimento: 3200000,
    economiaEsperada: 13350000,
    dataInicio: '2024-06-01',
    dataFim: '2025-06-30',
    objetivos: [
      'Reduzir emissões de CO₂ em 8.900 toneladas/ano',
      'Otimizar consumo de combustível em 6%',
      'Reduzir tempo de viagem em 4%'
    ],
    beneficios: [
      'Economia de R$ 13,35 milhões/ano',
      'Redução de exposição a áreas de alto risco de fouling',
      'Melhoria na previsibilidade de chegada'
    ],
    cronograma: [
      { fase: 'Desenvolvimento', status: 'Concluída', data: '2024-06-01' },
      { fase: 'Testes Piloto', status: 'Concluída', data: '2024-09-01' },
      { fase: 'Expansão Frota', status: 'Em Andamento', data: '2024-12-01' }
    ]
  },
  {
    id: 'init-003',
    titulo: 'Revestimento Anti-fouling Avançado',
    categoria: 'Ambiental',
    descricao: 'Aplicação de tintas de última geração com tecnologia de liberação controlada',
    status: 'Em Andamento',
    progresso: 55,
    impactoCO2: 12400,
    investimento: 5600000,
    economiaEsperada: 18600000,
    dataInicio: '2024-09-01',
    dataFim: '2025-03-31',
    objetivos: [
      'Reduzir emissões de CO₂ em 12.400 toneladas/ano',
      'Aumentar intervalo entre limpezas em 40%',
      'Reduzir uso de biocidas em 30%'
    ],
    beneficios: [
      'Economia de R$ 18,6 milhões em 3 anos',
      'Menor impacto ambiental',
      'Redução de custos operacionais'
    ],
    cronograma: [
      { fase: 'Seleção de Tecnologia', status: 'Concluída', data: '2024-09-01' },
      { fase: 'Aplicação', status: 'Em Andamento', data: '2024-11-01' },
      { fase: 'Validação', status: 'Planejada', data: '2025-04-01' }
    ]
  },
  {
    id: 'init-004',
    titulo: 'Sistema de Monitoramento Contínuo',
    categoria: 'Tecnologia',
    descricao: 'Instalação de sensores IoT para monitoramento em tempo real de fouling',
    status: 'Planejado',
    progresso: 5,
    impactoCO2: 5200,
    investimento: 2800000,
    economiaEsperada: 7800000,
    dataInicio: '2025-01-01',
    dataFim: '2025-12-31',
    objetivos: [
      'Monitoramento em tempo real de 100% da frota',
      'Detecção precoce de fouling',
      'Otimização de cronograma de limpezas'
    ],
    beneficios: [
      'Redução de 5.200 toneladas CO₂/ano',
      'Economia de R$ 7,8 milhões/ano',
      'Melhoria na tomada de decisões'
    ],
    cronograma: [
      { fase: 'Aquisição de Sensores', status: 'Em Andamento', data: '2025-01-01' },
      { fase: 'Instalação', status: 'Planejada', data: '2025-03-01' },
      { fase: 'Integração Sistemas', status: 'Planejada', data: '2025-06-01' }
    ]
  },
  {
    id: 'init-005',
    titulo: 'Compliance NORMAM-401 Total',
    categoria: 'Governança',
    descricao: 'Adequação completa da frota aos requisitos da NORMAM-401',
    status: 'Em Andamento',
    progresso: 78,
    impactoCO2: 0,
    investimento: 12500000,
    economiaEsperada: 0,
    dataInicio: '2024-03-01',
    dataFim: '2025-12-31',
    objetivos: [
      'Conformidade 100% com NORMAM-401',
      'Certificação de todos os navios',
      'Eliminação de riscos regulatórios'
    ],
    beneficios: [
      'Evitar multas e sanções',
      'Melhoria da reputação corporativa',
      'Acesso a novos mercados'
    ],
    cronograma: [
      { fase: 'Auditoria Inicial', status: 'Concluída', data: '2024-03-01' },
      { fase: 'Adequações', status: 'Em Andamento', data: '2024-06-01' },
      { fase: 'Certificação', status: 'Planejada', data: '2025-10-01' }
    ]
  },
  {
    id: 'init-006',
    titulo: 'Programa de Capacitação ESG',
    categoria: 'Social',
    descricao: 'Treinamento de tripulações em práticas sustentáveis e gestão ambiental',
    status: 'Em Andamento',
    progresso: 35,
    impactoCO2: 2100,
    investimento: 1200000,
    economiaEsperada: 3150000,
    dataInicio: '2024-08-01',
    dataFim: '2025-08-31',
    objetivos: [
      'Capacitar 100% das tripulações',
      'Implementar cultura de sustentabilidade',
      'Reduzir desperdícios operacionais'
    ],
    beneficios: [
      'Melhoria no engajamento das equipes',
      'Redução de incidentes ambientais',
      'Economia operacional de R$ 3,15 milhões'
    ],
    cronograma: [
      { fase: 'Desenvolvimento Conteúdo', status: 'Concluída', data: '2024-08-01' },
      { fase: 'Treinamentos', status: 'Em Andamento', data: '2024-10-01' },
      { fase: 'Avaliação', status: 'Planejada', data: '2025-06-01' }
    ]
  }
];
