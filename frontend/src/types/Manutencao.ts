/**
 * Tipos: Manutenção e Limpeza do Casco
 * Gestão de manutenções preventivas e corretivas
 */

export interface Limpeza {
  id: string;
  navioId: string;
  dataLimpeza: string;
  tipo: 'subaquatica' | 'dique_seco' | 'robotica' | 'manual';
  porto: string;
  duracao: number; // horas
  custo: number;
  ibiAntes: number;
  ibiDepois: number;
  reducaoConsumo: number; // %
  fornecedor: string;
  status: 'planejada' | 'em_andamento' | 'concluida' | 'cancelada';
  observacoes: string;
  anexos: string[];
}

export interface JanelaLimpeza {
  navioId: string;
  dataInicio: string;
  dataFim: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  ibiAtual: number;
  ibiProjetado: number;
  custoDiario: number;
  economiaEstimada: number;
  portosDisponiveis: PortoLimpeza[];
  recomendacao: string;
}

export interface PortoLimpeza {
  nome: string;
  pais: string;
  coordenadas: [number, number];
  custoMedio: number;
  tempoMedio: number; // dias
  disponibilidade: 'imediata' | 'agendamento' | 'indisponivel';
  fornecedores: string[];
  capacidadeDique: boolean;
}

export interface InspecaoCasco {
  id: string;
  navioId: string;
  dataInspecao: string;
  tipo: 'visual' | 'rov' | 'mergulhador' | 'drone';
  ibiCalculado: number;
  areas: AreaInspecao[];
  recomendacoes: string[];
  proximaInspecao: string;
  inspetor: string;
  certificado: string;
}

export interface AreaInspecao {
  nome: string;
  severidade: 0 | 1 | 2 | 3 | 4 | 5;
  cobertura: number; // %
  tipoOrganismo: string[];
  fotos: string[];
}
