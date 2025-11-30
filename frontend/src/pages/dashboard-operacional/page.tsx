import { useState } from 'react';
import { naviosMock } from '../../mocks/navios';
import { alertasMock } from '../../mocks/alertas';
import { Cartao } from '../../components/atoms/Cartao';
import { Badge } from '../../components/atoms/Badge';

const DashboardOperacional = () => {
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'alertas' | 'inspecoes' | 'limpezas' | 'viagens'>('todos');

  // Próximas inspeções
  const proximasInspecoes = [
    { id: 1, navioId: 'NAVIO-001', navio: 'Transpetro I', tipo: 'ROV Subaquática', data: '2025-02-05', dias: 7, status: 'agendada' },
    { id: 2, navioId: 'NAVIO-003', navio: 'Transpetro III', tipo: 'Inspeção Visual', data: '2025-02-08', dias: 10, status: 'agendada' },
    { id: 3, navioId: 'NAVIO-005', navio: 'Transpetro V', tipo: 'ROV Completa', data: '2025-02-12', dias: 14, status: 'pendente' },
    { id: 4, navioId: 'NAVIO-007', navio: 'Transpetro VII', tipo: 'Inspeção Casco', data: '2025-02-15', dias: 17, status: 'pendente' },
    { id: 5, navioId: 'NAVIO-002', navio: 'Transpetro II', tipo: 'Vistoria Anual', data: '2025-02-20', dias: 22, status: 'planejada' }
  ];

  // Próximas limpezas
  const proximasLimpezas = [
    { id: 1, navioId: 'NAVIO-001', navio: 'Transpetro I', tipo: 'Limpeza ROV', data: '2025-02-10', dias: 12, porto: 'Santos', status: 'confirmada' },
    { id: 2, navioId: 'NAVIO-004', navio: 'Transpetro IV', tipo: 'Docagem', data: '2025-02-18', dias: 20, porto: 'Rio de Janeiro', status: 'agendada' },
    { id: 3, navioId: 'NAVIO-006', navio: 'Transpetro VI', tipo: 'Limpeza In-Water', data: '2025-02-25', dias: 27, porto: 'Paranaguá', status: 'planejada' },
    { id: 4, navioId: 'NAVIO-008', navio: 'Transpetro VIII', tipo: 'Limpeza ROV', data: '2025-03-05', dias: 35, porto: 'Salvador', status: 'planejada' }
  ];

  // Perfis de viagem
  const perfisViagem = [
    { 
      id: 1, 
      navioId: 'NAVIO-001', 
      navio: 'Transpetro I', 
      origem: 'Santos', 
      destino: 'Rio de Janeiro', 
      distancia: 420, 
      duracao: 28, 
      status: 'em_transito',
      clima: { vento: 15, onda: 2.5, corrente: 1.2 },
      eta: '2025-01-30 14:00'
    },
    { 
      id: 2, 
      navioId: 'NAVIO-003', 
      navio: 'Transpetro III', 
      origem: 'Salvador', 
      destino: 'Fortaleza', 
      distancia: 850, 
      duracao: 56, 
      status: 'em_transito',
      clima: { vento: 22, onda: 3.8, corrente: 1.8 },
      eta: '2025-01-31 08:00'
    },
    { 
      id: 3, 
      navioId: 'NAVIO-005', 
      navio: 'Transpetro V', 
      origem: 'Paranaguá', 
      destino: 'Santos', 
      distancia: 280, 
      duracao: 18, 
      status: 'planejada',
      clima: { vento: 12, onda: 1.8, corrente: 0.9 },
      eta: '2025-02-02 10:00'
    },
    { 
      id: 4, 
      navioId: 'NAVIO-007', 
      navio: 'Transpetro VII', 
      origem: 'Rio de Janeiro', 
      destino: 'Vitória', 
      distancia: 520, 
      duracao: 34, 
      status: 'atracado',
      clima: { vento: 18, onda: 2.2, corrente: 1.5 },
      eta: '2025-02-03 16:00'
    }
  ];

  // Alertas críticos filtrados
  const alertasCriticos = alertasMock.filter(a => a.severidade === 'crítica' || a.severidade === 'alta').slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.REACT_APP_NAVIGATE('/app/cockpit')}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              Voltar ao Cockpit
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Operacional</h1>
              <p className="text-gray-600">Gestão de alertas, inspeções, limpezas e viagens</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors whitespace-nowrap cursor-pointer">
            <i className="ri-download-line mr-2"></i>
            Exportar Operações
          </button>
        </div>

        {/* Métricas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Cartao className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-red-100 text-sm mb-1">Alertas Ativos</div>
                <div className="text-4xl font-bold mb-1">{alertasCriticos.length}</div>
                <div className="text-red-100 text-xs">críticos/altos</div>
              </div>
              <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-xl">
                <i className="ri-alarm-warning-line text-3xl"></i>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-100 text-sm mb-1">Próximas Inspeções</div>
                <div className="text-4xl font-bold mb-1">{proximasInspecoes.length}</div>
                <div className="text-blue-100 text-xs">próximos 30 dias</div>
              </div>
              <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-xl">
                <i className="ri-search-eye-line text-3xl"></i>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-emerald-100 text-sm mb-1">Próximas Limpezas</div>
                <div className="text-4xl font-bold mb-1">{proximasLimpezas.length}</div>
                <div className="text-emerald-100 text-xs">agendadas</div>
              </div>
              <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-xl">
                <i className="ri-brush-line text-3xl"></i>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-purple-100 text-sm mb-1">Navios em Trânsito</div>
                <div className="text-4xl font-bold mb-1">{perfisViagem.filter(v => v.status === 'em_transito').length}</div>
                <div className="text-purple-100 text-xs">navegando agora</div>
              </div>
              <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-xl">
                <i className="ri-ship-2-line text-3xl"></i>
              </div>
            </div>
          </Cartao>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Visualizar:</span>
          {(['todos', 'alertas', 'inspecoes', 'limpezas', 'viagens'] as const).map(tipo => (
            <button
              key={tipo}
              onClick={() => setFiltroTipo(tipo)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filtroTipo === tipo 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tipo === 'todos' && 'Todos'}
              {tipo === 'alertas' && 'Alertas'}
              {tipo === 'inspecoes' && 'Inspeções'}
              {tipo === 'limpezas' && 'Limpezas'}
              {tipo === 'viagens' && 'Viagens'}
            </button>
          ))}
        </div>

        {/* Alertas Críticos */}
        {(filtroTipo === 'todos' || filtroTipo === 'alertas') && (
          <Cartao>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Alertas Críticos</h3>
              <Badge cor="bg-red-500" className="text-sm">
                {alertasCriticos.length} ativos
              </Badge>
            </div>
            <div className="space-y-3">
              {alertasCriticos.map(alerta => {
                const navio = naviosMock.find(n => n.id === alerta.navioId);
                return (
                  <div 
                    key={alerta.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      alerta.severidade === 'crítica' ? 'bg-red-50 border-red-500' :
                      alerta.severidade === 'alta' ? 'bg-orange-50 border-orange-500' :
                      'bg-yellow-50 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <i className={`ri-alert-line text-2xl mt-0.5 ${
                          alerta.severidade === 'crítica' ? 'text-red-600' :
                          alerta.severidade === 'alta' ? 'text-orange-600' :
                          'text-yellow-600'
                        }`}></i>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-gray-900 mb-1">{alerta.tipo}</div>
                          <div className="text-sm text-gray-700 mb-2">{alerta.mensagem}</div>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span><i className="ri-ship-line mr-1"></i>{navio?.nome}</span>
                            <span><i className="ri-time-line mr-1"></i>{new Date(alerta.dataDeteccao).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                      <Badge cor={
                        alerta.severidade === 'crítica' ? 'bg-red-500' :
                        alerta.severidade === 'alta' ? 'bg-orange-500' :
                        'bg-yellow-500'
                      } className="text-xs">
                        {alerta.severidade.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap">
              <i className="ri-eye-line mr-2"></i>
              Ver Todos os Alertas
            </button>
          </Cartao>
        )}

        {/* Próximas Inspeções */}
        {(filtroTipo === 'todos' || filtroTipo === 'inspecoes') && (
          <Cartao>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Próximas Inspeções</h3>
              <Badge cor="bg-blue-500" className="text-sm">
                {proximasInspecoes.length} agendadas
              </Badge>
            </div>
            <div className="space-y-3">
              {proximasInspecoes.map(inspecao => (
                <div 
                  key={inspecao.id}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-200 hover:border-blue-300 transition-all"
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-xl">
                    <i className="ri-search-eye-line text-2xl text-blue-600"></i>
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900 mb-1">{inspecao.navio}</div>
                    <div className="text-sm text-gray-700 mb-2">{inspecao.tipo}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span><i className="ri-calendar-line mr-1"></i>{new Date(inspecao.data).toLocaleDateString('pt-BR')}</span>
                      <span><i className="ri-time-line mr-1"></i>Em {inspecao.dias} dias</span>
                    </div>
                  </div>

                  <div className="w-32">
                    <Badge cor={
                      inspecao.status === 'agendada' ? 'bg-blue-500' :
                      inspecao.status === 'pendente' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    } className="text-xs">
                      {inspecao.status.toUpperCase()}
                    </Badge>
                  </div>

                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
                    <i className="ri-calendar-check-line mr-2"></i>
                    Confirmar
                  </button>
                </div>
              ))}
            </div>
          </Cartao>
        )}

        {/* Próximas Limpezas */}
        {(filtroTipo === 'todos' || filtroTipo === 'limpezas') && (
          <Cartao>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Próximas Limpezas</h3>
              <Badge cor="bg-emerald-500" className="text-sm">
                {proximasLimpezas.length} programadas
              </Badge>
            </div>
            <div className="space-y-3">
              {proximasLimpezas.map(limpeza => (
                <div 
                  key={limpeza.id}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-white rounded-lg border border-emerald-200 hover:border-emerald-300 transition-all"
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-emerald-100 rounded-xl">
                    <i className="ri-brush-line text-2xl text-emerald-600"></i>
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900 mb-1">{limpeza.navio}</div>
                    <div className="text-sm text-gray-700 mb-2">{limpeza.tipo}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span><i className="ri-calendar-line mr-1"></i>{new Date(limpeza.data).toLocaleDateString('pt-BR')}</span>
                      <span><i className="ri-map-pin-line mr-1"></i>{limpeza.porto}</span>
                      <span><i className="ri-time-line mr-1"></i>Em {limpeza.dias} dias</span>
                    </div>
                  </div>

                  <div className="w-32">
                    <Badge cor={
                      limpeza.status === 'confirmada' ? 'bg-emerald-500' :
                      limpeza.status === 'agendada' ? 'bg-blue-500' :
                      'bg-gray-500'
                    } className="text-xs">
                      {limpeza.status.toUpperCase()}
                    </Badge>
                  </div>

                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors whitespace-nowrap">
                    <i className="ri-eye-line mr-2"></i>
                    Detalhes
                  </button>
                </div>
              ))}
            </div>
          </Cartao>
        )}

        {/* Perfis de Viagem e Clima */}
        {(filtroTipo === 'todos' || filtroTipo === 'viagens') && (
          <Cartao>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Perfis de Viagem e Condições Climáticas</h3>
              <Badge cor="bg-purple-500" className="text-sm">
                {perfisViagem.filter(v => v.status === 'em_transito').length} em trânsito
              </Badge>
            </div>
            <div className="space-y-4">
              {perfisViagem.map(viagem => (
                <div 
                  key={viagem.id}
                  className="p-4 bg-gradient-to-r from-purple-50 to-white rounded-lg border border-purple-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-lg">
                        <i className="ri-ship-2-line text-xl text-purple-600"></i>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{viagem.navio}</div>
                        <div className="text-xs text-gray-600">{viagem.origem} → {viagem.destino}</div>
                      </div>
                    </div>
                    <Badge cor={
                      viagem.status === 'em_transito' ? 'bg-blue-500' :
                      viagem.status === 'planejada' ? 'bg-gray-500' :
                      'bg-emerald-500'
                    } className="text-xs">
                      {viagem.status === 'em_transito' ? 'EM TRÂNSITO' :
                       viagem.status === 'planejada' ? 'PLANEJADA' :
                       'ATRACADO'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">Distância</div>
                      <div className="text-lg font-bold text-gray-900">{viagem.distancia} nm</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">Duração</div>
                      <div className="text-lg font-bold text-gray-900">{viagem.duracao}h</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                      <div className="flex items-center gap-2 mb-1">
                        <i className="ri-windy-line text-cyan-600"></i>
                        <div className="text-xs text-gray-600">Vento</div>
                      </div>
                      <div className="text-sm font-bold text-gray-900">{viagem.clima.vento} kt</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <i className="ri-water-flash-line text-blue-600"></i>
                        <div className="text-xs text-gray-600">Ondas</div>
                      </div>
                      <div className="text-sm font-bold text-gray-900">{viagem.clima.onda} m</div>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                      <div className="flex items-center gap-2 mb-1">
                        <i className="ri-arrow-right-line text-teal-600"></i>
                        <div className="text-xs text-gray-600">Corrente</div>
                      </div>
                      <div className="text-sm font-bold text-gray-900">{viagem.clima.corrente} kt</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-600">
                      <i className="ri-time-line mr-1"></i>
                      ETA: {new Date(viagem.eta).toLocaleString('pt-BR')}
                    </div>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors whitespace-nowrap">
                      <i className="ri-map-line mr-2"></i>
                      Ver no Mapa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Cartao>
        )}

        {/* Resumo Operacional */}
        <Cartao className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 flex items-center justify-center bg-cyan-600 rounded-xl">
              <i className="ri-dashboard-line text-3xl text-white"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Resumo Operacional</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 mb-2">✓ <span className="font-bold text-red-600">{alertasCriticos.length}</span> alertas críticos requerem atenção imediata</div>
                  <div className="text-gray-600 mb-2">✓ <span className="font-bold text-blue-600">{proximasInspecoes.filter(i => i.dias <= 7).length}</span> inspeções agendadas para os próximos 7 dias</div>
                  <div className="text-gray-600 mb-2">✓ <span className="font-bold text-emerald-600">{proximasLimpezas.filter(l => l.status === 'confirmada').length}</span> limpezas confirmadas</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-2">✓ <span className="font-bold text-purple-600">{perfisViagem.filter(v => v.status === 'em_transito').length}</span> navios navegando em condições monitoradas</div>
                  <div className="text-gray-600 mb-2">✓ Condições climáticas favoráveis em <span className="font-bold text-cyan-600">75%</span> das rotas</div>
                  <div className="text-gray-600 mb-2">✓ Taxa de conformidade operacional: <span className="font-bold text-emerald-600">94%</span></div>
                </div>
              </div>
            </div>
          </div>
        </Cartao>

      </div>
    </div>
  );
};

export default DashboardOperacional;
