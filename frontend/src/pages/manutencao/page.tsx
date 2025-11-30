import { useState } from 'react';
import { manutencoesMock } from '../../mocks/manutencao';
import { naviosMock } from '../../mocks/navios';
import { Cartao } from '../../components/atoms/Cartao';
import { Badge } from '../../components/atoms/Badge';

type StatusManutencao = 'RECOMMENDED' | 'PENDING_APPROVAL' | 'APPROVED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED' | 'DEFERRED' | 'CANCELLED';
type NivelRisco = 'INFO' | 'WARNING' | 'CRITICAL' | 'IMMEDIATE';
type PapelUsuario = 'operator' | 'maintenance_engineer' | 'fleet_planner' | 'maintenance_manager' | 'compliance_officer' | 'auditor';

const PaginaManutencao = () => {
  const [filtroStatus, setFiltroStatus] = useState<'todos' | StatusManutencao>('todos');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'limpeza' | 'inspecao' | 'reparo' | 'preventiva'>('todos');
  const [modalNova, setModalNova] = useState(false);
  const [modalScheduler, setModalScheduler] = useState(false);
  const [modalAprovacao, setModalAprovacao] = useState(false);
  const [modalAuditoria, setModalAuditoria] = useState(false);
  const [modalNotificacoes, setModalNotificacoes] = useState(false);
  const [modalGovernanca, setModalGovernanca] = useState(false);
  const [recomendacaoSelecionada, setRecomendacaoSelecionada] = useState<any>(null);
  const [navioSelecionado, setNavioSelecionado] = useState('');
  const [tipoManutencao, setTipoManutencao] = useState('limpeza');
  const [prioridade, setPrioridade] = useState('Alta');
  const [notificarEquipe, setNotificarEquipe] = useState(true);
  const [notificacoes, setNotificacoes] = useState({
    comandante: true,
    gerente: true,
    equipe: false
  });
  const [navioScheduler, setNavioScheduler] = useState('NAVIO-001');
  const [papelUsuario] = useState<PapelUsuario>('maintenance_manager');
  const [decisaoAprovacao, setDecisaoAprovacao] = useState<'APPROVED' | 'REJECTED' | 'DEFERRED'>('APPROVED');
  const [justificativa, setJustificativa] = useState('');
  const [diasAdiamento, setDiasAdiamento] = useState(7);

  // Dados expandidos com workflow completo
  const recomendacoesManutencao = [
    {
      id: 'REC-001',
      navioId: 'NAVIO-001',
      navio: 'BRUNO LIMA',
      tipo: 'limpeza',
      descricao: 'Limpeza Subaquática com ROV - Casco Completo',
      status: 'RECOMMENDED' as StatusManutencao,
      nivelRisco: 'CRITICAL' as NivelRisco,
      dataRecomendacao: '2025-01-28T10:30:00',
      dataIdealExecucao: '2025-02-18',
      diasRestantes: 12,
      origem: {
        ibiAtual: 65,
        ibiProjetado: 78,
        deltaFuelNm: 22.5,
        custoEvitado: 2847000
      },
      localRecomendado: 'Santos, SP',
      fornecedorSugerido: 'HullWiper Brasil',
      custoEstimado: 425000,
      duracaoEstimada: 2,
      justificativaIA: 'IBI crítico com tendência de crescimento acelerado. Limpeza proativa evitará custos operacionais elevados.',
      slaHoras: 24,
      horasRestantesSLA: 18,
      geradoPor: 'Sistema IA Planner',
      notificacoesEnviadas: [
        { tipo: 'Email', destinatario: 'João Silva (Gestor)', data: '2025-01-28T10:31:00', status: 'Enviado' },
        { tipo: 'MS Teams', destinatario: 'Canal Manutenção', data: '2025-01-28T10:31:00', status: 'Enviado' },
        { tipo: 'MS Teams', destinatario: 'Maria Santos (Gerente Frota)', data: '2025-01-28T10:31:00', status: 'Enviado' }
      ],
      proximoEscalonamento: '2025-01-29T22:30:00',
      historicoAcoes: [
        { data: '2025-01-28T10:30:00', usuario: 'Sistema', acao: 'Recomendação gerada', detalhes: 'Análise preditiva IBI' },
        { data: '2025-01-28T10:31:00', usuario: 'Sistema', acao: 'Notificações enviadas', detalhes: 'Email + Teams para Gestor e Gerente de Frota' }
      ]
    },
    {
      id: 'REC-002',
      navioId: 'NAVIO-002',
      navio: 'CARLA SILVA',
      tipo: 'limpeza',
      descricao: 'Limpeza Preventiva - Método Robótico',
      status: 'APPROVED' as StatusManutencao,
      nivelRisco: 'WARNING' as NivelRisco,
      dataRecomendacao: '2025-01-25T14:20:00',
      dataIdealExecucao: '2025-03-05',
      diasRestantes: 27,
      origem: {
        ibiAtual: 42,
        ibiProjetado: 51,
        deltaFuelNm: 18.3,
        custoEvitado: 1245000
      },
      localRecomendado: 'Rio de Janeiro, RJ',
      fornecedorSugerido: 'Jotun HullSkater',
      custoEstimado: 380000,
      duracaoEstimada: 1.5,
      justificativaIA: 'Limpeza preventiva recomendada antes que o IBI atinja níveis críticos.',
      slaHoras: 72,
      horasRestantesSLA: 0,
      geradoPor: 'Sistema IA Planner',
      aprovadoPor: 'João Silva (Gestor)',
      dataAprovacao: '2025-01-26T09:15:00',
      justificativaAprovacao: 'Aprovado conforme análise de custo-benefício. Janela operacional adequada.',
      notificacoesEnviadas: [
        { tipo: 'Email', destinatario: 'João Silva (Gestor)', data: '2025-01-25T14:21:00', status: 'Enviado' },
        { tipo: 'MS Teams', destinatario: 'Canal Manutenção', data: '2025-01-25T14:21:00', status: 'Enviado' },
        { tipo: 'Email', destinatario: 'João Silva (Gestor)', data: '2025-01-26T09:16:00', status: 'Enviado', assunto: '[Aprovação] Limpeza recomendada — CARLA SILVA — 2025-03-05' }
      ],
      historicoAcoes: [
        { data: '2025-01-25T14:20:00', usuario: 'Sistema', acao: 'Recomendação gerada', detalhes: 'Análise preditiva IBI' },
        { data: '2025-01-25T14:21:00', usuario: 'Sistema', acao: 'Notificações enviadas', detalhes: 'Email + Teams para Gestor' },
        { data: '2025-01-26T09:15:00', usuario: 'João Silva', acao: 'Aprovado', detalhes: 'Aprovado conforme análise de custo-benefício' },
        { data: '2025-01-26T09:16:00', usuario: 'Sistema', acao: 'Email de aprovação enviado', detalhes: 'Ordem CMMS-2025-000123 criada' }
      ]
    },
    {
      id: 'REC-003',
      navioId: 'NAVIO-003',
      navio: 'DANIEL PEREIRA',
      tipo: 'inspecao',
      descricao: 'Inspeção Subaquática Programada',
      status: 'SCHEDULED' as StatusManutencao,
      nivelRisco: 'INFO' as NivelRisco,
      dataRecomendacao: '2025-01-20T11:00:00',
      dataIdealExecucao: '2025-02-10',
      diasRestantes: 13,
      origem: {
        ibiAtual: 28,
        ibiProjetado: 35,
        deltaFuelNm: 8.2,
        custoEvitado: 450000
      },
      localRecomendado: 'Paranaguá, PR',
      fornecedorSugerido: 'SubSea Tech Solutions',
      custoEstimado: 85000,
      duracaoEstimada: 0.5,
      justificativaIA: 'Inspeção de rotina para monitoramento preventivo.',
      slaHoras: 168,
      horasRestantesSLA: 0,
      geradoPor: 'Sistema IA Planner',
      aprovadoPor: 'João Silva (Gestor)',
      dataAprovacao: '2025-01-21T10:30:00',
      dataAgendada: '2025-02-10T08:00:00',
      justificativaAprovacao: 'Inspeção necessária conforme cronograma preventivo.',
      notificacoesEnviadas: [
        { tipo: 'Email', destinatario: 'João Silva (Gestor)', data: '2025-01-20T11:01:00', status: 'Enviado' },
        { tipo: 'Email', destinatario: 'João Silva (Gestor)', data: '2025-01-21T10:31:00', status: 'Enviado', assunto: '[Aprovação] Inspeção recomendada — DANIEL PEREIRA — 2025-02-10' }
      ],
      historicoAcoes: [
        { data: '2025-01-20T11:00:00', usuario: 'Sistema', acao: 'Recomendação gerada', detalhes: 'Cronograma preventivo' },
        { data: '2025-01-20T11:01:00', usuario: 'Sistema', acao: 'Notificação enviada', detalhes: 'Email para Gestor' },
        { data: '2025-01-21T10:30:00', usuario: 'João Silva', acao: 'Aprovado', detalhes: 'Inspeção necessária conforme cronograma' },
        { data: '2025-01-21T14:45:00', usuario: 'Maria Santos', acao: 'Agendado', detalhes: 'Data confirmada com fornecedor' }
      ]
    },
    {
      id: 'REC-004',
      navioId: 'NAVIO-004',
      navio: 'EDUARDO COSTA',
      tipo: 'reparo',
      descricao: 'Reparo de Pintura - Área de Proa',
      status: 'DEFERRED' as StatusManutencao,
      nivelRisco: 'WARNING' as NivelRisco,
      dataRecomendacao: '2025-01-22T16:45:00',
      dataIdealExecucao: '2025-02-25',
      diasRestantes: 28,
      origem: {
        ibiAtual: 38,
        ibiProjetado: 45,
        deltaFuelNm: 12.1,
        custoEvitado: 780000
      },
      localRecomendado: 'Vitória, ES',
      fornecedorSugerido: 'Marine Coating Services',
      custoEstimado: 195000,
      duracaoEstimada: 3,
      justificativaIA: 'Desgaste de pintura detectado em inspeção. Reparo preventivo recomendado.',
      slaHoras: 72,
      horasRestantesSLA: 0,
      geradoPor: 'Sistema IA Planner',
      adiadoPor: 'João Silva (Gestor)',
      dataAdiamento: '2025-01-23T11:20:00',
      diasAdiados: 14,
      novaDataRevisao: '2025-02-06',
      justificativaAdiamento: 'Aguardando janela operacional mais adequada. Navio em rota crítica até 05/02.',
      notificacoesEnviadas: [
        { tipo: 'Email', destinatario: 'João Silva (Gestor)', data: '2025-01-22T16:46:00', status: 'Enviado' },
        { tipo: 'MS Teams', destinatario: 'Canal Manutenção', data: '2025-01-22T16:46:00', status: 'Enviado' },
        { tipo: 'Email', destinatario: 'Equipe Manutenção', data: '2025-01-23T11:21:00', status: 'Enviado', assunto: '[Adiamento] Reparo recomendado — EDUARDO COSTA' }
      ],
      historicoAcoes: [
        { data: '2025-01-22T16:45:00', usuario: 'Sistema', acao: 'Recomendação gerada', detalhes: 'Inspeção detectou desgaste' },
        { data: '2025-01-22T16:46:00', usuario: 'Sistema', acao: 'Notificações enviadas', detalhes: 'Email + Teams para Gestor' },
        { data: '2025-01-23T11:20:00', usuario: 'João Silva', acao: 'Adiado', detalhes: 'Aguardando janela operacional mais adequada' }
      ]
    },
    {
      id: 'REC-005',
      navioId: 'NAVIO-005',
      navio: 'FABIO SANTOS',
      tipo: 'limpeza',
      descricao: 'Limpeza de Emergência - Alto Risco NORMAM',
      status: 'IN_PROGRESS' as StatusManutencao,
      nivelRisco: 'IMMEDIATE' as NivelRisco,
      dataRecomendacao: '2025-01-27T08:15:00',
      dataIdealExecucao: '2025-01-29',
      diasRestantes: 1,
      origem: {
        ibiAtual: 82,
        ibiProjetado: 92,
        deltaFuelNm: 35.8,
        custoEvitado: 4250000
      },
      localRecomendado: 'Santos, SP',
      fornecedorSugerido: 'Emergency Hull Clean',
      custoEstimado: 650000,
      duracaoEstimada: 1,
      justificativaIA: 'URGENTE: IBI crítico com travessia de região biogeográfica em 3 dias. Risco de detenção NORMAM-401.',
      slaHoras: 6,
      horasRestantesSLA: 0,
      geradoPor: 'Sistema IA Planner + Compliance Module',
      aprovadoPor: 'João Silva (Gestor)',
      dataAprovacao: '2025-01-27T09:00:00',
      dataAgendada: '2025-01-28T06:00:00',
      dataInicio: '2025-01-28T06:30:00',
      justificativaAprovacao: 'EMERGÊNCIA: Aprovação imediata para evitar sanções NORMAM-401.',
      progresso: 45,
      notificacoesEnviadas: [
        { tipo: 'Email', destinatario: 'João Silva (Gestor)', data: '2025-01-27T08:16:00', status: 'Enviado' },
        { tipo: 'MS Teams', destinatario: 'Canal Manutenção', data: '2025-01-27T08:16:00', status: 'Enviado' },
        { tipo: 'Email', destinatario: 'Maria Santos (Gerente Frota)', data: '2025-01-27T08:16:00', status: 'Enviado' },
        { tipo: 'Email', destinatario: 'Pedro Costa (Compliance)', data: '2025-01-27T08:16:00', status: 'Enviado' },
        { tipo: 'SMS', destinatario: 'Comandante FABIO SANTOS', data: '2025-01-27T08:16:00', status: 'Enviado' },
        { tipo: 'Email', destinatario: 'Todos', data: '2025-01-27T09:01:00', status: 'Enviado', assunto: '[EMERGÊNCIA APROVADA] Limpeza imediata — FABIO SANTOS' }
      ],
      historicoAcoes: [
        { data: '2025-01-27T08:15:00', usuario: 'Sistema', acao: 'Recomendação gerada', detalhes: 'Alerta CRITICAL Compliance NORMAM-401' },
        { data: '2025-01-27T08:16:00', usuario: 'Sistema', acao: 'Notificações IMMEDIATE enviadas', detalhes: 'Email + Teams + SMS para Gestor, Gerente, Compliance e Comandante' },
        { data: '2025-01-27T09:00:00', usuario: 'João Silva', acao: 'Aprovado', detalhes: 'EMERGÊNCIA: Aprovação imediata' },
        { data: '2025-01-27T10:30:00', usuario: 'Maria Santos', acao: 'Agendado', detalhes: 'Fornecedor confirmado para 28/01 06:00' },
        { data: '2025-01-28T06:30:00', usuario: 'Sistema CMMS', acao: 'Iniciado', detalhes: 'Equipe em campo' }
      ]
    },
    {
      id: 'REC-006',
      navioId: 'NAVIO-006',
      navio: 'FELIPE RIBEIRO',
      tipo: 'preventiva',
      descricao: 'Manutenção Preventiva Trimestral',
      status: 'REJECTED' as StatusManutencao,
      nivelRisco: 'INFO' as NivelRisco,
      dataRecomendacao: '2025-01-24T13:30:00',
      dataIdealExecucao: '2025-03-15',
      diasRestantes: 46,
      origem: {
        ibiAtual: 22,
        ibiProjetado: 28,
        deltaFuelNm: 5.3,
        custoEvitado: 280000
      },
      localRecomendado: 'Suape, PE',
      fornecedorSugerido: 'Náutica Pro',
      custoEstimado: 120000,
      duracaoEstimada: 2,
      justificativaIA: 'Manutenção preventiva de rotina conforme cronograma.',
      slaHoras: 168,
      horasRestantesSLA: 0,
      geradoPor: 'Sistema IA Planner',
      rejeitadoPor: 'João Silva (Gestor)',
      dataRejeicao: '2025-01-25T15:45:00',
      justificativaRejeicao: 'IBI ainda em níveis aceitáveis. Manutenção adiada para próximo trimestre conforme análise de priorização orçamentária.',
      notificacoesEnviadas: [
        { tipo: 'Email', destinatario: 'João Silva (Gestor)', data: '2025-01-24T13:31:00', status: 'Enviado' },
        { tipo: 'Email', destinatario: 'Equipe Manutenção', data: '2025-01-25T15:46:00', status: 'Enviado', assunto: '[Rejeição] Manutenção recomendada — FELIPE RIBEIRO' }
      ],
      historicoAcoes: [
        { data: '2025-01-24T13:30:00', usuario: 'Sistema', acao: 'Recomendação gerada', detalhes: 'Cronograma preventivo trimestral' },
        { data: '2025-01-24T13:31:00', usuario: 'Sistema', acao: 'Notificação enviada', detalhes: 'Email para Gestor' },
        { data: '2025-01-25T15:45:00', usuario: 'João Silva', acao: 'Rejeitado', detalhes: 'IBI aceitável, adiado para próximo trimestre' }
      ]
    }
  ];

  // Dados de governança
  const dadosGovernanca = {
    tempoMedioAprovacao: 18.5, // horas
    taxaAprovacao: 76, // %
    taxaRejeicao: 12, // %
    taxaAdiamento: 12, // %
    recomendacoesPorRisco: {
      IMMEDIATE: 2,
      CRITICAL: 5,
      WARNING: 12,
      INFO: 8
    },
    custoEstimadoTotal: 2847000,
    custoRealizadoTotal: 2156000,
    economiaTotal: 691000,
    recomendacoesBloqueadasCompliance: 3,
    tendenciaMensal: [
      { mes: 'Set/24', total: 18, aprovadas: 14, rejeitadas: 2, adiadas: 2 },
      { mes: 'Out/24', total: 22, aprovadas: 17, rejeitadas: 3, adiadas: 2 },
      { mes: 'Nov/24', total: 25, aprovadas: 19, rejeitadas: 3, adiadas: 3 },
      { mes: 'Dez/24', total: 28, aprovadas: 21, rejeitadas: 4, adiadas: 3 },
      { mes: 'Jan/25', total: 27, aprovadas: 20, rejeitadas: 3, adiadas: 4 }
    ]
  };

  // Calcular métricas
  const recomendadas = recomendacoesManutencao.filter(m => m.status === 'RECOMMENDED').length;
  const aguardandoAprovacao = recomendacoesManutencao.filter(m => m.status === 'PENDING_APPROVAL').length;
  const aprovadas = recomendacoesManutencao.filter(m => ['APPROVED', 'SCHEDULED', 'IN_PROGRESS'].includes(m.status)).length;
  const emAndamento = recomendacoesManutencao.filter(m => m.status === 'IN_PROGRESS').length;
  const escaladas = recomendacoesManutencao.filter(m => m.horasRestantesSLA <= 0 && m.status === 'RECOMMENDED').length;

  // Filtrar recomendações
  const recomendacoesFiltradas = recomendacoesManutencao.filter(rec => {
    const statusMatch = filtroStatus === 'todos' || rec.status === filtroStatus;
    const tipoMatch = filtroTipo === 'todos' || rec.tipo === filtroTipo;
    return statusMatch && tipoMatch;
  });

  const handleAbrirAprovacao = (recomendacao: any) => {
    setRecomendacaoSelecionada(recomendacao);
    setModalAprovacao(true);
    setJustificativa('');
    setDecisaoAprovacao('APPROVED');
    setDiasAdiamento(7);
  };

  const handleAbrirAuditoria = (recomendacao: any) => {
    setRecomendacaoSelecionada(recomendacao);
    setModalAuditoria(true);
  };

  const handleProcessarDecisao = () => {
    if (!justificativa.trim()) {
      alert('Por favor, forneça uma justificativa para sua decisão');
      return;
    }

    console.log('Decisão processada:', {
      recomendacao: recomendacaoSelecionada.id,
      decisao: decisaoAprovacao,
      justificativa,
      diasAdiamento: decisaoAprovacao === 'DEFERRED' ? diasAdiamento : null,
      usuario: 'João Silva (Gestor)',
      timestamp: new Date().toISOString()
    });

    alert(`Recomendação ${decisaoAprovacao === 'APPROVED' ? 'aprovada' : decisaoAprovacao === 'REJECTED' ? 'rejeitada' : 'adiada'} com sucesso!`);
    setModalAprovacao(false);
  };

  const getStatusBadge = (status: StatusManutencao) => {
    const configs = {
      RECOMMENDED: { cor: 'bg-blue-500', texto: 'RECOMENDADO' },
      PENDING_APPROVAL: { cor: 'bg-yellow-500', texto: 'AGUARDANDO' },
      APPROVED: { cor: 'bg-emerald-500', texto: 'APROVADO' },
      SCHEDULED: { cor: 'bg-cyan-500', texto: 'AGENDADO' },
      IN_PROGRESS: { cor: 'bg-indigo-500', texto: 'EM EXECUÇÃO' },
      COMPLETED: { cor: 'bg-green-500', texto: 'CONCLUÍDO' },
      REJECTED: { cor: 'bg-red-500', texto: 'REJEITADO' },
      DEFERRED: { cor: 'bg-orange-500', texto: 'ADIADO' },
      CANCELLED: { cor: 'bg-gray-500', texto: 'CANCELADO' }
    };
    return configs[status];
  };

  const getRiscoBadge = (risco: NivelRisco) => {
    const configs = {
      INFO: { cor: 'bg-blue-500', texto: 'INFO' },
      WARNING: { cor: 'bg-yellow-500', texto: 'WARNING' },
      CRITICAL: { cor: 'bg-orange-500', texto: 'CRITICAL' },
      IMMEDIATE: { cor: 'bg-red-500', texto: 'IMMEDIATE' }
    };
    return configs[risco];
  };

  const podeAprovar = papelUsuario === 'maintenance_manager';
  const podeVisualizar = ['operator', 'maintenance_engineer', 'fleet_planner', 'maintenance_manager', 'compliance_officer', 'auditor'].includes(papelUsuario);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Manutenção e Limpeza</h1>
            <p className="text-gray-600">Sistema de recomendações com aprovação obrigatória e rastreabilidade completa</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setModalGovernanca(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all whitespace-nowrap shadow-lg"
            >
              <i className="ri-bar-chart-box-line mr-2"></i>
              Governança
            </button>
            <button 
              onClick={() => setModalNotificacoes(true)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-700 hover:to-blue-700 transition-all whitespace-nowrap shadow-lg"
            >
              <i className="ri-notification-3-line mr-2"></i>
              Notificações & SLA
            </button>
            <button 
              onClick={() => setModalScheduler(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all whitespace-nowrap shadow-lg"
            >
              <i className="ri-robot-2-line mr-2"></i>
              Scheduler IA
            </button>
            {podeAprovar && (
              <button 
                onClick={() => setModalNova(true)}
                className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors whitespace-nowrap"
              >
                <i className="ri-add-line mr-2"></i>
                Nova Recomendação Manual
              </button>
            )}
          </div>
        </div>

        {/* Informações de Permissão */}
        <Cartao className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-500 rounded-lg">
                <i className="ri-shield-user-line text-2xl text-white"></i>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Papel Atual</div>
                <div className="text-lg font-bold text-gray-900">
                  {papelUsuario === 'maintenance_manager' ? 'Gestor de Manutenção' :
                   papelUsuario === 'maintenance_engineer' ? 'Engenheiro de Manutenção' :
                   papelUsuario === 'fleet_planner' ? 'Planejador de Frota' :
                   papelUsuario === 'compliance_officer' ? 'Oficial de Compliance' :
                   papelUsuario === 'auditor' ? 'Auditor' : 'Operador'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Permissões</div>
              <div className="flex gap-2">
                {podeAprovar && (
                  <>
                    <Badge cor="bg-emerald-500" className="text-xs">
                      <i className="ri-checkbox-circle-line mr-1"></i>
                      Aprovar
                    </Badge>
                    <Badge cor="bg-red-500" className="text-xs">
                      <i className="ri-close-circle-line mr-1"></i>
                      Rejeitar
                    </Badge>
                    <Badge cor="bg-orange-500" className="text-xs">
                      <i className="ri-time-line mr-1"></i>
                      Adiar
                    </Badge>
                  </>
                )}
                {podeVisualizar && (
                  <Badge cor="bg-blue-500" className="text-xs">
                    <i className="ri-eye-line mr-1"></i>
                    Visualizar
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Cartao>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Cartao className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Recomendadas</div>
                <div className="text-3xl font-bold text-blue-600">{recomendadas}</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-blue-500/20 rounded-lg">
                <i className="ri-lightbulb-line text-2xl text-blue-600"></i>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Aguardando</div>
                <div className="text-3xl font-bold text-yellow-600">{aguardandoAprovacao}</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-yellow-500/20 rounded-lg">
                <i className="ri-time-line text-2xl text-yellow-600"></i>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Aprovadas</div>
                <div className="text-3xl font-bold text-emerald-600">{aprovadas}</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-emerald-500/20 rounded-lg">
                <i className="ri-checkbox-circle-line text-2xl text-emerald-600"></i>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Em Execução</div>
                <div className="text-3xl font-bold text-indigo-600">{emAndamento}</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-500/20 rounded-lg">
                <i className="ri-tools-line text-2xl text-indigo-600"></i>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Escaladas</div>
                <div className="text-3xl font-bold text-red-600">{escaladas}</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-red-500/20 rounded-lg">
                <i className="ri-error-warning-line text-2xl text-red-600"></i>
              </div>
            </div>
          </Cartao>
        </div>

        {/* Filtros */}
        <Cartao>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              {(['todos', 'RECOMMENDED', 'PENDING_APPROVAL', 'APPROVED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'DEFERRED'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFiltroStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    filtroStatus === status 
                      ? 'bg-cyan-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {status === 'todos' ? 'Todos' : getStatusBadge(status as StatusManutencao).texto}
                </button>
              ))}
            </div>
          </div>
        </Cartao>

        {/* Lista de Recomendações */}
        <div className="space-y-3">
          {recomendacoesFiltradas.map(recomendacao => {
            const statusConfig = getStatusBadge(recomendacao.status);
            const riscoConfig = getRiscoBadge(recomendacao.nivelRisco);
            const slaExpirado = recomendacao.horasRestantesSLA <= 0 && recomendacao.status === 'RECOMMENDED';

            return (
              <Cartao key={recomendacao.id} className={slaExpirado ? 'border-2 border-red-500' : ''}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${
                      recomendacao.tipo === 'limpeza' ? 'bg-cyan-500/20' :
                      recomendacao.tipo === 'inspecao' ? 'bg-blue-500/20' :
                      recomendacao.tipo === 'reparo' ? 'bg-orange-500/20' :
                      'bg-purple-500/20'
                    }`}>
                      <i className={`${
                        recomendacao.tipo === 'limpeza' ? 'ri-brush-line' :
                        recomendacao.tipo === 'inspecao' ? 'ri-search-eye-line' :
                        recomendacao.tipo === 'reparo' ? 'ri-tools-line' :
                        'ri-shield-check-line'
                      } text-2xl ${
                        recomendacao.tipo === 'limpeza' ? 'text-cyan-600' :
                        recomendacao.tipo === 'inspecao' ? 'text-blue-600' :
                        recomendacao.tipo === 'reparo' ? 'text-orange-600' :
                        'text-purple-600'
                      }`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900">{recomendacao.descricao}</h3>
                        <Badge cor={statusConfig.cor} className="text-xs">
                          {statusConfig.texto}
                        </Badge>
                        <Badge cor={riscoConfig.cor} className="text-xs">
                          {riscoConfig.texto}
                        </Badge>
                        {slaExpirado && (
                          <Badge cor="bg-red-600" className="text-xs animate-pulse">
                            <i className="ri-alarm-warning-line mr-1"></i>
                            SLA EXPIRADO
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 mb-3">
                        <span>
                          <i className="ri-ship-2-line mr-1"></i>
                          {recomendacao.navio}
                        </span>
                        <span>
                          <i className="ri-calendar-line mr-1"></i>
                          Ideal: {new Date(recomendacao.dataIdealExecucao).toLocaleDateString('pt-BR')}
                        </span>
                        <span>
                          <i className="ri-map-pin-line mr-1"></i>
                          {recomendacao.localRecomendado}
                        </span>
                        <span>
                          <i className="ri-money-dollar-circle-line mr-1"></i>
                          R$ {recomendacao.custoEstimado.toLocaleString('pt-BR')}
                        </span>
                      </div>

                      {/* Origem da Recomendação */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="text-xs font-medium text-gray-700 mb-2">Origem da Recomendação:</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-gray-600">IBI Atual:</span>
                            <span className="font-bold text-orange-600 ml-1">{recomendacao.origem.ibiAtual}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">IBI Projetado:</span>
                            <span className="font-bold text-red-600 ml-1">{recomendacao.origem.ibiProjetado}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Δ Consumo:</span>
                            <span className="font-bold text-blue-600 ml-1">+{recomendacao.origem.deltaFuelNm}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Custo Evitado:</span>
                            <span className="font-bold text-emerald-600 ml-1">R$ {(recomendacao.origem.custoEvitado / 1000000).toFixed(1)}M</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Justificativa IA:</strong> {recomendacao.justificativaIA}
                      </p>

                      {/* Notificações Enviadas */}
                      {recomendacao.notificacoesEnviadas && recomendacao.notificacoesEnviadas.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="text-xs font-medium text-gray-700 mb-2">
                            <i className="ri-notification-3-line mr-2"></i>Notificações Enviadas:
                          </div>
                          <div className="space-y-1">
                            {recomendacao.notificacoesEnviadas.map((notif: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-3 text-xs text-gray-600">
                                <Badge cor="bg-blue-500" className="text-xs">
                                  {notif.tipo}
                                </Badge>
                                <span>{notif.destinatario}</span>
                                <span className="text-gray-500">
                                  {new Date(notif.data).toLocaleString('pt-BR')}
                                </span>
                                {notif.assunto && (
                                  <span className="text-gray-700 italic">"{notif.assunto}"</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Próximo Escalonamento */}
                      {recomendacao.proximoEscalonamento && recomendacao.status === 'RECOMMENDED' && (
                        <div className="mt-3 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                          <div className="flex items-center gap-2 text-amber-800">
                            <i className="ri-alarm-warning-line"></i>
                            <span className="text-xs font-medium">
                              Próximo escalonamento: {new Date(recomendacao.proximoEscalonamento).toLocaleString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* SLA */}
                      {recomendacao.status === 'RECOMMENDED' && (
                        <div className="flex items-center gap-2 text-xs">
                          <i className={`ri-time-line ${slaExpirado ? 'text-red-600' : 'text-yellow-600'}`}></i>
                          <span className={slaExpirado ? 'text-red-600 font-bold' : 'text-gray-600'}>
                            SLA: {recomendacao.slaHoras}h 
                            {slaExpirado ? ' (EXPIRADO - ESCALONAMENTO AUTOMÁTICO)' : ` (${recomendacao.horasRestantesSLA}h restantes)`}
                          </span>
                        </div>
                      )}

                      {/* Informações de Aprovação/Rejeição/Adiamento */}
                      {recomendacao.aprovadoPor && (
                        <div className="mt-3 p-3 bg-emerald-50 rounded-lg text-sm">
                          <div className="flex items-center gap-2 text-emerald-700 mb-1">
                            <i className="ri-checkbox-circle-line"></i>
                            <strong>Aprovado por:</strong> {recomendacao.aprovadoPor}
                          </div>
                          <div className="text-gray-700">{recomendacao.justificativaAprovacao}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(recomendacao.dataAprovacao!).toLocaleString('pt-BR')}
                          </div>
                        </div>
                      )}

                      {recomendacao.rejeitadoPor && (
                        <div className="mt-3 p-3 bg-red-50 rounded-lg text-sm">
                          <div className="flex items-center gap-2 text-red-700 mb-1">
                            <i className="ri-close-circle-line"></i>
                            <strong>Rejeitado por:</strong> {recomendacao.rejeitadoPor}
                          </div>
                          <div className="text-gray-700">{recomendacao.justificativaRejeicao}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(recomendacao.dataRejeicao!).toLocaleString('pt-BR')}
                          </div>
                        </div>
                      )}

                      {recomendacao.adiadoPor && (
                        <div className="mt-3 p-3 bg-orange-50 rounded-lg text-sm">
                          <div className="flex items-center gap-2 text-orange-700 mb-1">
                            <i className="ri-time-line"></i>
                            <strong>Adiado por:</strong> {recomendacao.adiadoPor}
                          </div>
                          <div className="text-gray-700 mb-1">{recomendacao.justificativaAdiamento}</div>
                          <div className="text-xs text-gray-600">
                            Adiado por {recomendacao.diasAdiados} dias • Nova revisão: {new Date(recomendacao.novaDataRevisao!).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 ml-4">
                    {recomendacao.status === 'RECOMMENDED' && podeAprovar && (
                      <button 
                        onClick={() => handleAbrirAprovacao(recomendacao)}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors whitespace-nowrap"
                      >
                        <i className="ri-checkbox-circle-line mr-1"></i>
                        Analisar
                      </button>
                    )}
                    <button 
                      onClick={() => handleAbrirAuditoria(recomendacao)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors whitespace-nowrap"
                    >
                      <i className="ri-file-list-3-line mr-1"></i>
                      Auditoria
                    </button>
                  </div>
                </div>

                {/* Progresso */}
                {recomendacao.progresso !== undefined && recomendacao.status === 'IN_PROGRESS' && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progresso da Execução</span>
                      <span className="text-sm font-medium text-gray-900">{recomendacao.progresso}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${recomendacao.progresso}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </Cartao>
            );
          })}
        </div>

        {/* Modal de Notificações & SLA */}
        {modalNotificacoes && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <Cartao className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Notificações & SLA / Escalonamento</h2>
                  <p className="text-sm text-gray-600">Políticas de notificação e escalonamento automático</p>
                </div>
                <button 
                  onClick={() => setModalNotificacoes(false)}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <i className="ri-close-line text-xl text-gray-900"></i>
                </button>
              </div>

              {/* Políticas por Nível de Risco */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Políticas por Nível de Risco</h3>

                {/* IMMEDIATE */}
                <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-red-500 rounded-lg">
                      <i className="ri-alarm-warning-line text-white text-xl"></i>
                    </div>
                    <div>
                      <div className="font-bold text-red-900">IMMEDIATE</div>
                      <div className="text-sm text-red-700">Risco imediato de sanção/detenção</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <i className="ri-notification-3-line text-red-600 mt-0.5"></i>
                      <div>
                        <strong>Notificações Imediatas:</strong>
                        <div className="text-gray-700 ml-5">
                          • Email + MS Teams + SMS para Gestor de Manutenção<br/>
                          • Email + MS Teams para Gerente de Frota<br/>
                          • Email para Oficial de Compliance<br/>
                          • SMS para Comandante do Navio<br/>
                          • Notificação push no app mobile
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-time-line text-red-600 mt-0.5"></i>
                      <div>
                        <strong>SLA:</strong> 6 horas para decisão
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-arrow-up-circle-line text-red-600 mt-0.5"></i>
                      <div>
                        <strong>Escalonamento:</strong> Sem escalonamento - Bloqueio automático de travessia via módulo Compliance até confirmação
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-links-line text-red-600 mt-0.5"></i>
                      <div>
                        <strong>Ação:</strong> Notificações contêm botão direto para modal de aprovação com todas as evidências
                      </div>
                    </div>
                  </div>
                </div>

                {/* CRITICAL */}
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-orange-500 rounded-lg">
                      <i className="ri-error-warning-line text-white text-xl"></i>
                    </div>
                    <div>
                      <div className="font-bold text-orange-900">CRITICAL</div>
                      <div className="text-sm text-orange-700">Vai violar antes da travessia</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <i className="ri-notification-3-line text-orange-600 mt-0.5"></i>
                      <div>
                        <strong>Notificações Imediatas:</strong>
                        <div className="text-gray-700 ml-5">
                          • Email + MS Teams para Gestor de Manutenção<br/>
                          • Email + MS Teams para Gerente de Frota<br/>
                          • Notificação push no app mobile
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-time-line text-orange-600 mt-0.5"></i>
                      <div>
                        <strong>SLA:</strong> 24 horas para decisão
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-arrow-up-circle-line text-orange-600 mt-0.5"></i>
                      <div>
                        <strong>Escalonamento:</strong> 12 horas - Escalonar para Gerente de Frota + Diretor de Operações
                      </div>
                    </div>
                  </div>
                </div>

                {/* WARNING */}
                <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-amber-500 rounded-lg">
                      <i className="ri-alert-line text-white text-xl"></i>
                    </div>
                    <div>
                      <div className="font-bold text-amber-900">WARNING</div>
                      <div className="text-sm text-amber-700">Ação recomendada</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <i className="ri-notification-3-line text-amber-600 mt-0.5"></i>
                      <div>
                        <strong>Notificações Imediatas:</strong>
                        <div className="text-gray-700 ml-5">
                          • Email + MS Teams para Gestor de Manutenção<br/>
                          • Notificação no dashboard
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-time-line text-amber-600 mt-0.5"></i>
                      <div>
                        <strong>SLA:</strong> 72 horas para decisão
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-arrow-up-circle-line text-amber-600 mt-0.5"></i>
                      <div>
                        <strong>Escalonamento:</strong>
                        <div className="text-gray-700 ml-5">
                          • 48 horas - Lembrete automático para Gestor<br/>
                          • 24 horas - Escalonar para Gerente de Frota
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* INFO */}
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-lg">
                      <i className="ri-information-line text-white text-xl"></i>
                    </div>
                    <div>
                      <div className="font-bold text-blue-900">INFORMATION</div>
                      <div className="text-sm text-blue-700">Situação sob controle</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <i className="ri-notification-3-line text-blue-600 mt-0.5"></i>
                      <div>
                        <strong>Notificações:</strong>
                        <div className="text-gray-700 ml-5">
                          • Email para Gestor de Manutenção<br/>
                          • Notificação no dashboard
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-time-line text-blue-600 mt-0.5"></i>
                      <div>
                        <strong>SLA:</strong> 168 horas (7 dias) para decisão
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-arrow-up-circle-line text-blue-600 mt-0.5"></i>
                      <div>
                        <strong>Escalonamento:</strong> 120 horas (5 dias) - Lembrete para Gestor
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Templates de Email */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates de Email</h3>
                
                {/* Template Aprovação */}
                <div className="mb-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="font-bold text-emerald-900 mb-2">Template de Aprovação</div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong className="text-gray-700">Assunto:</strong>
                      <div className="bg-white p-2 rounded mt-1 text-gray-900">
                        [Aprovação] Limpeza recomendada — Navio EDUARDO COSTA — 2025-12-03
                      </div>
                    </div>
                    <div>
                      <strong className="text-gray-700">Corpo:</strong>
                      <div className="bg-white p-3 rounded mt-1 text-gray-900 whitespace-pre-line">
{`A recomendação de limpeza gerada em 2025-11-30 (IBI previsto 63) foi APROVADA por João Silva (Gestor de Manutenção).

Ordem criada: CMMS-2025-000123
Data agendada: 2025-12-03
Local: Santos, SP
Fornecedor: HullWiper Brasil

Ver detalhes: [Abrir no Sistema]`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template Rejeição */}
                <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="font-bold text-red-900 mb-2">Template de Rejeição</div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong className="text-gray-700">Assunto:</strong>
                      <div className="bg-white p-2 rounded mt-1 text-gray-900">
                        [Rejeição] Limpeza recomendada — Navio EDUARDO COSTA
                      </div>
                    </div>
                    <div>
                      <strong className="text-gray-700">Corpo:</strong>
                      <div className="bg-white p-3 rounded mt-1 text-gray-900 whitespace-pre-line">
{`A recomendação gerada em 2025-11-30 foi REJEITADA por Maria Pereira (Gestor) às 2025-11-30T16:12.

Motivo: "Janela operacional indisponível; priorizar docagem em 10 dias"

Comentários: "Solicitar reavaliação em 7 dias."

Ver detalhes: [Abrir no Sistema]`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template Adiamento */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="font-bold text-orange-900 mb-2">Template de Adiamento</div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong className="text-gray-700">Assunto:</strong>
                      <div className="bg-white p-2 rounded mt-1 text-gray-900">
                        [Adiamento] Reparo recomendado — Navio EDUARDO COSTA
                      </div>
                    </div>
                    <div>
                      <strong className="text-gray-700">Corpo:</strong>
                      <div className="bg-white p-3 rounded mt-1 text-gray-900 whitespace-pre-line">
{`A recomendação gerada em 2025-01-22 foi ADIADA por João Silva (Gestor) às 2025-01-23T11:20.

Adiado por: 14 dias
Nova data de revisão: 2025-02-06

Justificativa: "Aguardando janela operacional mais adequada. Navio em rota crítica até 05/02."

Ver detalhes: [Abrir no Sistema]`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setModalNotificacoes(false)}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors whitespace-nowrap"
              >
                Fechar
              </button>
            </Cartao>
          </div>
        )}

        {/* Modal de Governança */}
        {modalGovernanca && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <Cartao className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Indicadores & Dashboards de Governança</h2>
                  <p className="text-sm text-gray-600">Métricas de desempenho e eficiência do sistema de manutenção</p>
                </div>
                <button 
                  onClick={() => setModalGovernanca(false)}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <i className="ri-close-line text-xl text-gray-900"></i>
                </button>
              </div>

              {/* KPIs Principais */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-700 mb-1">Tempo Médio para Aprovação</div>
                  <div className="text-3xl font-bold text-blue-900">{dadosGovernanca.tempoMedioAprovacao}h</div>
                  <div className="text-xs text-blue-600 mt-1">Meta: &lt; 24h</div>
                </div>

                <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                  <div className="text-sm text-emerald-700 mb-1">Taxa de Aprovação</div>
                  <div className="text-3xl font-bold text-emerald-900">{dadosGovernanca.taxaAprovacao}%</div>
                  <div className="text-xs text-emerald-600 mt-1">Meta: &gt; 70%</div>
                </div>

                <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                  <div className="text-sm text-amber-700 mb-1">Economia Realizada</div>
                  <div className="text-3xl font-bold text-amber-900">R$ {(dadosGovernanca.economiaTotal / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-amber-600 mt-1">vs Estimado: R$ {(dadosGovernanca.custoEstimadoTotal / 1000).toFixed(0)}K</div>
                </div>

                <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                  <div className="text-sm text-red-700 mb-1">Bloqueadas por Compliance</div>
                  <div className="text-3xl font-bold text-red-900">{dadosGovernanca.recomendacoesBloqueadasCompliance}</div>
                  <div className="text-xs text-red-600 mt-1">Requer auditoria</div>
                </div>
              </div>

              {/* Fila de Recomendações por Status */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fila de Recomendações por Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Recomendadas</div>
                    <div className="text-2xl font-bold text-blue-600">{recomendadas}</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Aguardando</div>
                    <div className="text-2xl font-bold text-yellow-600">{aguardandoAprovacao}</div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Aprovadas</div>
                    <div className="text-2xl font-bold text-emerald-600">{aprovadas}</div>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Em Execução</div>
                    <div className="text-2xl font-bold text-indigo-600">{emAndamento}</div>
                  </div>
                </div>
              </div>

              {/* Recomendações por Nível de Risco */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendações por Nível de Risco</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <div className="text-xs text-gray-600 mb-1">IMMEDIATE</div>
                    <div className="text-2xl font-bold text-red-600">{dadosGovernanca.recomendacoesPorRisco.IMMEDIATE}</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <div className="text-xs text-gray-600 mb-1">CRITICAL</div>
                    <div className="text-2xl font-bold text-orange-600">{dadosGovernanca.recomendacoesPorRisco.CRITICAL}</div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                    <div className="text-xs text-gray-600 mb-1">WARNING</div>
                    <div className="text-2xl font-bold text-amber-600">{dadosGovernanca.recomendacoesPorRisco.WARNING}</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="text-xs text-gray-600 mb-1">INFO</div>
                    <div className="text-2xl font-bold text-blue-600">{dadosGovernanca.recomendacoesPorRisco.INFO}</div>
                  </div>
                </div>
              </div>

              {/* Tendência Mensal */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendência Mensal</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    {dadosGovernanca.tendenciaMensal.map((mes, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-20 text-sm font-medium text-gray-700">{mes.mes}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-xs text-gray-600">Total: {mes.total}</div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className="flex h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-emerald-500" 
                                  style={{ width: `${(mes.aprovadas / mes.total) * 100}%` }}
                                  title={`Aprovadas: ${mes.aprovadas}`}
                                ></div>
                                <div 
                                  className="bg-red-500" 
                                  style={{ width: `${(mes.rejeitadas / mes.total) * 100}%` }}
                                  title={`Rejeitadas: ${mes.rejeitadas}`}
                                ></div>
                                <div 
                                  className="bg-orange-500" 
                                  style={{ width: `${(mes.adiadas / mes.total) * 100}%` }}
                                  title={`Adiadas: ${mes.adiadas}`}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-4 text-xs">
                            <span className="text-emerald-600">✓ {mes.aprovadas}</span>
                            <span className="text-red-600">✗ {mes.rejeitadas}</span>
                            <span className="text-orange-600">⏸ {mes.adiadas}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custos Estimados vs Realizados */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Custos Estimados vs Realizados</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Custo Estimado Total</div>
                    <div className="text-2xl font-bold text-blue-900">R$ {(dadosGovernanca.custoEstimadoTotal / 1000000).toFixed(2)}M</div>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Custo Realizado Total</div>
                    <div className="text-2xl font-bold text-emerald-900">R$ {(dadosGovernanca.custoRealizadoTotal / 1000000).toFixed(2)}M</div>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Economia Total</div>
                    <div className="text-2xl font-bold text-amber-900">R$ {(dadosGovernanca.economiaTotal / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-amber-600 mt-1">
                      {((dadosGovernanca.economiaTotal / dadosGovernanca.custoEstimadoTotal) * 100).toFixed(1)}% de economia
                    </div>
                  </div>
                </div>
              </div>

              {/* Distribuição de Decisões */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Decisões</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden flex">
                    <div 
                      className="bg-emerald-500 flex items-center justify-center text-white text-sm font-medium"
                      style={{ width: `${dadosGovernanca.taxaAprovacao}%` }}
                    >
                      {dadosGovernanca.taxaAprovacao}%
                    </div>
                    <div 
                      className="bg-red-500 flex items-center justify-center text-white text-sm font-medium"
                      style={{ width: `${dadosGovernanca.taxaRejeicao}%` }}
                    >
                      {dadosGovernanca.taxaRejeicao}%
                    </div>
                    <div 
                      className="bg-orange-500 flex items-center justify-center text-white text-sm font-medium"
                      style={{ width: `${dadosGovernanca.taxaAdiamento}%` }}
                    >
                      {dadosGovernanca.taxaAdiamento}%
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 mt-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                    <span className="text-gray-700">Aprovadas ({dadosGovernanca.taxaAprovacao}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-gray-700">Rejeitadas ({dadosGovernanca.taxaRejeicao}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-gray-700">Adiadas ({dadosGovernanca.taxaAdiamento}%)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors whitespace-nowrap">
                  <i className="ri-file-excel-line mr-2"></i>
                  Exportar Relatório Excel
                </button>
                <button 
                  onClick={() => setModalGovernanca(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors whitespace-nowrap"
                >
                  Fechar
                </button>
              </div>
            </Cartao>
          </div>
        )}

        {/* Modais existentes continuam aqui... */}

      </div>
    </div>
  );
};

export default PaginaManutencao;
