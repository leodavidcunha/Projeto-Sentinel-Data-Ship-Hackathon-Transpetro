import { Alerta } from '../types/Alerta';

/**
 * Alertas ativos do sistema
 */
export const alertasMock: Alerta[] = [
  {
    id: 'alert-001',
    tipo: 'IBI Alto',
    severidade: 'Crítico',
    titulo: 'IBI Crítico - Transpetro Bahia',
    descricao: 'Navio apresenta IBI de 92, indicando bioincrustação severa. Consumo 56% acima do ideal.',
    navioId: 'nav-003',
    dataGeracao: '2025-01-15T08:00:00Z',
    status: 'Novo',
    acaoRecomendada: 'Agendar limpeza urgente do casco. Risco de não conformidade NORMAM-401.',
    lido: false,
    arquivado: false
  },
  {
    id: 'alert-002',
    tipo: 'IBI Alto',
    severidade: 'Crítico',
    titulo: 'IBI Crítico - Transpetro Santarém',
    descricao: 'Navio com IBI de 94, maior índice da frota. 322 dias desde última limpeza.',
    navioId: 'nav-020',
    dataGeracao: '2025-01-15T09:15:00Z',
    status: 'Novo',
    acaoRecomendada: 'Limpeza emergencial necessária. Emissões excedentes de 230 toneladas CO2.',
    lido: false,
    arquivado: false
  },
  {
    id: 'alert-003',
    tipo: 'Compliance',
    severidade: 'Alerta',
    titulo: 'Inspeção NORMAM-401 Vencendo',
    descricao: 'Certificado de conformidade vence em 15 dias.',
    navioId: 'nav-011',
    dataGeracao: '2025-01-14T10:30:00Z',
    dataExpiracao: '2025-01-30T23:59:59Z',
    status: 'Visualizado',
    acaoRecomendada: 'Agendar inspeção de renovação com antecedência.',
    responsavel: 'João Silva',
    lido: true,
    arquivado: false
  },
  {
    id: 'alert-004',
    tipo: 'Consumo Excessivo',
    severidade: 'Alerta',
    titulo: 'Consumo Elevado - Transpetro Angra',
    descricao: 'Delta de consumo de 30.2 L/nm. Emissões excedentes de 539 toneladas CO2.',
    navioId: 'nav-011',
    dataGeracao: '2025-01-15T11:00:00Z',
    status: 'Em Tratamento',
    acaoRecomendada: 'Avaliar necessidade de limpeza. IBI atual: 88.',
    responsavel: 'Maria Santos',
    lido: true,
    arquivado: false
  },
  {
    id: 'alert-005',
    tipo: 'Limpeza Necessária',
    severidade: 'Alerta',
    titulo: 'Limpeza Programada Atrasada',
    descricao: 'Limpeza prevista para 10/01/2025 não foi realizada.',
    navioId: 'nav-019',
    dataGeracao: '2025-01-11T08:00:00Z',
    status: 'Em Tratamento',
    acaoRecomendada: 'Reagendar limpeza com urgência. IBI: 82.',
    responsavel: 'Carlos Oliveira',
    lido: true,
    arquivado: false
  },
  {
    id: 'alert-006',
    tipo: 'Previsão Crítica',
    severidade: 'Aviso',
    titulo: 'Previsão de Alto Risco - Transpetro Santos',
    descricao: 'Modelo prevê IBI &gt; 85 em 30 dias. Navio entrará em região de alto risco.',
    navioId: 'nav-001',
    dataGeracao: '2025-01-15T07:00:00Z',
    status: 'Novo',
    acaoRecomendada: 'Planejar limpeza preventiva antes da entrada na região tropical.',
    lido: false,
    arquivado: false
  },
  {
    id: 'alert-007',
    tipo: 'Risco Ambiental',
    severidade: 'Informação',
    titulo: 'Entrada em Área Sensível',
    descricao: 'Navio entrará em área de proteção ambiental nas próximas 48h.',
    navioId: 'nav-005',
    dataGeracao: '2025-01-15T12:00:00Z',
    dataExpiracao: '2025-01-17T12:00:00Z',
    status: 'Novo',
    acaoRecomendada: 'Verificar compliance com restrições locais NORMAM-401.',
    lido: false,
    arquivado: false
  },
  {
    id: 'alert-008',
    tipo: 'Documento Vencendo',
    severidade: 'Aviso',
    titulo: 'Certificado Vencendo - Transpetro Belém',
    descricao: 'Certificado de Gestão de Biofouling vence em 10 dias.',
    navioId: 'nav-007',
    dataGeracao: '2025-01-15T08:30:00Z',
    dataExpiracao: '2025-01-25T23:59:59Z',
    status: 'Novo',
    acaoRecomendada: 'Providenciar renovação do certificado.',
    lido: false,
    arquivado: false
  },
  {
    id: 'alert-009',
    tipo: 'Anomalia Operacional',
    severidade: 'Aviso',
    titulo: 'Aumento Súbito de Consumo',
    descricao: 'Consumo aumentou 18% nas últimas 72h sem mudança de rota.',
    navioId: 'nav-013',
    dataGeracao: '2025-01-15T13:00:00Z',
    status: 'Novo',
    acaoRecomendada: 'Investigar possível aceleração de fouling ou problema mecânico.',
    lido: false,
    arquivado: false
  },
  {
    id: 'alert-010',
    tipo: 'IBI Alto',
    severidade: 'Alerta',
    titulo: 'IBI Alto - Transpetro Manaus',
    descricao: 'IBI de 85 em ambiente fluvial. Alto risco de espécies invasoras.',
    navioId: 'nav-008',
    dataGeracao: '2025-01-15T10:00:00Z',
    status: 'Visualizado',
    acaoRecomendada: 'Limpeza urgente antes de retorno ao oceano.',
    responsavel: 'Ana Costa',
    lido: true,
    arquivado: false
  }
];
