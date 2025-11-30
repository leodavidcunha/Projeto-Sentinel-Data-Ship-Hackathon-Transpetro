import { RegistroUpload } from '../types/Ingestao';

/**
 * Histórico de uploads e ingestão de dados
 */
export const registrosUploadMock: RegistroUpload[] = [
  {
    id: 'upload-001',
    usuario: 'João Silva',
    dataUpload: '2025-01-15T09:30:00Z',
    tipoArquivo: 'XLSX',
    nomeArquivo: 'consumo_frota_dezembro_2024.xlsx',
    tamanhoArquivo: 2458624,
    status: 'Aprovado',
    categoria: 'Consumo',
    registrosProcessados: 630,
    registrosValidos: 628,
    registrosInvalidos: 2,
    erros: [
      {
        linha: 145,
        campo: 'consumo',
        valor: -12.5,
        mensagem: 'Valor de consumo não pode ser negativo',
        severidade: 'Erro'
      },
      {
        linha: 389,
        campo: 'data',
        valor: '2024-13-45',
        mensagem: 'Data inválida',
        severidade: 'Erro'
      }
    ],
    sugestoesIA: [
      {
        campo: 'navioId',
        valorOriginal: 'TP Santos',
        valorSugerido: 'nav-001',
        confianca: 98,
        justificativa: 'Correspondência encontrada no cadastro de navios',
        aceita: true
      },
      {
        campo: 'unidade',
        valorOriginal: 'litros',
        valorSugerido: 'L',
        confianca: 100,
        justificativa: 'Padronização de unidades',
        aceita: true
      }
    ],
    aprovadoPor: 'Maria Santos',
    dataAprovacao: '2025-01-15T10:15:00Z'
  },
  {
    id: 'upload-002',
    usuario: 'Carlos Oliveira',
    dataUpload: '2025-01-15T11:00:00Z',
    tipoArquivo: 'PDF',
    nomeArquivo: 'relatorio_inspecao_transpetro_bahia.pdf',
    tamanhoArquivo: 8945632,
    status: 'Validação Pendente',
    categoria: 'Inspeção',
    navioRelacionado: 'nav-003',
    registrosProcessados: 1,
    registrosValidos: 0,
    registrosInvalidos: 0,
    erros: [],
    sugestoesIA: [
      {
        campo: 'ibi',
        valorOriginal: 'alto',
        valorSugerido: 92,
        confianca: 85,
        justificativa: 'Extraído do texto: "índice de bioincrustação estimado em 92"',
        aceita: false
      },
      {
        campo: 'dataInspecao',
        valorOriginal: null,
        valorSugerido: '2025-01-10',
        confianca: 95,
        justificativa: 'Data encontrada no cabeçalho do documento',
        aceita: false
      },
      {
        campo: 'recomendacao',
        valorOriginal: null,
        valorSugerido: 'Limpeza urgente recomendada',
        confianca: 90,
        justificativa: 'Extraído das conclusões do relatório',
        aceita: false
      }
    ]
  },
  {
    id: 'upload-003',
    usuario: 'Ana Costa',
    dataUpload: '2025-01-15T08:15:00Z',
    tipoArquivo: 'CSV',
    nomeArquivo: 'eventos_limpeza_q4_2024.csv',
    tamanhoArquivo: 156789,
    status: 'Aprovado',
    categoria: 'Limpeza',
    registrosProcessados: 47,
    registrosValidos: 47,
    registrosInvalidos: 0,
    erros: [],
    sugestoesIA: [
      {
        campo: 'custo',
        valorOriginal: 'R$ 185.000,00',
        valorSugerido: 185000,
        confianca: 100,
        justificativa: 'Conversão de formato monetário para numérico',
        aceita: true
      }
    ],
    aprovadoPor: 'João Silva',
    dataAprovacao: '2025-01-15T08:45:00Z'
  },
  {
    id: 'upload-004',
    usuario: 'Pedro Alves',
    dataUpload: '2025-01-15T13:20:00Z',
    tipoArquivo: 'Imagem',
    nomeArquivo: 'foto_casco_transpetro_rio.jpg',
    tamanhoArquivo: 4567890,
    status: 'Processando',
    categoria: 'Inspeção',
    navioRelacionado: 'nav-002',
    registrosProcessados: 0,
    registrosValidos: 0,
    registrosInvalidos: 0,
    erros: [],
    sugestoesIA: []
  },
  {
    id: 'upload-005',
    usuario: 'Fernanda Lima',
    dataUpload: '2025-01-14T16:45:00Z',
    tipoArquivo: 'DOCX',
    nomeArquivo: 'plano_gestao_biofouling_2025.docx',
    tamanhoArquivo: 1234567,
    status: 'Rejeitado',
    categoria: 'Documento Livre',
    registrosProcessados: 0,
    registrosValidos: 0,
    registrosInvalidos: 1,
    erros: [
      {
        campo: 'formato',
        valor: 'docx',
        mensagem: 'Documento não contém dados estruturados para importação',
        severidade: 'Crítico'
      }
    ],
    sugestoesIA: []
  },
  {
    id: 'upload-006',
    usuario: 'Roberto Mendes',
    dataUpload: '2025-01-15T07:00:00Z',
    tipoArquivo: 'XLSX',
    nomeArquivo: 'dados_ais_janeiro_2025.xlsx',
    tamanhoArquivo: 15678901,
    status: 'Aprovado',
    categoria: 'Evento Operacional',
    registrosProcessados: 15120,
    registrosValidos: 15098,
    registrosInvalidos: 22,
    erros: [
      {
        campo: 'latitude',
        valor: 'N/A',
        mensagem: 'Coordenada inválida',
        severidade: 'Erro'
      }
    ],
    sugestoesIA: [
      {
        campo: 'velocidade',
        valorOriginal: '12.5 knots',
        valorSugerido: 12.5,
        confianca: 100,
        justificativa: 'Conversão de unidade para formato numérico',
        aceita: true
      }
    ],
    aprovadoPor: 'Maria Santos',
    dataAprovacao: '2025-01-15T07:30:00Z'
  }
];
