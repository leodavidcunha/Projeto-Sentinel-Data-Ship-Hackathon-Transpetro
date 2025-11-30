/**
 * Tipos relacionados a alertas e automação
 */

/**
 * Alerta do sistema
 */
export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  severidade: SeveridadeAlerta;
  titulo: string;
  descricao: string;
  navioId?: string;
  dataGeracao: string;
  dataExpiracao?: string;
  status: StatusAlerta;
  acaoRecomendada: string;
  responsavel?: string;
  lido: boolean;
  arquivado: boolean;
}

export type TipoAlerta = 
  | 'IBI Alto'
  | 'Consumo Excessivo'
  | 'Compliance'
  | 'Limpeza Necessária'
  | 'Risco Ambiental'
  | 'Documento Vencendo'
  | 'Anomalia Operacional'
  | 'Previsão Crítica';

export type SeveridadeAlerta = 
  | 'Informação' 
  | 'Aviso' 
  | 'Alerta' 
  | 'Crítico' 
  | 'Emergência';

export type StatusAlerta = 
  | 'Novo' 
  | 'Visualizado' 
  | 'Em Tratamento' 
  | 'Resolvido' 
  | 'Ignorado';

/**
 * Regra de automação
 */
export interface RegraAutomacao {
  id: string;
  nome: string;
  descricao: string;
  ativa: boolean;
  condicoes: CondicaoRegra[];
  acoes: AcaoAutomacao[];
  frequenciaVerificacao: number; // minutos
  ultimaExecucao?: string;
  proximaExecucao: string;
}

export interface CondicaoRegra {
  parametro: string;
  operador: '>' | '<' | '=' | '>=' | '<=' | '!=';
  valor: any;
  logico?: 'E' | 'OU';
}

export interface AcaoAutomacao {
  tipo: 'Notificar' | 'Email' | 'SMS' | 'Criar Tarefa' | 'Atualizar Status';
  destinatarios?: string[];
  mensagem?: string;
  parametros?: Record<string, any>;
}
