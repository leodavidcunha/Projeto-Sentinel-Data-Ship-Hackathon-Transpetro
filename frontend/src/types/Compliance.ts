/**
 * Tipos relacionados ao compliance NORMAM-401
 */

/**
 * Status de compliance com a NORMAM-401
 */
export interface ComplianceNormam401 {
  navioId: string;
  status: StatusCompliance;
  ultimaInspecao: string;
  proximaInspecao: string;
  certificadoValido: boolean;
  validadeCertificado: string;
  naoConformidades: NaoConformidade[];
  acoesPendentes: AcaoPendente[];
  pontuacao: number; // 0-100
}

export type StatusCompliance = 
  | 'Conforme' 
  | 'Atenção' 
  | 'Não Conforme' 
  | 'Crítico';

export interface NaoConformidade {
  id: string;
  tipo: string;
  descricao: string;
  gravidade: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  dataIdentificacao: string;
  prazoCorrecao: string;
  status: 'Aberta' | 'Em Tratamento' | 'Resolvida';
}

export interface AcaoPendente {
  id: string;
  descricao: string;
  responsavel: string;
  prazo: string;
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  status: 'Pendente' | 'Em Andamento' | 'Concluída';
}

/**
 * Documento de compliance
 */
export interface DocumentoCompliance {
  id: string;
  navioId: string;
  tipo: TipoDocumento;
  numero: string;
  dataEmissao: string;
  dataValidade: string;
  orgaoEmissor: string;
  status: 'Válido' | 'Vencido' | 'A Vencer';
  arquivoUrl: string;
}

export type TipoDocumento = 
  | 'Certificado Biofouling'
  | 'Plano de Gestão'
  | 'Relatório de Inspeção'
  | 'Registro de Limpeza'
  | 'Declaração de Conformidade';
