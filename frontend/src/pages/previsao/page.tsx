import { useState, useEffect } from 'react';
import { fetchNavios } from '../../services/api';
import type { NavioAPI } from '../../services/api';
import { Cartao } from '../../components/atoms/Cartao';
import { Badge } from '../../components/atoms/Badge';

const PaginaPrevisao = () => {
  const [navios, setNavios] = useState<NavioAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodoSelecionado, setPeriodoSelecionado] = useState<'30d' | '60d' | '90d'>('90d');
  const [modalAprovacao, setModalAprovacao] = useState(false);
  const [modalAgendamento, setModalAgendamento] = useState(false);
  const [navioSelecionado, setNavioSelecionado] = useState<NavioAPI | null>(null);
  const [modalSucesso, setModalSucesso] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      const dados = await fetchNavios();
      // Ordenar por IBE mais alto primeiro (mais urgentes)
      const ordenados = dados.sort((a, b) => b.ibe - a.ibe);
      setNavios(ordenados);
      setLoading(false);
    };
    carregarDados();
  }, []);

  // Filtrar navios por previsão no período selecionado
  const getPrevisaoPeriodo = (navio: NavioAPI) => {
    if (periodoSelecionado === '30d') return navio.previsao30d;
    if (periodoSelecionado === '60d') return navio.previsao60d;
    return navio.previsao90d;
  };

  // Classificar risco baseado na previsão
  const classificarRisco = (previsao: number) => {
    if (previsao > 30) return { label: 'Crítico', cor: 'perigo' as const, bgCor: 'bg-red-500', borderCor: 'border-l-red-500' };
    if (previsao > 15) return { label: 'Alto', cor: 'aviso' as const, bgCor: 'bg-orange-500', borderCor: 'border-l-orange-500' };
    if (previsao > 5) return { label: 'Médio', cor: 'info' as const, bgCor: 'bg-yellow-500', borderCor: 'border-l-yellow-500' };
    return { label: 'Normal', cor: 'sucesso' as const, bgCor: 'bg-green-500', borderCor: 'border-l-green-500' };
  };

  // Agrupar navios por risco
  const naviosCriticos = navios.filter(n => getPrevisaoPeriodo(n) > 30);
  const naviosAlto = navios.filter(n => getPrevisaoPeriodo(n) > 15 && getPrevisaoPeriodo(n) <= 30);
  const naviosMedio = navios.filter(n => getPrevisaoPeriodo(n) > 5 && getPrevisaoPeriodo(n) <= 15);
  const naviosNormal = navios.filter(n => getPrevisaoPeriodo(n) <= 5);

  // Economia total dos críticos e altos
  const economiaUrgentes = [...naviosCriticos, ...naviosAlto].reduce((acc, n) => acc + n.economiaAnual, 0);

  const handleAprovar = (navio: NavioAPI) => {
    setNavioSelecionado(navio);
    setModalAprovacao(true);
  };

  const handleAgendar = (navio: NavioAPI) => {
    setNavioSelecionado(navio);
    setModalAgendamento(true);
  };

  const confirmarAprovacao = () => {
    setModalAprovacao(false);
    setMensagemSucesso('Recomendação aprovada com sucesso!');
    setModalSucesso(true);
    setTimeout(() => setModalSucesso(false), 3000);
  };

  const confirmarAgendamento = () => {
    setModalAgendamento(false);
    setMensagemSucesso('Manutenção agendada com sucesso!');
    setModalSucesso(true);
    setTimeout(() => setModalSucesso(false), 3000);
  };

  const formatarMoeda = (valor: number) => {
    if (valor >= 1000000) return `R$ ${(valor / 1000000).toFixed(1)}M`;
    if (valor >= 1000) return `R$ ${(valor / 1000).toFixed(0)}k`;
    return `R$ ${valor.toFixed(0)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-transpetro-green-600 animate-spin"></i>
          <p className="mt-2 text-gray-600">Carregando previsões...</p>
        </div>
      </div>
    );
  }

  const CardNavio = ({ navio }: { navio: NavioAPI }) => {
    const previsao = getPrevisaoPeriodo(navio);
    const risco = classificarRisco(previsao);

    return (
      <div className={`bg-white rounded-lg border-l-4 ${risco.borderCor} shadow-sm p-4 mb-3`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{navio.nome}</h3>
              <Badge variante={risco.cor} className="text-xs">
                {risco.label}
              </Badge>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {navio.classe} • {navio.diasDesdeUltimaLimpeza} dias desde última limpeza
            </div>
            <div className="grid grid-cols-4 gap-4 text-sm mb-2">
              <div>
                <span className="text-gray-500">IBE Atual:</span>
                <span className="ml-1 font-bold text-gray-900">{navio.ibe.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-gray-500">30 dias:</span>
                <span className="ml-1 font-medium text-gray-700">{navio.previsao30d?.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-gray-500">60 dias:</span>
                <span className="ml-1 font-medium text-gray-700">{navio.previsao60d?.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-gray-500">90 dias:</span>
                <span className="ml-1 font-medium text-gray-700">{navio.previsao90d?.toFixed(1)}%</span>
              </div>
            </div>
            <div className="text-sm">
              <span className="text-green-600 font-medium">
                <i className="ri-money-dollar-circle-line mr-1"></i>
                Economia potencial: {formatarMoeda(navio.economiaAnual)}/ano
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleAprovar(navio)}
              className="px-4 py-2 bg-transpetro-green-600 text-white rounded-lg text-sm font-medium hover:bg-transpetro-green-700 transition-colors"
            >
              <i className="ri-check-line mr-1"></i>
              Aprovar
            </button>
            <button
              onClick={() => handleAgendar(navio)}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <i className="ri-calendar-line mr-1"></i>
              Agendar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Previsão de Manutenção</h1>
            <p className="text-gray-600">Navios ordenados por risco de bioincrustação</p>
          </div>
          <button className="px-6 py-3 bg-transpetro-green-600 text-white rounded-lg font-medium hover:bg-transpetro-green-700 transition-colors">
            <i className="ri-download-line mr-2"></i>
            Exportar
          </button>
        </div>

        {/* Filtro de Período */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Período de Previsão:</span>
          <button
            onClick={() => setPeriodoSelecionado('30d')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              periodoSelecionado === '30d'
                ? 'bg-transpetro-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Próximos 30 dias
          </button>
          <button
            onClick={() => setPeriodoSelecionado('60d')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              periodoSelecionado === '60d'
                ? 'bg-transpetro-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Próximos 60 dias
          </button>
          <button
            onClick={() => setPeriodoSelecionado('90d')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              periodoSelecionado === '90d'
                ? 'bg-transpetro-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Próximos 90 dias
          </button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Cartao className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Crítico (&gt;30%)</div>
                <div className="text-3xl font-bold text-red-600">{naviosCriticos.length}</div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-lg">
                <i className="ri-alarm-warning-line text-xl text-red-600"></i>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Alto (15-30%)</div>
                <div className="text-3xl font-bold text-orange-600">{naviosAlto.length}</div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-lg">
                <i className="ri-error-warning-line text-xl text-orange-600"></i>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Médio (5-15%)</div>
                <div className="text-3xl font-bold text-yellow-600">{naviosMedio.length}</div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-lg">
                <i className="ri-eye-line text-xl text-yellow-600"></i>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Normal (&lt;5%)</div>
                <div className="text-3xl font-bold text-green-600">{naviosNormal.length}</div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-lg">
                <i className="ri-checkbox-circle-line text-xl text-green-600"></i>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Economia</div>
                <div className="text-2xl font-bold text-blue-600">{formatarMoeda(economiaUrgentes)}</div>
                <div className="text-xs text-gray-500">/ano (urgentes)</div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg">
                <i className="ri-money-dollar-circle-line text-xl text-blue-600"></i>
              </div>
            </div>
          </Cartao>
        </div>

        {/* Seção Crítico */}
        {naviosCriticos.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900">Crítico - IBE previsto &gt;30%</h2>
              <Badge variante="perigo" className="text-xs">{naviosCriticos.length} navios</Badge>
            </div>
            {naviosCriticos.map(navio => (
              <CardNavio key={navio.id} navio={navio} />
            ))}
          </div>
        )}

        {/* Seção Alto */}
        {naviosAlto.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900">Alto - IBE previsto 15-30%</h2>
              <Badge variante="aviso" className="text-xs">{naviosAlto.length} navios</Badge>
            </div>
            {naviosAlto.map(navio => (
              <CardNavio key={navio.id} navio={navio} />
            ))}
          </div>
        )}

        {/* Seção Médio */}
        {naviosMedio.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900">Médio - IBE previsto 5-15%</h2>
              <Badge variante="info" className="text-xs">{naviosMedio.length} navios</Badge>
            </div>
            {naviosMedio.map(navio => (
              <CardNavio key={navio.id} navio={navio} />
            ))}
          </div>
        )}

        {/* Seção Normal */}
        {naviosNormal.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900">Normal - IBE previsto &lt;5%</h2>
              <Badge variante="sucesso" className="text-xs">{naviosNormal.length} navios</Badge>
            </div>
            {naviosNormal.map(navio => (
              <CardNavio key={navio.id} navio={navio} />
            ))}
          </div>
        )}

        {/* Modal de Aprovação */}
        {modalAprovacao && navioSelecionado && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <Cartao className="max-w-lg w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Aprovar Recomendação</h2>
                <button onClick={() => setModalAprovacao(false)} className="text-gray-500 hover:text-gray-700">
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-semibold text-gray-900 mb-2">{navioSelecionado.nome}</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">IBE Atual:</span>
                      <span className="ml-2 font-medium text-gray-900">{navioSelecionado.ibe.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Previsão 90d:</span>
                      <span className="ml-2 font-medium text-gray-900">{navioSelecionado.previsao90d?.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Economia:</span>
                      <span className="ml-2 font-medium text-green-600">{formatarMoeda(navioSelecionado.economiaAnual)}/ano</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Dias s/ limpeza:</span>
                      <span className="ml-2 font-medium text-gray-900">{navioSelecionado.diasDesdeUltimaLimpeza}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                    Notificar equipe de manutenção
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                    Criar tarefa no sistema
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="w-4 h-4 rounded" />
                    Notificar comandante do navio
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={confirmarAprovacao}
                  className="flex-1 px-6 py-3 bg-transpetro-green-600 text-white rounded-lg font-medium hover:bg-transpetro-green-700"
                >
                  <i className="ri-check-line mr-2"></i>
                  Confirmar Aprovação
                </button>
                <button
                  onClick={() => setModalAprovacao(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </Cartao>
          </div>
        )}

        {/* Modal de Agendamento */}
        {modalAgendamento && navioSelecionado && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <Cartao className="max-w-lg w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Agendar Manutenção</h2>
                <button onClick={() => setModalAgendamento(false)} className="text-gray-500 hover:text-gray-700">
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-semibold text-gray-900">{navioSelecionado.nome}</div>
                  <div className="text-sm text-gray-600">{navioSelecionado.classe} • IBE {navioSelecionado.ibe.toFixed(1)}%</div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Data da Manutenção</label>
                  <input
                    type="date"
                    className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg border border-gray-300 focus:border-transpetro-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Local/Porto</label>
                  <select className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg border border-gray-300 focus:border-transpetro-green-500 focus:outline-none">
                    <option value="">Selecione o porto</option>
                    <option value="santos">Porto de Santos, SP</option>
                    <option value="rio">Porto do Rio de Janeiro, RJ</option>
                    <option value="paranagua">Porto de Paranaguá, PR</option>
                    <option value="vitoria">Porto de Vitória, ES</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Observações</label>
                  <textarea
                    rows={3}
                    placeholder="Observações adicionais..."
                    className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg border border-gray-300 focus:border-transpetro-green-500 focus:outline-none resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={confirmarAgendamento}
                  className="flex-1 px-6 py-3 bg-transpetro-green-600 text-white rounded-lg font-medium hover:bg-transpetro-green-700"
                >
                  <i className="ri-calendar-check-line mr-2"></i>
                  Confirmar Agendamento
                </button>
                <button
                  onClick={() => setModalAgendamento(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </Cartao>
          </div>
        )}

        {/* Modal de Sucesso */}
        {modalSucesso && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <Cartao className="max-w-sm w-full">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-check-line text-3xl text-green-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{mensagemSucesso}</h3>
                <p className="text-sm text-gray-600">As notificações foram enviadas.</p>
              </div>
            </Cartao>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaginaPrevisao;
