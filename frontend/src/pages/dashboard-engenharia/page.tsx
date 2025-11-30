import { useState } from 'react';
import { naviosMock } from '../../mocks/navios';
import { Cartao } from '../../components/atoms/Cartao';
import { Badge } from '../../components/atoms/Badge';

const DashboardEngenharia = () => {
  const [navioSelecionado, setNavioSelecionado] = useState(naviosMock[0]);

  // Dados de Speed-Power Curve
  const speedPowerData = [
    { velocidade: 10, potenciaIdeal: 3200, potenciaReal: 3250, addedResistance: 1.6 },
    { velocidade: 11, potenciaIdeal: 4100, potenciaReal: 4380, addedResistance: 6.8 },
    { velocidade: 12, potenciaIdeal: 5200, potenciaReal: 5850, addedResistance: 12.5 },
    { velocidade: 13, potenciaIdeal: 6500, potenciaReal: 7580, addedResistance: 16.6 },
    { velocidade: 14, potenciaIdeal: 8100, potenciaReal: 9850, addedResistance: 21.6 },
    { velocidade: 15, potenciaIdeal: 10000, potenciaReal: 12800, addedResistance: 28.0 },
    { velocidade: 16, potenciaIdeal: 12200, potenciaReal: 16200, addedResistance: 32.8 }
  ];

  // Incrementos pós limpeza
  const incrementosLimpeza = [
    { data: '2024-08-15', tipo: 'Limpeza ROV', velocidadeAntes: 13.2, velocidadeDepois: 14.8, ganho: 12.1, consumoAntes: 42.5, consumoDepois: 38.2 },
    { data: '2024-05-20', tipo: 'Docagem', velocidadeAntes: 12.8, velocidadeDepois: 15.2, ganho: 18.8, consumoAntes: 44.8, consumoDepois: 36.5 },
    { data: '2024-02-10', tipo: 'Limpeza In-Water', velocidadeAntes: 13.5, velocidadeDepois: 14.2, ganho: 5.2, consumoAntes: 41.2, consumoDepois: 39.8 }
  ];

  // Degradação das tintas
  const degradacaoTinta = [
    { mes: 0, eficiencia: 100, tipo: 'Aplicação' },
    { mes: 6, eficiencia: 92, tipo: null },
    { mes: 12, eficiencia: 85, tipo: null },
    { mes: 18, eficiencia: 76, tipo: null },
    { mes: 24, eficiencia: 68, tipo: null },
    { mes: 30, eficiencia: 58, tipo: null },
    { mes: 36, eficiencia: 48, tipo: 'Fim de Vida' }
  ];

  const addedResistanceAtual = 28.5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Engenharia</h1>
              <p className="text-gray-600">Análise técnica de desempenho e resistência do casco</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap cursor-pointer">
            <i className="ri-download-line mr-2"></i>
            Exportar Análise
          </button>
        </div>

        {/* Seletor de Navio */}
        <Cartao>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Navio em Análise:</label>
            <select 
              value={navioSelecionado.id}
              onChange={(e) => {
                const navio = naviosMock.find(n => n.id === e.target.value);
                if (navio) setNavioSelecionado(navio);
              }}
              className="bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none"
            >
              {naviosMock.map(navio => (
                <option key={navio.id} value={navio.id}>{navio.nome} - {navio.classe}</option>
              ))}
            </select>
            <div className="ml-auto flex gap-4">
              <div className="text-right">
                <div className="text-xs text-gray-600">IBI Atual</div>
                <div className="text-lg font-bold text-gray-900">{navioSelecionado.ibi}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600">Dias desde Limpeza</div>
                <div className="text-lg font-bold text-gray-900">{navioSelecionado.diasDesdeUltimaLimpeza}</div>
              </div>
            </div>
          </div>
        </Cartao>

        {/* Métricas Técnicas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Cartao className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-red-100 text-sm mb-1">Added Resistance</div>
                <div className="text-4xl font-bold mb-1">{addedResistanceAtual}%</div>
                <div className="text-red-100 text-xs">vs ideal</div>
              </div>
              <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-xl">
                <i className="ri-speed-line text-3xl"></i>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-red-400/30">
              <div className="flex items-center gap-2 text-sm">
                <i className="ri-arrow-up-line"></i>
                <span>+3.2% vs mês anterior</span>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-orange-100 text-sm mb-1">Delta Consumo</div>
                <div className="text-4xl font-bold mb-1">+{navioSelecionado.deltaFuelNm.toFixed(1)}</div>
                <div className="text-orange-100 text-xs">t/nm</div>
              </div>
              <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-xl">
                <i className="ri-gas-station-line text-3xl"></i>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-orange-400/30">
              <div className="text-sm">
                <span className="text-orange-100">Extra: </span>
                <span className="font-bold">+{(navioSelecionado.deltaFuelNm * 1000).toFixed(0)} kg/nm</span>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-100 text-sm mb-1">Velocidade Média</div>
                <div className="text-4xl font-bold mb-1">{navioSelecionado.velocidadeMedia.toFixed(1)}</div>
                <div className="text-blue-100 text-xs">knots</div>
              </div>
              <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-xl">
                <i className="ri-ship-line text-3xl"></i>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-400/30">
              <div className="text-sm">
                <span className="text-blue-100">Ideal: </span>
                <span className="font-bold">15.2 knots</span>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-purple-100 text-sm mb-1">Eficiência Tinta</div>
                <div className="text-4xl font-bold mb-1">68%</div>
                <div className="text-purple-100 text-xs">capacidade atual</div>
              </div>
              <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-xl">
                <i className="ri-paint-brush-line text-3xl"></i>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-purple-400/30">
              <div className="text-sm">
                <span className="text-purple-100">Aplicada há: </span>
                <span className="font-bold">24 meses</span>
              </div>
            </div>
          </Cartao>
        </div>

        {/* Curvas Speed-Power Real vs Teórica */}
        <Cartao>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Curva Speed-Power: Real vs Teórica</h3>
          <div className="space-y-3">
            {speedPowerData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-24">
                  <div className="text-sm font-medium text-gray-900">{item.velocidade} knots</div>
                </div>
                <div className="flex-1">
                  <div className="relative h-12">
                    {/* Barra Ideal */}
                    <div className="absolute top-0 left-0 right-0 h-5">
                      <div className="h-full bg-gray-100 rounded-lg overflow-hidden relative">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${(item.potenciaIdeal / 16200) * 100}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center px-3">
                          <span className="text-xs font-medium text-gray-900">{item.potenciaIdeal} kW (Ideal)</span>
                        </div>
                      </div>
                    </div>
                    {/* Barra Real */}
                    <div className="absolute bottom-0 left-0 right-0 h-5">
                      <div className="h-full bg-gray-100 rounded-lg overflow-hidden relative">
                        <div 
                          className="h-full bg-red-500 transition-all duration-500"
                          style={{ width: `${(item.potenciaReal / 16200) * 100}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center px-3">
                          <span className="text-xs font-medium text-gray-900">{item.potenciaReal} kW (Real)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-32 text-right">
                  <Badge cor="bg-red-500" className="text-xs">
                    +{item.addedResistance}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <div className="flex items-start gap-3">
              <i className="ri-information-line text-indigo-600 text-xl mt-0.5"></i>
              <div className="text-sm text-gray-700">
                <span className="font-medium">Análise:</span> O Added Resistance aumenta significativamente em velocidades mais altas. 
                A diferença entre potência real e ideal indica acúmulo de bioincrustação no casco, resultando em maior consumo de combustível.
              </div>
            </div>
          </div>
        </Cartao>

        {/* Incrementos Pós Limpeza */}
        <Cartao>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Incrementos de Performance Pós-Limpeza</h3>
          <div className="space-y-4">
            {incrementosLimpeza.map((item, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-bold text-gray-900">{item.tipo}</div>
                    <div className="text-xs text-gray-600">{new Date(item.data).toLocaleDateString('pt-BR')}</div>
                  </div>
                  <Badge cor="bg-emerald-500" className="text-sm">
                    <i className="ri-arrow-up-line mr-1"></i>
                    +{item.ganho}% ganho
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {/* Velocidade */}
                  <div>
                    <div className="text-xs text-gray-600 mb-2">Velocidade (knots)</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-16">Antes:</span>
                        <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden relative">
                          <div 
                            className="h-full bg-red-400"
                            style={{ width: `${(item.velocidadeAntes / 16) * 100}%` }}
                          ></div>
                          <div className="absolute inset-0 flex items-center px-2">
                            <span className="text-xs font-medium text-gray-900">{item.velocidadeAntes}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-16">Depois:</span>
                        <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden relative">
                          <div 
                            className="h-full bg-emerald-500"
                            style={{ width: `${(item.velocidadeDepois / 16) * 100}%` }}
                          ></div>
                          <div className="absolute inset-0 flex items-center px-2">
                            <span className="text-xs font-medium text-gray-900">{item.velocidadeDepois}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Consumo */}
                  <div>
                    <div className="text-xs text-gray-600 mb-2">Consumo (t/dia)</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-16">Antes:</span>
                        <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden relative">
                          <div 
                            className="h-full bg-red-400"
                            style={{ width: `${(item.consumoAntes / 50) * 100}%` }}
                          ></div>
                          <div className="absolute inset-0 flex items-center px-2">
                            <span className="text-xs font-medium text-gray-900">{item.consumoAntes}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-16">Depois:</span>
                        <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden relative">
                          <div 
                            className="h-full bg-emerald-500"
                            style={{ width: `${(item.consumoDepois / 50) * 100}%` }}
                          ></div>
                          <div className="absolute inset-0 flex items-center px-2">
                            <span className="text-xs font-medium text-gray-900">{item.consumoDepois}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Cartao>

        {/* Degradação das Tintas */}
        <Cartao>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Degradação da Tinta Antifouling</h3>
          <div className="space-y-3">
            {degradacaoTinta.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-24">
                  <div className="text-sm font-medium text-gray-900">{item.mes} meses</div>
                  {item.tipo && (
                    <div className="text-xs text-gray-600">{item.tipo}</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="h-10 bg-gray-100 rounded-lg overflow-hidden relative">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        item.eficiencia >= 85 ? 'bg-emerald-500' :
                        item.eficiencia >= 70 ? 'bg-blue-500' :
                        item.eficiencia >= 55 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${item.eficiencia}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center px-4">
                      <span className="text-sm font-medium text-gray-900">{item.eficiencia}% eficiência</span>
                    </div>
                  </div>
                </div>
                <div className="w-32">
                  {item.eficiencia < 60 && (
                    <Badge cor="bg-red-500" className="text-xs">
                      <i className="ri-alert-line mr-1"></i>
                      CRÍTICO
                    </Badge>
                  )}
                  {item.eficiencia >= 60 && item.eficiencia < 75 && (
                    <Badge cor="bg-yellow-500" className="text-xs">
                      ATENÇÃO
                    </Badge>
                  )}
                  {item.eficiencia >= 75 && (
                    <Badge cor="bg-emerald-500" className="text-xs">
                      NORMAL
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-xs text-gray-600 mb-1">Tinta Aplicada</div>
              <div className="text-lg font-bold text-gray-900">Jotun SeaQuantum X200</div>
              <div className="text-xs text-gray-600 mt-1">Aplicação: 15/01/2023</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-xs text-gray-600 mb-1">Vida Útil Esperada</div>
              <div className="text-lg font-bold text-gray-900">60 meses</div>
              <div className="text-xs text-gray-600 mt-1">Restante: 36 meses</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-xs text-gray-600 mb-1">Próxima Docagem</div>
              <div className="text-lg font-bold text-gray-900">Jan/2028</div>
              <div className="text-xs text-gray-600 mt-1">Reaplicação necessária</div>
            </div>
          </div>
        </Cartao>

        {/* Análise Técnica */}
        <Cartao className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 flex items-center justify-center bg-indigo-600 rounded-xl">
              <i className="ri-flask-line text-3xl text-white"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Análise Técnica</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div>✓ Added Resistance de <span className="font-bold text-red-600">28.5%</span> indica acúmulo significativo de bioincrustação</div>
                <div>✓ Curva Speed-Power mostra desvio crescente em velocidades acima de 13 knots</div>
                <div>✓ Última limpeza resultou em ganho de <span className="font-bold text-emerald-600">12.1%</span> na velocidade</div>
                <div>✓ Eficiência da tinta em <span className="font-bold text-yellow-600">68%</span> - recomenda-se monitoramento próximo</div>
                <div>✓ Próxima limpeza recomendada em <span className="font-bold text-blue-600">45 dias</span> para otimizar performance</div>
              </div>
            </div>
          </div>
        </Cartao>

      </div>
    </div>
  );
};

export default DashboardEngenharia;
