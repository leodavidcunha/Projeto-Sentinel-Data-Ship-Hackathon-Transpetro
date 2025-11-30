import { useState } from 'react';
import { naviosMock } from '../../mocks/navios';
import { Cartao } from '../../components/atoms/Cartao';
import { Badge } from '../../components/atoms/Badge';

const DashboardExecutivo = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState<'mes' | 'trimestre' | 'ano'>('mes');

  // Cálculos de economia
  const economiaTotal = naviosMock.reduce((acc, navio) => {
    const economiaMensal = (navio.deltaFuelNm * 1000 * 3.5); // R$ 3.500/ton
    return acc + economiaMensal;
  }, 0);

  const reducaoCO2Total = naviosMock.reduce((acc, navio) => acc + navio.emissoesFouling, 0);
  
  // Hull Efficiency Score médio da frota
  const hullEfficiencyScore = Math.round(
    naviosMock.reduce((acc, navio) => {
      const score = 100 - (navio.ibi * 0.8) - (navio.diasDesdeUltimaLimpeza / 180 * 20);
      return acc + Math.max(0, score);
    }, 0) / naviosMock.length
  );

  const economiaAnual = economiaTotal * 12;
  const reducaoCO2Anual = reducaoCO2Total * 12;

  // Comparativo entre embarcações
  const naviosComScore = naviosMock.map(navio => {
    const score = 100 - (navio.ibi * 0.8) - (navio.diasDesdeUltimaLimpeza / 180 * 20);
    const economiaMensal = navio.deltaFuelNm * 1000 * 3.5;
    return {
      ...navio,
      hullScore: Math.max(0, Math.round(score)),
      economiaMensal
    };
  }).sort((a, b) => b.hullScore - a.hullScore);

  const dadosEvolucao = [
    { mes: 'Ago/24', economia: 2.8, co2: 4200, score: 62 },
    { mes: 'Set/24', economia: 3.2, co2: 4850, score: 65 },
    { mes: 'Out/24', economia: 3.9, co2: 5420, score: 68 },
    { mes: 'Nov/24', economia: 4.5, co2: 6180, score: 71 },
    { mes: 'Dez/24', economia: 5.1, co2: 6890, score: 74 },
    { mes: 'Jan/25', economia: 5.8, co2: 7520, score: 78 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Executivo</h1>
              <p className="text-gray-600">Visão estratégica de economia e eficiência da frota</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
            <i className="ri-download-line mr-2"></i>
            Exportar Relatório
          </button>
        </div>

        {/* Métricas Principais - KPIs Executivos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Cartao className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-emerald-100 text-sm mb-1">Economia em Combustível</div>
                <div className="text-4xl font-bold mb-1">{(economiaTotal / 1000000).toFixed(1)}M</div>
                <div className="text-emerald-100 text-xs">R$ / mês</div>
              </div>
              <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-xl">
                <i className="ri-gas-station-line text-3xl"></i>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-emerald-400/30">
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-100">Anual:</span>
                <span className="font-bold">R$ {(economiaAnual / 1000000).toFixed(1)}M</span>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-100 text-sm mb-1">Economia Total</div>
                <div className="text-4xl font-bold mb-1">{(economiaTotal / 1000000).toFixed(1)}M</div>
                <div className="text-blue-100 text-xs">R$ / mês</div>
              </div>
              <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-xl">
                <i className="ri-money-dollar-circle-line text-3xl"></i>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-400/30">
              <div className="flex items-center gap-2 text-sm">
                <i className="ri-arrow-up-line"></i>
                <span>+18.5% vs mês anterior</span>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-cyan-100 text-sm mb-1">Redução de CO₂</div>
                <div className="text-4xl font-bold mb-1">{(reducaoCO2Total / 1000).toFixed(1)}k</div>
                <div className="text-cyan-100 text-xs">toneladas / mês</div>
              </div>
              <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-xl">
                <i className="ri-leaf-line text-3xl"></i>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-cyan-400/30">
              <div className="flex items-center justify-between text-sm">
                <span className="text-cyan-100">Anual:</span>
                <span className="font-bold">{(reducaoCO2Anual / 1000).toFixed(1)}k ton</span>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-purple-100 text-sm mb-1">Hull Efficiency Score</div>
                <div className="text-4xl font-bold mb-1">{hullEfficiencyScore}</div>
                <div className="text-purple-100 text-xs">média da frota</div>
              </div>
              <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-xl">
                <i className="ri-ship-2-line text-3xl"></i>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-purple-400/30">
              <div className="flex items-center gap-2 text-sm">
                <i className="ri-arrow-up-line"></i>
                <span>+6 pontos vs mês anterior</span>
              </div>
            </div>
          </Cartao>
        </div>

        {/* Filtro de Período */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Período:</span>
          {(['mes', 'trimestre', 'ano'] as const).map(periodo => (
            <button
              key={periodo}
              onClick={() => setPeriodoSelecionado(periodo)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                periodoSelecionado === periodo 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {periodo === 'mes' ? 'Mês' : periodo === 'trimestre' ? 'Trimestre' : 'Ano'}
            </button>
          ))}
        </div>

        {/* Evolução Temporal */}
        <Cartao>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Evolução de Indicadores</h3>
          <div className="grid grid-cols-3 gap-6">
            
            {/* Economia */}
            <div>
              <div className="text-sm font-medium text-gray-600 mb-4">Economia (R$ Milhões)</div>
              <div className="space-y-2">
                {dadosEvolucao.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-16 text-xs text-gray-600">{item.mes}</div>
                    <div className="flex-1">
                      <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                          style={{ width: `${(item.economia / 6) * 100}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center px-3">
                          <span className="text-xs font-medium text-gray-900">{item.economia}M</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CO₂ */}
            <div>
              <div className="text-sm font-medium text-gray-600 mb-4">Redução CO₂ (toneladas)</div>
              <div className="space-y-2">
                {dadosEvolucao.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-16 text-xs text-gray-600">{item.mes}</div>
                    <div className="flex-1">
                      <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 transition-all duration-500"
                          style={{ width: `${(item.co2 / 8000) * 100}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center px-3">
                          <span className="text-xs font-medium text-gray-900">{(item.co2 / 1000).toFixed(1)}k</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hull Score */}
            <div>
              <div className="text-sm font-medium text-gray-600 mb-4">Hull Efficiency Score</div>
              <div className="space-y-2">
                {dadosEvolucao.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-16 text-xs text-gray-600">{item.mes}</div>
                    <div className="flex-1">
                      <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                          style={{ width: `${item.score}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center px-3">
                          <span className="text-xs font-medium text-gray-900">{item.score}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Cartao>

        {/* Comparativo entre Embarcações */}
        <Cartao>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Ranking de Eficiência da Frota</h3>
          <div className="space-y-3">
            {naviosComScore.slice(0, 10).map((navio, idx) => (
              <div 
                key={navio.id}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
              >
                <div className="w-12 text-center">
                  <div className={`text-2xl font-bold ${
                    idx === 0 ? 'text-yellow-500' :
                    idx === 1 ? 'text-gray-400' :
                    idx === 2 ? 'text-orange-600' :
                    'text-gray-600'
                  }`}>
                    {idx === 0 && <i className="ri-trophy-line"></i>}
                    {idx === 1 && <i className="ri-medal-line"></i>}
                    {idx === 2 && <i className="ri-medal-line"></i>}
                    {idx > 2 && `#${idx + 1}`}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-900">{navio.nome}</div>
                  <div className="text-xs text-gray-600">{navio.classe}</div>
                </div>

                <div className="w-32">
                  <div className="text-xs text-gray-600 mb-1">Hull Score</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          navio.hullScore >= 80 ? 'bg-emerald-500' :
                          navio.hullScore >= 60 ? 'bg-blue-500' :
                          navio.hullScore >= 40 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${navio.hullScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-8">{navio.hullScore}</span>
                  </div>
                </div>

                <div className="w-32 text-right">
                  <div className="text-xs text-gray-600">Economia/mês</div>
                  <div className="text-sm font-bold text-emerald-600">
                    R$ {(navio.economiaMensal / 1000).toFixed(0)}k
                  </div>
                </div>

                <div className="w-32 text-right">
                  <div className="text-xs text-gray-600">IBI Atual</div>
                  <div className="text-sm font-bold text-gray-900">{navio.ibi}</div>
                </div>

                <div className="w-32">
                  <Badge cor={
                    navio.hullScore >= 80 ? 'bg-emerald-500' :
                    navio.hullScore >= 60 ? 'bg-blue-500' :
                    navio.hullScore >= 40 ? 'bg-yellow-500' :
                    'bg-red-500'
                  } className="text-xs">
                    {navio.hullScore >= 80 ? 'EXCELENTE' :
                     navio.hullScore >= 60 ? 'BOM' :
                     navio.hullScore >= 40 ? 'REGULAR' :
                     'CRÍTICO'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Cartao>

        {/* Resumo Executivo */}
        <Cartao className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 flex items-center justify-center bg-blue-600 rounded-xl">
              <i className="ri-lightbulb-line text-3xl text-white"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Resumo Executivo</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 mb-2">✓ Economia mensal de <span className="font-bold text-emerald-600">R$ {(economiaTotal / 1000000).toFixed(1)}M</span> em combustível</div>
                  <div className="text-gray-600 mb-2">✓ Redução de <span className="font-bold text-cyan-600">{(reducaoCO2Total / 1000).toFixed(1)}k toneladas</span> de CO₂ por mês</div>
                  <div className="text-gray-600 mb-2">✓ Hull Efficiency Score médio de <span className="font-bold text-purple-600">{hullEfficiencyScore}</span> pontos</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-2">✓ <span className="font-bold text-blue-600">{naviosComScore.filter(n => n.hullScore >= 80).length}</span> navios com eficiência excelente</div>
                  <div className="text-gray-600 mb-2">✓ <span className="font-bold text-yellow-600">{naviosComScore.filter(n => n.hullScore < 60).length}</span> navios necessitam atenção</div>
                  <div className="text-gray-600 mb-2">✓ Potencial de economia anual: <span className="font-bold text-emerald-600">R$ {(economiaAnual / 1000000).toFixed(1)}M</span></div>
                </div>
              </div>
            </div>
          </div>
        </Cartao>

      </div>
    </div>
  );
};

export default DashboardExecutivo;
