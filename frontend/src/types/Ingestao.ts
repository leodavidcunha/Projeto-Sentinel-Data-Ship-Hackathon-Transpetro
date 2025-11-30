/**
 * Tipos relacionados ao sistema de ingestão de dados
 */

/**
 * Registro de upload de dados
 */
export interface RegistroUpload {
  id: string;
  usuario: string;
  dataUpload: string;
  tipoArquivo: TipoArquivo;
  nomeArquivo: string;
  tamanhoArquivo: number; // bytes
  status: StatusProcessamento;
  categoria: CategoriaIngestao;
  navioRelacionado?: string;
  registrosProcessados: number;
  registrosValidos: number;
  registrosInvalidos: number;
  erros: ErroValidacao[];
  sugestoesIA: SugestaoIA[];
  aprovadoPor?: string;
  dataAprovacao?: string;
}

export type TipoArquivo = 
  | 'CSV' 
  | 'XLSX' 
  | 'PDF' 
  | 'DOCX' 
  | 'Imagem' 
  | 'JSON'
  | 'Video';

export type StatusProcessamento = 
  | 'Aguardando' 
  | 'Processando' 
  | 'Validação Pendente' 
  | 'Aprovado' 
  | 'Rejeitado' 
  | 'Erro';

export type CategoriaIngestao = 
  | 'Inspeção' 
  | 'Evento Operacional' 
  | 'Limpeza' 
  | 'Consumo' 
  | 'Documento Livre' 
  | 'Compliance' 
  | 'Ambiental'
  | 'Dados Obrigatórios'
  | 'Meteorológicos'
  | 'Subaquáticos'
  | 'Relatórios Noon'
  | 'GPS/AIS';

/**
 * Erro de validação de dados
 */
export interface ErroValidacao {
  linha?: number;
  campo: string;
  valor: any;
  mensagem: string;
  severidade: 'Aviso' | 'Erro' | 'Crítico';
}

/**
 * Sugestão gerada pela IA
 */
export interface SugestaoIA {
  campo: string;
  valorOriginal: any;
  valorSugerido: any;
  confianca: number; // 0-100%
  justificativa: string;
  aceita: boolean;
}

/**
 * Formulário de input manual
 */
export interface FormularioInput {
  categoria: CategoriaIngestao;
  navioId?: string;
  data: string;
  campos: CampoFormulario[];
  arquivosAnexos: ArquivoAnexo[];
  observacoes: string;
}

export interface CampoFormulario {
  nome: string;
  tipo: 'texto' | 'numero' | 'data' | 'selecao' | 'multiplo';
  valor: any;
  obrigatorio: boolean;
  validado: boolean;
}

export interface ArquivoAnexo {
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
  extraidoPorIA: boolean;
  dadosExtraidos?: any;
}

/**
 * Dados Obrigatórios do Navio
 */
export interface DadosObrigatorios {
  navioId: string;
  classeNavio: string;
  modeloTintaAntifouling: string;
  especificacoesTinta: string;
  dataDocagem: string;
  dataConstrucao: string;
  perfilOperacional: string;
}

/**
 * Dados Meteorológicos
 */
export interface DadosMeteorologicos {
  timestamp: string;
  latitude: number;
  longitude: number;
  velocidadeVento: number; // m/s
  direcaoVento: number; // graus
  intensidadeCorrente: number; // m/s
  direcaoCorrente: number; // graus
  alturaOnda: number; // metros
  periodoOnda: number; // segundos
  direcaoOnda: number; // graus
  swh: number; // Significant Wave Height
}

/**
 * Dados Subaquáticos
 */
export interface DadosSubaquaticos {
  navioId: string;
  dataInspecao: string;
  relatorio: string;
  fotos: string[];
  videos: string[];
  nivelIncrustacaoIA: number; // 0-100
  escalaIMO: 0 | 1 | 2 | 3 | 4; // MEPC.378
  observacoes: string;
}

/**
 * Dados de Limpeza
 */
export interface DadosLimpeza {
  navioId: string;
  dataLimpeza: string;
  metodo: 'in-water' | 'dock' | 'captura' | 'ROV' | 'jato-agua' | 'soft-brush';
  regiaoCasco: string;
  fotosAntes: string[];
  fotosDepois: string[];
  videosAntes: string[];
  videosDepois: string[];
  reducaoResistencia: number; // percentual
  custoTotal: number;
}

/**
 * Relatório Noon
 */
export interface RelatorioNoon {
  navioId: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  velocidade: number; // knots
  distanciaNavegada: number; // milhas náuticas
  consumoReal: number; // toneladas
  consumoEstimado: number; // toneladas
  evento: 'idle' | 'aguas-interiores' | 'cruzeiro' | 'manobrando';
  observacoes: string;
}
