/**
 * Tipos relacionados a métricas ESG e descarbonização
 */

/**
 * Métricas de sustentabilidade e descarbonização
 */
export interface MetricasESG {
  navioId: string;
  periodo: string;
  emissoesCO2Total: number; // toneladas
  emissoesCO2Fouling: number; // toneladas devido ao fouling
  emissoesCO2Evitadas: number; // toneladas evitadas por gestão
  consumoCombustivelTotal: number; // toneladas
  consumoExcessoFouling: number; // toneladas
  economiaFinanceira: number; // R$
  eficienciaEnergetica: number; // EEOI
  intensidadeCarbono: number; // gCO2/t.nm
  metaDescarbonizacao: number; // % redução
  progressoMeta: number; // % alcançado
}

/**
 * Indicadores de performance ambiental
 */
export interface IndicadorAmbiental {
  nome: string;
  valor: number;
  unidade: string;
  meta: number;
  variacao: number; // % em relação ao período anterior
  status: 'Acima da Meta' | 'Na Meta' | 'Abaixo da Meta';
  tendencia: 'Melhorando' | 'Estável' | 'Piorando';
}

/**
 * Projeto de descarbonização
 */
export interface ProjetoDescarbonizacao {
  id: string;
  nome: string;
  descricao: string;
  naviosEnvolvidos: string[];
  dataInicio: string;
  dataFim: string;
  investimento: number;
  reducaoEsperadaCO2: number; // toneladas/ano
  economiaEsperada: number; // R$/ano
  status: 'Planejado' | 'Em Execução' | 'Concluído' | 'Cancelado';
  progresso: number; // 0-100%
}
