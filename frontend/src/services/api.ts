/**
 * Servico de API - SentinelDataShip
 * Conecta com o backend FastAPI para dados REAIS da frota
 */

const API_URL = 'http://localhost:8001';

export interface NavioAPI {
  id: string;
  nome: string;
  classe: string;
  ibe: number;  // IBE = Indice de Bioincrustacao Estimado
  ibeMedio: number;
  consumoReal: number;
  consumoIdeal: number;
  deltaFuelNm: number;
  emissoesCO2Perdidas: number;
  riscoNormam401: string;
  statusOperacional: string;
  diasDesdeUltimaLimpeza: number;
  posicaoAtual: {
    latitude: number;
    longitude: number;
    velocidade: number;
    rumo: number;
    dataHora: string;
  };
  recomendacao: string;
  economiaAnual: number;
  eventosCriticos: number;
  eventosAlto: number;
  viagensAnalisadas: number;
  previsao30d: number;
  previsao60d: number;
  previsao90d: number;
}

export interface MetricasAPI {
  frotaAtiva: number;
  ibeMedio: number;  // IBE = Indice de Bioincrustacao Estimado
  ibeMax: number;
  ibeMin: number;
  excessoConsumoMensal: number;
  emissoesFouling: number;
  naviosRiscoNormam: number;
  naviosCriticos: number;
  naviosAlto: number;
  economiaPotencialAnual: number;
  mediaDiasDocagem: number;
  totalEventosCriticos: number;
  totalEventosAlto: number;
  ultimaAtualizacao?: string;
}

export interface AlertaAPI {
  id: string;
  tipo: string;
  severidade: string;
  titulo: string;
  descricao: string;
  navioId: string;
  dataGeracao: string;
  status: string;
  acaoRecomendada: string;
  prazo: string;
  prioridade: number;
  cor: string;
  lido: boolean;
  arquivado: boolean;
}

/**
 * Busca lista de navios da API
 */
export async function fetchNavios(): Promise<NavioAPI[]> {
  try {
    const response = await fetch(`${API_URL}/api/navios`);
    if (!response.ok) throw new Error('Erro ao buscar navios');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar navios:', error);
    return [];
  }
}

/**
 * Busca metricas agregadas da API
 */
export async function fetchMetricas(): Promise<MetricasAPI | null> {
  try {
    const response = await fetch(`${API_URL}/api/metricas`);
    if (!response.ok) throw new Error('Erro ao buscar metricas');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar metricas:', error);
    return null;
  }
}

/**
 * Busca alertas da API
 */
export async function fetchAlertas(): Promise<AlertaAPI[]> {
  try {
    const response = await fetch(`${API_URL}/api/alertas`);
    if (!response.ok) throw new Error('Erro ao buscar alertas');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar alertas:', error);
    return [];
  }
}

/**
 * Busca detalhes de um navio especifico
 */
export async function fetchNavio(id: string): Promise<NavioAPI | null> {
  try {
    const response = await fetch(`${API_URL}/api/navio/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar navio');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar navio:', error);
    return null;
  }
}

/**
 * Verifica saude da API
 */
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Interface para analise climatica de um navio
 */
export interface AnaliseClimaAPI {
  navio: string;
  navioId: string;
  baseline: number;
  consumoAtual: number;
  excessoTotal: number;
  impactoConsumo: number;
  separacaoFatores: {
    bioincrustacao: number;
    clima: number;
    trim: number;
    carregamento: number;
  };
  probabilidadeCausa: {
    bioincrustacao: number;
    clima: number;
    outros: number;
  };
  estatisticasClima: {
    beaufortMedio: number;
    beaufortMax: number;
    beaufortMin: number;
    beaufortDesc: string;
    seaConditionMedio: number;
    seaConditionMax?: number;
    seaConditionMin?: number;
    seaConditionDesc: string;
    seaConditionEstimado?: boolean;
    distribuicaoBeaufort: Record<string, number>;
    distribuicaoSeaCondition?: Record<string, number>;
  };
  ultimasViagens: Array<{
    data: string;
    beaufort: number;
    seaCondition: number;
    fuelPerNm: number;
    speed: number;
  }>;
  totalViagens: number;
  recomendacao: string;
}

/**
 * Busca analise climatica de um navio especifico
 */
export async function fetchAnaliseClima(navioId: string): Promise<AnaliseClimaAPI | null> {
  try {
    const response = await fetch(`${API_URL}/api/navio/${navioId}/analise-clima`);
    if (!response.ok) throw new Error('Erro ao buscar analise climatica');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar analise climatica:', error);
    return null;
  }
}

/**
 * Busca analise climatica de todos os navios
 */
export async function fetchAnaliseClimaNavios(): Promise<AnaliseClimaAPI[]> {
  try {
    const response = await fetch(`${API_URL}/api/clima/navios`);
    if (!response.ok) throw new Error('Erro ao buscar analises climaticas');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar analises climaticas:', error);
    return [];
  }
}
