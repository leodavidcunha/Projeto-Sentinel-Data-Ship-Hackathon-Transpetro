import { PrevisaoIBI, CenarioLimpeza, PrevisaoConsumo } from '../types/Previsao';

export const previsoesIBI: PrevisaoIBI[] = [
  {
    id: 'PREV-001',
    navioId: 'NAVIO-001',
    dataPrevisao: '2025-02-15',
    ibiPrevisto: 68,
    confianca: 87,
    nivelRisco: 'alto',
    consumoExtraPrevisto: 12.5,
    recomendacoes: [
      'Agendar limpeza subaquática em Santos nos próximos 15 dias',
      'Reduzir velocidade de cruzeiro em 2 nós até a limpeza',
      'Evitar águas tropicais com temperatura acima de 28°C'
    ],
    fatoresContribuintes: {
      idleTime: 0.35,
      lowSpeed: 0.25,
      temperatura: 0.28,
      regiaoBio: 0.12
    }
  },
  {
    id: 'PREV-002',
    navioId: 'NAVIO-001',
    dataPrevisao: '2025-03-01',
    ibiPrevisto: 74,
    confianca: 82,
    nivelRisco: 'crítico',
    consumoExtraPrevisto: 15.8,
    recomendacoes: [
      'Limpeza urgente recomendada - IBI crítico previsto',
      'Considerar alteração de rota para evitar águas quentes',
      'Programar inspeção com ROV antes da limpeza'
    ],
    fatoresContribuintes: {
      idleTime: 0.38,
      lowSpeed: 0.27,
      temperatura: 0.25,
      regiaoBio: 0.10
    }
  },
  {
    id: 'PREV-003',
    navioId: 'NAVIO-002',
    dataPrevisao: '2025-02-15',
    ibiPrevisto: 45,
    confianca: 91,
    nivelRisco: 'médio',
    consumoExtraPrevisto: 6.2,
    recomendacoes: [
      'Manter monitoramento contínuo do IBI',
      'Programar limpeza preventiva em 60 dias',
      'Otimizar velocidade de cruzeiro para reduzir fouling'
    ],
    fatoresContribuintes: {
      idleTime: 0.15,
      lowSpeed: 0.20,
      temperatura: 0.35,
      regiaoBio: 0.30
    }
  }
];

export const cenariosLimpeza: CenarioLimpeza[] = [
  {
    id: 'CEN-001',
    nome: 'Manter Operação Atual',
    tipo: 'manter',
    custoEstimado: 0,
    economiaAnual: -2847000,
    reducaoIBI: 0,
    reducaoConsumo: 0,
    reducaoEmissoes: 0,
    payback: 0,
    recomendado: false
  },
  {
    id: 'CEN-002',
    nome: 'Limpeza Imediata em Santos',
    tipo: 'limpar_imediato',
    dataExecucao: '2025-02-05',
    portoLimpeza: 'Santos, BR',
    custoEstimado: 450000,
    economiaAnual: 2847000,
    reducaoIBI: 48,
    reducaoConsumo: 18.5,
    reducaoEmissoes: 1247,
    payback: 2,
    recomendado: true
  },
  {
    id: 'CEN-003',
    nome: 'Limpeza em Singapura (30 dias)',
    tipo: 'limpar_porto',
    dataExecucao: '2025-03-07',
    portoLimpeza: 'Singapura, SG',
    custoEstimado: 380000,
    economiaAnual: 2145000,
    reducaoIBI: 52,
    reducaoConsumo: 16.2,
    reducaoEmissoes: 1089,
    payback: 3,
    recomendado: false
  },
  {
    id: 'CEN-004',
    nome: 'Alterar Rota via Cabo da Boa Esperança',
    tipo: 'alterar_rota',
    dataExecucao: '2025-02-10',
    custoEstimado: 125000,
    economiaAnual: 890000,
    reducaoIBI: 12,
    reducaoConsumo: 4.8,
    reducaoEmissoes: 324,
    payback: 2,
    recomendado: false
  }
];

export const previsoesConsumo: PrevisaoConsumo[] = [
  {
    navioId: 'NAVIO-001',
    periodo: '2025-02',
    consumoBase: 1850,
    consumoPrevisto: 2187,
    incrementoFouling: 337,
    emissoesCO2: 1069,
    custoAdicional: 236950
  },
  {
    navioId: 'NAVIO-001',
    periodo: '2025-03',
    consumoBase: 1850,
    consumoPrevisto: 2298,
    incrementoFouling: 448,
    emissoesCO2: 1421,
    custoAdicional: 314880
  },
  {
    navioId: 'NAVIO-002',
    periodo: '2025-02',
    consumoBase: 1620,
    consumoPrevisto: 1782,
    incrementoFouling: 162,
    emissoesCO2: 514,
    custoAdicional: 113940
  }
];

// Exportação combinada para facilitar importação
export const previsoesMock = {
  previsoesIBI,
  cenariosLimpeza,
  previsoesConsumo
};
