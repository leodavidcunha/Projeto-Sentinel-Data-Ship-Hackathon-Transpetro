import { Limpeza, JanelaLimpeza, InspecaoCasco } from '../types/Manutencao';

export const limpezas: Limpeza[] = [
  {
    id: 'LIMP-001',
    navioId: 'NAVIO-001',
    dataLimpeza: '2024-08-15',
    tipo: 'subaquatica',
    porto: 'Santos, BR',
    duracao: 48,
    custo: 425000,
    ibiAntes: 78,
    ibiDepois: 12,
    reducaoConsumo: 22.5,
    fornecedor: 'HullWiper Brasil',
    status: 'concluida',
    observacoes: 'Limpeza completa com ROV. Bioincrustação severa removida com sucesso.',
    anexos: ['relatorio_limp_001.pdf', 'fotos_antes_depois.zip']
  },
  {
    id: 'LIMP-002',
    navioId: 'NAVIO-003',
    dataLimpeza: '2024-11-22',
    tipo: 'dique_seco',
    porto: 'Rio de Janeiro, BR',
    duracao: 168,
    custo: 1850000,
    ibiAntes: 82,
    ibiDepois: 0,
    reducaoConsumo: 28.3,
    fornecedor: 'Estaleiro Mauá',
    status: 'concluida',
    observacoes: 'Docagem programada. Aplicação de nova tinta antiincrustante.',
    anexos: ['certificado_dique.pdf', 'laudo_pintura.pdf']
  },
  {
    id: 'LIMP-003',
    navioId: 'NAVIO-005',
    dataLimpeza: '2025-02-10',
    tipo: 'robotica',
    porto: 'Singapura, SG',
    duracao: 36,
    custo: 380000,
    ibiAntes: 65,
    ibiDepois: 8,
    reducaoConsumo: 19.7,
    fornecedor: 'Jotun HullSkater',
    status: 'planejada',
    observacoes: 'Limpeza agendada durante escala técnica.',
    anexos: []
  }
];

export const janelasLimpeza: JanelaLimpeza[] = [
  {
    navioId: 'NAVIO-001',
    dataInicio: '2025-02-01',
    dataFim: '2025-02-15',
    prioridade: 'critica',
    ibiAtual: 65,
    ibiProjetado: 78,
    custoDiario: 15800,
    economiaEstimada: 2847000,
    portosDisponiveis: [
      {
        nome: 'Santos',
        pais: 'Brasil',
        coordenadas: [-23.9608, -46.3336],
        custoMedio: 450000,
        tempoMedio: 2,
        disponibilidade: 'imediata',
        fornecedores: ['HullWiper Brasil', 'SubSea Cleaning'],
        capacidadeDique: true
      },
      {
        nome: 'Rio de Janeiro',
        pais: 'Brasil',
        coordenadas: [-22.9068, -43.1729],
        custoMedio: 485000,
        tempoMedio: 2.5,
        disponibilidade: 'agendamento',
        fornecedores: ['Estaleiro Mauá', 'Wilson Sons'],
        capacidadeDique: true
      }
    ],
    recomendacao: 'Limpeza urgente recomendada. IBI crítico com projeção de aumento. Economia anual estimada em R$ 2,8M.'
  },
  {
    navioId: 'NAVIO-004',
    dataInicio: '2025-03-15',
    dataFim: '2025-04-01',
    prioridade: 'media',
    ibiAtual: 42,
    ibiProjetado: 51,
    custoDiario: 8900,
    economiaEstimada: 1245000,
    portosDisponiveis: [
      {
        nome: 'Singapura',
        pais: 'Singapura',
        coordenadas: [1.2897, 103.8501],
        custoMedio: 380000,
        tempoMedio: 1.5,
        disponibilidade: 'imediata',
        fornecedores: ['Jotun HullSkater', 'Envirocean'],
        capacidadeDique: true
      }
    ],
    recomendacao: 'Limpeza preventiva recomendada durante próxima escala em Singapura.'
  }
];

