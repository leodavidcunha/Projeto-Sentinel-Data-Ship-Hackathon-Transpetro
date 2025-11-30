/**
 * Tipos: Previsão de Fouling e IBI
 * Sistema de previsão baseado em ML
 */

export interface PrevisaoIBI {
  navioId: string;
  dataPrevisao: string;
  ibiPrevisto: number;
  confianca: number; // 0-100
  fatoresContribuintes: {
    idleTime: number;
    lowSpeed: number;
    temperatura: number;
    regiaoBio: number;
  };
}

export interface CenarioLimpeza {
  id: string;
  nome: string;
  tipo: 'manter' | 'limpar_imediato' | 'limpar_porto' | 'alterar_rota';
  dataExecucao?: string;
  portoLimpeza?: string;
  custoEstimado: number;
  economiaAnual: number;
  reducaoIBI: number;
  reducaoConsumo: number;
  reducaoEmissoes: number;
  payback: number; // meses
  recomendado: boolean;
}

export interface PrevisaoConsumo {
  navioId: string;
  periodo: string;
  consumoBase: number;
  consumoPrevisto: number;
  incrementoFouling: number;
  emissoesCO2: number;
  custoAdicional: number;
}

export interface SimulacaoRota {
  id: string;
  navioId: string;
  rotaAtual: string;
  rotaAlternativa: string;
  diferencaDias: number;
  diferencaCusto: number;
  riscoFouling: 'menor' | 'igual' | 'maior';
  recomendada: boolean;
}
