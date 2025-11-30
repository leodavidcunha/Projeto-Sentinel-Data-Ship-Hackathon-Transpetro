import { useState } from 'react';
import { alertasMock } from '../../mocks/alertas';
import { naviosMock } from '../../mocks/navios';
import { Cartao } from '../../components/atoms/Cartao';
import { Badge } from '../../components/atoms/Badge';

const PaginaAlertas = () => {
  const [filtroSeveridade, setFiltroSeveridade] = useState<'todos' | 'baixa' | 'media' | 'alta' | 'critica'>('todos');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativo' | 'resolvido' | 'ignorado'>('todos');
  const [modalConfig, setModalConfig] = useState(false);

  const alertasFiltrados = alertasMock.filter(alerta => {
    const matchSeveridade = filtroSeveridade === 'todos' || alerta.severidade === filtroSeveridade;
    const matchStatus = filtroStatus === 'todos' || alerta.status === filtroStatus;
    return matchSeveridade && matchStatus;
  });

  const alertasAtivos = alertasMock.filter(a => a.status === 'ativo').length;
  const alertasCriticos = alertasMock.filter(a => a.severidade === 'critica' && a.status === 'ativo').length;

  const tiposAlerta = [
    { id: 'ibi_alto', nome: 'IBI Acima do Limite', icone: 'ri-ship-2-line', ativo: true },
    { id: 'delta_fuel', nome: 'Delta Combustível Elevado', icone: 'ri-gas-station-line', ativo: true },
    { id: 'previsao_critica', nome: 'Previsão de Fouling Crítica', icone: 'ri-line-chart-line', ativo: true },
    { id: 'normam', nome: 'Risco NORMAM-401', icone: 'ri-shield-check-line', ativo: true },
    { id: 'temperatura', nome: 'Temperatura Crítica da Água', icone: 'ri-temp-hot-line', ativo: false },
    { id: 'velocidade', nome: 'Velocidade Baixa Prolongada', icone: 'ri-speed-line', ativo: true },
    { id: 'idle', nome: 'Tempo Parado Excessivo', icone: 'ri-time-line', ativo: true },
    { id: 'inspecao', nome: 'Inspeção Vencida', icone: 'ri-search-eye-line', ativo: false }
  ];

  const acoesAutomaticas = [
    { id: 'email', nome: 'Enviar E-mail', icone: 'ri-mail-line', ativo: true },
    { id: 'teams', nome: 'Notificar MS Teams', icone: 'ri-team-line', ativo: true },
    { id: 'slack', nome: 'Notificar Slack', icone: 'ri-slack-line', ativo: false },
    { id: 'ordem', nome: 'Criar Ordem de Limpeza', icone: 'ri-file-add-line', ativo: false },
    { id: 'comandante', nome: 'Notificar Comandante', icone: 'ri-user-star-line', ativo: true },
    { id: 'dashboard', nome: 'Destacar no Dashboard', icone: 'ri-dashboard-line', ativo: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Alertas & Automação</h1>
            <p className="text-gray-600">Monitoramento inteligente e ações automatizadas</p>
          </div>
          <button 
            onClick={() => setModalConfig(true)}
            className="px-6 py-3 bg-transpetro-green-600 text-white rounded-lg font-medium hover:bg-transpetro-green-700 transition-colors whitespace-nowrap"
          >
            <i className="ri-settings-3-line mr-2"></i>
            Configurar Alertas
          </button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Cartao className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Alertas Críticos</div>
                <div className="text-3xl font-bold text-red-600">{alertasCriticos}</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-red-500/20 rounded-lg">
                <i className="ri-error-warning-line text-2xl text-red-500"></i>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Alertas Ativos</div>
                <div className="text-3xl font-bold text-orange-600">{alertasAtivos}</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-orange-500/20 rounded-lg">
                <i className="ri-notification-3-line text-2xl text-orange-500"></i>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Resolvidos Hoje</div>
                <div className="text-3xl font-bold text-emerald-600">12</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-emerald-500/20 rounded-lg">
                <i className="ri-checkbox-circle-line text-2xl text-emerald-500"></i>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Ações Automáticas</div>
                <div className="text-3xl font-bold text-cyan-600">47</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-cyan-500/20 rounded-lg">
                <i className="ri-robot-line text-2xl text-cyan-500"></i>
              </div>
            </div>
          </Cartao>
        </div>

        {/* Filtros */}
        <Cartao>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-900">Severidade:</span>
              {(['todos', 'baixa', 'media', 'alta', 'critica'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setFiltroSeveridade(sev)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    filtroSeveridade === sev 
                      ? 'bg-transpetro-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sev.charAt(0).toUpperCase() + sev.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-900">Status:</span>
              {(['todos', 'ativo', 'resolvido', 'ignorado'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFiltroStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    filtroStatus === status 
                      ? 'bg-transpetro-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </Cartao>

        {/* Lista de Alertas */}
        <div className="space-y-3">
          {alertasFiltrados.map(alerta => {
            const navio = naviosMock.find(n => n.id === alerta.navioId);
            return (
              <Cartao 
                key={alerta.id}
                className={`border-l-4 ${
                  alerta.severidade === 'critica' ? 'border-l-red-500 bg-red-500/5' :
                  alerta.severidade === 'alta' ? 'border-l-orange-500 bg-orange-500/5' :
                  alerta.severidade === 'media' ? 'border-l-yellow-500 bg-yellow-500/5' :
                  'border-l-blue-500 bg-blue-500/5'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${
                      alerta.severidade === 'critica' ? 'bg-red-500/20' :
                      alerta.severidade === 'alta' ? 'bg-orange-500/20' :
                      alerta.severidade === 'media' ? 'bg-yellow-500/20' :
                      'bg-blue-500/20'
                    }`}>
                      <i className={`${
                        alerta.tipo === 'ibi_alto' ? 'ri-ship-2-line' :
                        alerta.tipo === 'delta_fuel' ? 'ri-gas-station-line' :
                        alerta.tipo === 'previsao_critica' ? 'ri-line-chart-line' :
                        alerta.tipo === 'normam' ? 'ri-shield-check-line' :
                        alerta.tipo === 'temperatura' ? 'ri-temp-hot-line' :
                        alerta.tipo === 'velocidade' ? 'ri-speed-line' :
                        'ri-time-line'
                      } text-2xl ${
                        alerta.severidade === 'critica' ? 'text-red-600' :
                        alerta.severidade === 'alta' ? 'text-orange-600' :
                        alerta.severidade === 'media' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}></i>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{alerta.titulo}</h3>
                        <Badge cor={
                          alerta.severidade === 'critica' ? 'bg-red-500' :
                          alerta.severidade === 'alta' ? 'bg-orange-500' :
                          alerta.severidade === 'media' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        } className="text-xs">
                          {alerta.severidade.toUpperCase()}
                        </Badge>
                        <Badge cor={
                          alerta.status === 'ativo' ? 'bg-orange-500' :
                          alerta.status === 'resolvido' ? 'bg-emerald-500' :
                          'bg-slate-600'
                        } className="text-xs">
                          {alerta.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alerta.mensagem}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>
                          <i className="ri-ship-2-line mr-1"></i>
                          {navio?.nome}
                        </span>
                        <span>
                          <i className="ri-time-line mr-1"></i>
                          {new Date(alerta.dataDeteccao).toLocaleString('pt-BR')}
                        </span>
                        {alerta.valorAtual && (
                          <span>
                            <i className="ri-bar-chart-line mr-1"></i>
                            Valor: {alerta.valorAtual}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {alerta.status === 'ativo' && (
                      <>
                        <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors whitespace-nowrap">
                          <i className="ri-check-line mr-1"></i>
                          Resolver
                        </button>
                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors whitespace-nowrap">
                          <i className="ri-close-line mr-1"></i>
                          Ignorar
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {alerta.acoesRealizadas && alerta.acoesRealizadas.length > 0 && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="text-xs font-medium text-gray-700 mb-2">Ações Automáticas Realizadas:</div>
                    <div className="flex flex-wrap gap-2">
                      {alerta.acoesRealizadas.map((acao, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          <i className="ri-check-line text-emerald-600 mr-1"></i>
                          {acao}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Cartao>
            );
          })}
        </div>

        {/* Modal de Configuração */}
        {modalConfig && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <Cartao className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Configuração de Alertas</h2>
                <button 
                  onClick={() => setModalConfig(false)}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <i className="ri-close-line text-xl text-gray-900"></i>
                </button>
              </div>

              {/* Tipos de Alerta */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Alerta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tiposAlerta.map(tipo => (
                    <div 
                      key={tipo.id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        tipo.ativo 
                          ? 'bg-transpetro-green-50 border-transpetro-green-500' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <i className={`${tipo.icone} text-xl ${tipo.ativo ? 'text-transpetro-green-600' : 'text-gray-500'}`}></i>
                          <span className={`text-sm font-medium ${tipo.ativo ? 'text-gray-900' : 'text-gray-600'}`}>
                            {tipo.nome}
                          </span>
                        </div>
                        <div className={`w-12 h-6 rounded-full transition-all ${
                          tipo.ativo ? 'bg-transpetro-green-500' : 'bg-gray-300'
                        }`}>
                          <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-all ${
                            tipo.ativo ? 'ml-6' : 'ml-0.5'
                          }`}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ações Automáticas */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Automáticas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {acoesAutomaticas.map(acao => (
                    <div 
                      key={acao.id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        acao.ativo 
                          ? 'bg-emerald-50 border-emerald-500' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <i className={`${acao.icone} text-xl ${acao.ativo ? 'text-emerald-600' : 'text-gray-500'}`}></i>
                          <span className={`text-sm font-medium ${acao.ativo ? 'text-gray-900' : 'text-gray-600'}`}>
                            {acao.nome}
                          </span>
                        </div>
                        <div className={`w-12 h-6 rounded-full transition-all ${
                          acao.ativo ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}>
                          <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-all ${
                            acao.ativo ? 'ml-6' : 'ml-0.5'
                          }`}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Limites Personalizados */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Limites Personalizados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">IBI Máximo</label>
                    <input 
                      type="number" 
                      defaultValue={75}
                      className="w-full bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-300 focus:border-transpetro-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Delta Fuel (t/nm)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      defaultValue={0.3}
                      className="w-full bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-300 focus:border-transpetro-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Temperatura Água (°C)</label>
                    <input 
                      type="number" 
                      defaultValue={28}
                      className="w-full bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-300 focus:border-transpetro-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Velocidade Mínima (nós)</label>
                    <input 
                      type="number" 
                      defaultValue={5}
                      className="w-full bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-300 focus:border-transpetro-green-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 bg-transpetro-green-600 text-white rounded-lg font-medium hover:bg-transpetro-green-700 transition-colors whitespace-nowrap">
                  <i className="ri-save-line mr-2"></i>
                  Salvar Configurações
                </button>
                <button 
                  onClick={() => setModalConfig(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors whitespace-nowrap"
                >
                  Cancelar
                </button>
              </div>
            </Cartao>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaginaAlertas;