export const inspecoes: InspecaoCasco[] = [
  {
    id: 'INSP-001',
    navioId: 'NAVIO-001',
    dataInspecao: '2025-01-15',
    tipo: 'rov',
    ibiCalculado: 65,
    areas: [
      {
        nome: 'Proa',
        severidade: 3,
        cobertura: 45,
        tipoOrganismo: ['Cracas', 'Algas verdes', 'Biofilme'],
        fotos: ['proa_01.jpg', 'proa_02.jpg']
      },
      {
        nome: 'Casco Médio BB',
        severidade: 4,
        cobertura: 68,
        tipoOrganismo: ['Cracas', 'Mexilhões', 'Algas pardas'],
        fotos: ['meio_bb_01.jpg']
      },
      {
        nome: 'Popa',
        severidade: 2,
        cobertura: 28,
        tipoOrganismo: ['Biofilme', 'Algas verdes'],
        fotos: ['popa_01.jpg']
      }
    ],
    recomendacoes: [
      'Limpeza urgente recomendada nas próximas 2 semanas',
      'Foco em casco médio bombordo com severidade 4',
      'Considerar aplicação de coating após limpeza'
    ],
    proximaInspecao: '2025-04-15',
    inspetor: 'João Silva - CREA 12345/SP',
    certificado: 'CERT-INSP-2025-001'
  }
];

export const manutencoesMock = [
  {
    id: 'MAN-001',
    navioId: 'NAVIO-001',
    tipo: 'limpeza' as const,
    descricao: 'Limpeza Subaquática Completa',
    dataAgendada: '2025-02-15',
    status: 'agendada' as const,
    localManutencao: 'Porto de Santos, SP',
    custoEstimado: 425000,
    observacoes: 'Limpeza urgente devido ao IBI crítico de 65. Remoção de cracas e biofilme.'
  },
  {
    id: 'MAN-002',
    navioId: 'NAVIO-003',
    tipo: 'inspecao' as const,
    descricao: 'Inspeção ROV Programada',
    dataAgendada: '2025-02-20',
    status: 'agendada' as const,
    localManutencao: 'Rio de Janeiro, RJ',
    custoEstimado: 85000,
    observacoes: 'Inspeção trimestral de rotina com ROV.'
  },
  {
    id: 'MAN-003',
    navioId: 'NAVIO-002',
    tipo: 'limpeza' as const,
    descricao: 'Limpeza em Dique Seco',
    dataAgendada: '2025-01-28',
    status: 'em_andamento' as const,
    localManutencao: 'Estaleiro Mauá, RJ',
    custoEstimado: 1850000,
    progresso: 65,
    observacoes: 'Docagem programada com aplicação de nova tinta antiincrustante.'
  },
  {
    id: 'MAN-004',
    navioId: 'NAVIO-005',
    tipo: 'reparo' as const,
    descricao: 'Reparo de Hélice',
    dataAgendada: '2025-02-01',
    status: 'em_andamento' as const,
    localManutencao: 'Singapura, SG',
    custoEstimado: 320000,
    progresso: 40,
    observacoes: 'Reparo de danos causados por bioincrustação severa.'
  },
  {
    id: 'MAN-005',
    navioId: 'NAVIO-004',
    tipo: 'preventiva' as const,
    descricao: 'Manutenção Preventiva Trimestral',
    dataAgendada: '2025-01-20',
    status: 'atrasada' as const,
    localManutencao: 'Roterdã, NL',
    custoEstimado: 145000,
    observacoes: 'Manutenção atrasada devido a condições climáticas adversas.'
  },
  {
    id: 'MAN-006',
    navioId: 'NAVIO-001',
    tipo: 'limpeza' as const,
    descricao: 'Limpeza Robótica de Casco',
    dataAgendada: '2024-12-10',
    status: 'concluida' as const,
    localManutencao: 'Santos, BR',
    custoEstimado: 380000,
    observacoes: 'Limpeza concluída com sucesso. IBI reduzido de 78 para 12.'
  },
  {
    id: 'MAN-007',
    navioId: 'NAVIO-003',
    tipo: 'inspecao' as const,
    descricao: 'Inspeção de Casco Pós-Limpeza',
    dataAgendada: '2024-12-15',
    status: 'concluida' as const,
    localManutencao: 'Santos, BR',
    custoEstimado: 45000,
    observacoes: 'Inspeção confirmou eficácia da limpeza. Sem danos estruturais.'
  },
  {
    id: 'MAN-008',
    navioId: 'NAVIO-004',
    tipo: 'preventiva' as const,
    descricao: 'Aplicação de Coating Antiincrustante',
    dataAgendada: '2025-03-15',
    status: 'agendada' as const,
    localManutencao: 'Singapura, SG',
    custoEstimado: 580000,
    observacoes: 'Aplicação preventiva durante escala programada.'
  }
];
