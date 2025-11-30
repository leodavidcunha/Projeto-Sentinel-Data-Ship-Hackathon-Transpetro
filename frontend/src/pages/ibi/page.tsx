import { useState, useEffect } from 'react';
import { fetchNavios } from '../../services/api';
import type { NavioAPI } from '../../services/api';
import { Cartao } from '../../components/atoms/Cartao';
import { Badge } from '../../components/atoms/Badge';
import { useSEO, generateWebPageSchema } from '../../utils/seo';

const PaginaIBE = () => {
  const [navios, setNavios] = useState<NavioAPI[]>([]);
  const [navioSelecionado, setNavioSelecionado] = useState<NavioAPI | null>(null);
  const [loading, setLoading] = useState(true);

  // SEO
  useSEO({
    title: 'Índice de Bioincrustação Estimado (IBE) - Sentinel Data Ship',
    description: 'Monitoramento e análise do índice de bioincrustação estimado da frota, com previsões para otimização de docagem',
    keywords: 'IBE, bioincrustação, índice, casco, desempenho, análise, fouling',
    schema: generateWebPageSchema(
      'Índice de Bioincrustação Estimado (IBE) - Sentinel Data Ship',
      'Monitoramento e análise do índice de bioincrustação estimado da frota',
      '/ibi'
    )
  });

  // Carregar dados da API
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      const dados = await fetchNavios();
      setNavios(dados);
      if (dados.length > 0) {
        // Selecionar o navio com maior IBE por padrão
        const navioMaiorIBE = dados.reduce((max, n) => n.ibe > max.ibe ? n : max, dados[0]);
        setNavioSelecionado(navioMaiorIBE);
      }
      setLoading(false);
    };
    carregarDados();
  }, []);

  // Classificação baseada nos limites reais do sistema
  const classificarIBE = (ibe: number) => {
    if (ibe > 30) return { label: 'Crítico', variante: 'perigo' as const, cor: 'bg-red-500', texto: 'text-red-600' };
    if (ibe > 15) return { label: 'Alerta', variante: 'aviso' as const, cor: 'bg-orange-500', texto: 'text-orange-600' };
    if (ibe > 5) return { label: 'Atenção', variante: 'info' as const, cor: 'bg-yellow-500', texto: 'text-yellow-600' };
    return { label: 'Normal', variante: 'sucesso' as const, cor: 'bg-green-500', texto: 'text-green-600' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-transpetro-green-600 animate-spin"></i>
          <p className="mt-2 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!navioSelecionado) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-ship-line text-4xl text-gray-400"></i>
          <p className="mt-2 text-gray-600">Nenhum navio encontrado</p>
        </div>
      </div>
    );
  }

  const classificacao = classificarIBE(navioSelecionado.ibe);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Índice de Bioincrustação Estimado (IBE)</h1>
            <p className="text-gray-600">Monitoramento e análise do desempenho do casco</p>
          </div>
          <button className="px-6 py-3 bg-transpetro-green-600 text-white rounded-lg font-medium hover:bg-transpetro-green-700 transition-colors whitespace-nowrap">
            <i className="ri-download-line mr-2"></i>
            Exportar Dados
          </button>
        </div>

        {/* Seletor de Navio */}
        <Cartao>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="text-sm font-medium text-gray-700">Selecionar Navio:</label>
            <select
              value={navioSelecionado.id}
              onChange={(e) => {
                const navio = navios.find(n => n.id === e.target.value);
                if (navio) setNavioSelecionado(navio);
              }}
              className="bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 focus:border-transpetro-green-500 focus:outline-none"
            >
              {navios.map(navio => (
                <option key={navio.id} value={navio.id}>{navio.nome}</option>
              ))}
            </select>
          </div>
        </Cartao>

        {/* IBE Atual - Grande Destaque */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Medidor Principal */}
          <Cartao className="lg:col-span-2">
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-600 mb-2">IBE Atual</div>
                <div className={`text-8xl font-bold ${classificacao.texto} mb-4`}>
                  {navioSelecionado.ibe.toFixed(1)}%
                </div>
                <Badge variante={classificacao.variante} className="text-lg px-6 py-2">
                  {classificacao.label}
                </Badge>
              </div>

              {/* Barra Visual */}
              <div className="max-w-2xl mx-auto">
                <div className="h-8 bg-gray-200 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full ${classificacao.cor} transition-all duration-1000 ease-out`}
                    style={{ width: `${Math.min(navioSelecionado.ibe, 100)}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-medium text-gray-700">
                    <span>0%</span>
                    <span>5%</span>
                    <span>15%</span>
                    <span>30%</span>
                    <span>50%+</span>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Normal</span>
                  <span>Atenção</span>
                  <span>Alerta</span>
                  <span>Crítico</span>
                  <span></span>
                </div>
              </div>

              {/* Fórmula IBE Real */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-700 mb-2 font-medium">Como o IBE é calculado</div>
                <div className="font-mono text-blue-800 text-sm mb-2">
                  IBE (%) = ((Consumo_Atual - Baseline) / Baseline) × 100
                </div>
                <div className="text-xs text-blue-600">
                  <strong>Baseline:</strong> Mediana do consumo nos primeiros 6 meses após docagem (casco limpo)<br/>
                  <strong>Atual:</strong> Mediana do consumo nos últimos 3 meses
                </div>
              </div>
            </div>
          </Cartao>

          {/* Métricas do Navio */}
          <Cartao>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Métricas do Navio</h3>
            <div className="space-y-4">

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Consumo Extra</span>
                  <span className="text-red-600 font-medium">+{navioSelecionado.deltaFuelNm.toFixed(2)} t/dia</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${Math.min((navioSelecionado.deltaFuelNm / 20) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">CO2 Extra/Ano</span>
                  <span className="text-orange-600 font-medium">+{navioSelecionado.emissoesCO2Perdidas.toFixed(0)} t</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500"
                    style={{ width: `${Math.min((navioSelecionado.emissoesCO2Perdidas / 25000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Dias desde Docagem</span>
                  <span className="text-gray-800 font-medium">{navioSelecionado.diasDesdeUltimaLimpeza} dias</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: `${Math.min((navioSelecionado.diasDesdeUltimaLimpeza / 720) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Risco NORMAM-401</span>
                  <Badge variante={
                    navioSelecionado.riscoNormam401 === 'Critico' ? 'perigo' :
                    navioSelecionado.riscoNormam401 === 'Alto' ? 'aviso' :
                    navioSelecionado.riscoNormam401 === 'Medio' ? 'info' : 'sucesso'
                  } className="text-xs">
                    {navioSelecionado.riscoNormam401}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="text-sm text-gray-800">{navioSelecionado.statusOperacional}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Viagens Analisadas</span>
                  <span className="text-sm text-gray-800">{navioSelecionado.viagensAnalisadas}</span>
                </div>
              </div>

            </div>
          </Cartao>
        </div>

        {/* Previsão IBE */}
        <Cartao>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Previsão de IBE</h3>
            <div className="space-y-4">
              {[
                { label: '30 dias', valor: navioSelecionado.previsao30d },
                { label: '60 dias', valor: navioSelecionado.previsao60d },
                { label: '90 dias', valor: navioSelecionado.previsao90d }
              ].map((item, idx) => {
                const classif = classificarIBE(item.valor);
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-gray-600 font-medium">{item.label}</div>
                    <div className="flex-1">
                      <div className="h-12 bg-gray-200 rounded-lg overflow-hidden relative border-2 border-dashed border-gray-300">
                        <div
                          className={`h-full ${classif.cor} opacity-70 transition-all duration-500`}
                          style={{ width: `${Math.min(item.valor, 100)}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center px-4">
                          <span className="text-gray-800 font-bold text-lg">{item.valor.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-24">
                      <Badge variante={classif.variante} className="text-xs">{classif.label}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Alerta se previsão for crítica */}
            {navioSelecionado.previsao90d > 30 && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <i className="ri-alert-line text-red-600 text-xl mt-0.5"></i>
                  <div>
                    <div className="text-sm font-medium text-red-700 mb-1">Alerta de Tendência Crítica</div>
                    <div className="text-sm text-gray-700">
                      Projeção indica IBE crítico (&gt;30%) em 90 dias. {navioSelecionado.recomendacao}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {navioSelecionado.previsao90d <= 30 && navioSelecionado.previsao90d > 15 && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <i className="ri-information-line text-amber-600 text-xl mt-0.5"></i>
                  <div>
                    <div className="text-sm font-medium text-amber-700 mb-1">Atenção</div>
                    <div className="text-sm text-gray-700">
                      IBE em tendência de alerta. {navioSelecionado.recomendacao}
                    </div>
                  </div>
                </div>
              </div>
            )}
        </Cartao>

        {/* Ranking da Frota */}
        <Cartao>
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Ranking IBE da Frota</h3>
          <div className="space-y-2">
            {navios
              .slice()
              .sort((a, b) => b.ibe - a.ibe)
              .slice(0, 10)
              .map((navio, idx) => {
                const classif = classificarIBE(navio.ibe);
                return (
                  <div
                    key={navio.id}
                    className={`flex items-center gap-4 p-3 rounded-lg transition-all cursor-pointer ${
                      navio.id === navioSelecionado.id
                        ? 'bg-transpetro-green-50 border border-transpetro-green-200'
                        : 'bg-white hover:bg-gray-50 border border-gray-200'
                    }`}
                    onClick={() => setNavioSelecionado(navio)}
                  >
                    <div className="w-8 text-center">
                      <span className="text-gray-600 font-medium">#{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{navio.nome}</div>
                      <div className="text-xs text-gray-500">{navio.classe}</div>
                    </div>
                    <div className="w-24 text-right">
                      <div className={`text-2xl font-bold ${classif.texto}`}>{navio.ibe.toFixed(1)}%</div>
                    </div>
                    <div className="w-24">
                      <Badge variante={classif.variante} className="text-xs">{classif.label}</Badge>
                    </div>
                  </div>
                );
              })}
          </div>
        </Cartao>

      </div>
    </div>
  );
};

export default PaginaIBE;
