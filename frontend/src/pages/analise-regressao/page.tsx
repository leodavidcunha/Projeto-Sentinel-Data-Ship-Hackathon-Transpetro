import { useState } from 'react';
import { naviosMock } from '../../mocks/navios';
import { Cartao } from '../../components/atoms/Cartao';
import { Badge } from '../../components/atoms/Badge';

const AnaliseRegressao = () => {
  const [navioSelecionado, setNavioSelecionado] = useState(naviosMock[0]);

  // Análise de regressão isolando fatores
  const analiseRegressao = {
    consumoBase: 38.5,
    fatores: [
      {
        nome: 'Bioincrustação (IBI)',
        impacto: 13.8,
        percentual: 35.8,
        descricao: 'Resistência hidrodinâmica adicional causada por organismos marinhos aderidos ao casco',
        cor: 'bg-red-500'
      },
      {
        nome: 'Condições Ambientais',
        impacto: 4.2,
        percentual: 10.9,
        descricao: 'Impacto de vento, ondas e correntes marítimas adversas na resistência ao avanço',
        cor: 'bg-orange-500'
      },
      {
        nome: 'Condição de Carregamento',
        impacto: 2.8,
        percentual: 7.3,
        descricao: 'Variação de calado, deslocamento e distribuição de carga afetando a eficiência',
        cor: 'bg-yellow-500'
      },
      {
        nome: 'TRIM não otimizado',
        impacto: 1.5,
        percentual: 3.9,
        descricao: 'Diferença não otimizada entre calado de proa e popa aumentando a resistência',
        cor: 'bg-blue-500'
      },
      {
        nome: 'Degradação da Tinta',
        impacto: 3.2,
        percentual: 8.3,
        descricao: 'Perda progressiva de eficiência do revestimento antifouling ao longo do tempo',
        cor: 'bg-purple-500'
      }
    ]
  };

  const consumoTotalReal = analiseRegressao.consumoBase + 
    analiseRegressao.fatores.reduce((acc, f) => acc + f.impacto, 0);

  // Dados de comparação Speed-Power com isolamento de fatores
  const comparacaoSpeedPower = [
    {
      velocidade: 12,
      potenciaIdeal: 5200,
      potenciaReal: 5850,
      fatores: {
        bioincrustacao: 420,
        ambiental: 150,
        carregamento: 50,
        trim: 30
      }
    },
    {
      velocidade: 13,
      potenciaIdeal: 6500,
      potenciaReal: 7580,
      fatores: {
        bioincrustacao: 680,
        ambiental: 250,
        carregamento: 100,
        trim: 50
      }
    },
    {
      velocidade: 14,
      potenciaIdeal: 8100,
      potenciaReal: 9850,
      fatores: {
        bioincrustacao: 1050,
        ambiental: 420,
        carregamento: 180,
        trim: 100
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.REACT_APP_NAVIGATE('/app/ingestao')}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              Voltar ao DataSet
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Análise de Regressão Multivariada</h1>
              <p className="text-gray-600">Isolamento e quantificação de fatores que impactam o consumo e performance da embarcação</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
            <i className="ri-download-line mr-2"></i>
            Exportar Relatório
          </button>
        </div>

        {/* Seletor de Navio */}
        <Cartao>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Embarcação em Análise:</label>
            <select 
              value={navioSelecionado.id}
              onChange={(e) => {
                const navio = naviosMock.find(n => n.id === e.target.value);
                if (navio) setNavioSelecionado(navio);
              }}
              className="bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none cursor-pointer"
            >
              {naviosMock.map(navio => (
                <option key={navio.id} value={navio.id}>{navio.nome} - {navio.classe}</option>
              ))}
            </select>
          </div>
        </Cartao>

        {/* Dados Operacionais Atuais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dados Ambientais */}
          <Cartao className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <i className="ri-windy-line text-2xl"></i>
              Condições Ambientais
            </h3>
            {navioSelecionado.dadosAmbientais ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-100 text-sm">Vento:</span>
                  <span className="font-bold">{navioSelecionado.dadosAmbientais.velocidadeVento.toFixed(1)} m/s ({navioSelecionado.dadosAmbientais.direcaoVento}°)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-100 text-sm">Ondas:</span>
                  <span className="font-bold">{navioSelecionado.dadosAmbientais.alturaOnda.toFixed(1)} m (T={navioSelecionado.dadosAmbientais.periodoOnda}s)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-100 text-sm">Corrente:</span>
                  <span className="font-bold">{navioSelecionado.dadosAmbientais.intensidadeCorrente.toFixed(1)} m/s ({navioSelecionado.dadosAmbientais.direcaoCorrente}°)</span>
                </div>
              </div>
            ) : (
              <div className="text-cyan-100 text-sm">Dados não disponíveis</div>
            )}
          </Cartao>

          {/* Dados de Carregamento */}
          <Cartao className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <i className="ri-ship-2-line text-2xl"></i>
              Carregamento
            </h3>
            {navioSelecionado.dadosCarregamento ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-100 text-sm">Condição:</span>
                  <Badge cor="bg-white/20" className="text-xs uppercase">{navioSelecionado.dadosCarregamento.condicao}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-100 text-sm">Calado:</span>
                  <span className="font-bold">{navioSelecionado.dadosCarregamento.calado.toFixed(1)} m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-100 text-sm">Deslocamento:</span>
                  <span className="font-bold">{(navioSelecionado.dadosCarregamento.deslocamento / 1000).toFixed(1)}k t</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-100 text-sm">Carga:</span>
                  <span className="font-bold">{navioSelecionado.dadosCarregamento.percentualCarga}%</span>
                </div>
              </div>
            ) : (
              <div className="text-emerald-100 text-sm">Dados não disponíveis</div>
            )}
          </Cartao>

          {/* Dados Operacionais */}
          <Cartao className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <i className="ri-dashboard-line text-2xl"></i>
              Operacional
            </h3>
            {navioSelecionado.dadosOperacionais ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-indigo-100 text-sm">TRIM:</span>
                  <span className="font-bold">{navioSelecionado.dadosOperacionais.trim > 0 ? '+' : ''}{navioSelecionado.dadosOperacionais.trim.toFixed(2)} m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-indigo-100 text-sm">Velocidade:</span>
                  <span className="font-bold">{navioSelecionado.dadosOperacionais.velocidadeAtual.toFixed(1)} kn</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-indigo-100 text-sm">Potência:</span>
                  <span className="font-bold">{navioSelecionado.dadosOperacionais.potenciaAtual.toFixed(0)} kW</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-indigo-100 text-sm">Condição Mar:</span>
                  <Badge cor="bg-white/20" className="text-xs uppercase">{navioSelecionado.dadosOperacionais.condicaoMar}</Badge>
                </div>
              </div>
            ) : (
              <div className="text-indigo-100 text-sm">Dados não disponíveis</div>
            )}
          </Cartao>
        </div>

        {/* Análise de Regressão - Isolamento de Fatores */}
        <Cartao>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Decomposição do Consumo por Fator de Impacto</h3>
          
          {/* Resumo Visual */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Consumo Base (Condições Ideais)</div>
                <div className="text-3xl font-bold text-gray-900">{analiseRegressao.consumoBase.toFixed(1)} t/dia</div>
              </div>
              <div className="text-4xl text-gray-400">
                <i className="ri-arrow-right-line"></i>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Consumo Real Medido</div>
                <div className="text-3xl font-bold text-red-600">{consumoTotalReal.toFixed(1)} t/dia</div>
              </div>
              <div className="text-4xl text-gray-400">
                <i className="ri-equal-line"></i>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Excesso Total Identificado</div>
                <div className="text-3xl font-bold text-orange-600">+{(consumoTotalReal - analiseRegressao.consumoBase).toFixed(1)} t/dia</div>
              </div>
            </div>
          </div>

          {/* Fatores Detalhados */}
          <div className="space-y-4">
            {analiseRegressao.fatores.map((fator, idx) => (
              <div key={idx} className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-gray-900">{fator.nome}</h4>
                      <Badge cor={fator.cor} className="text-xs">
                        +{fator.impacto.toFixed(1)} t/dia ({fator.percentual.toFixed(1)}%)
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{fator.descricao}</p>
                  </div>
                </div>

                {/* Barra de Impacto */}
                <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
                  <div 
                    className={`h-full ${fator.cor} transition-all duration-500 flex items-center px-4`}
                    style={{ width: `${(fator.impacto / (consumoTotalReal - analiseRegressao.consumoBase)) * 100}%` }}
                  >
                    <span className="text-sm font-bold text-white whitespace-nowrap">
                      {((fator.impacto / (consumoTotalReal - analiseRegressao.consumoBase)) * 100).toFixed(1)}% do excesso total
                    </span>
                  </div>
                </div>

                {/* Detalhes do Fator */}
                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Impacto Diário:</span>
                    <span className="ml-2 font-bold text-gray-900">+{fator.impacto.toFixed(1)} t</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Impacto Mensal (30 dias):</span>
                    <span className="ml-2 font-bold text-gray-900">+{(fator.impacto * 30).toFixed(0)} t</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Custo Mensal Estimado:</span>
                    <span className="ml-2 font-bold text-red-600">R$ {((fator.impacto * 30 * 3500) / 1000).toFixed(0)}k</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Cartao>

        {/* Comparação Speed-Power com Isolamento de Fatores */}
        <Cartao>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Curva Speed-Power: Decomposição de Fatores por Velocidade</h3>
          <div className="space-y-6">
            {comparacaoSpeedPower.map((item, idx) => (
              <div key={idx} className="p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-32">
                    <div className="text-sm text-gray-600">Velocidade</div>
                    <div className="text-2xl font-bold text-gray-900">{item.velocidade} nós</div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Potência Teórica Ideal</div>
                      <div className="text-xl font-bold text-emerald-600">{item.potenciaIdeal} kW</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Potência Real Medida</div>
                      <div className="text-xl font-bold text-red-600">{item.potenciaReal} kW</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Excesso de Potência</div>
                    <div className="text-xl font-bold text-orange-600">+{item.potenciaReal - item.potenciaIdeal} kW</div>
                  </div>
                </div>

                {/* Decomposição do Excesso */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">Decomposição do excesso de potência por fator:</div>
                  
                  {/* Bioincrustação */}
                  <div className="flex items-center gap-3">
                    <div className="w-40 text-sm text-gray-700">Bioincrustação (IBI):</div>
                    <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden relative">
                      <div 
                        className="h-full bg-red-500"
                        style={{ width: `${(item.fatores.bioincrustacao / (item.potenciaReal - item.potenciaIdeal)) * 100}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center px-3">
                        <span className="text-xs font-medium text-gray-900">+{item.fatores.bioincrustacao} kW</span>
                      </div>
                    </div>
                    <div className="w-20 text-right text-sm font-bold text-red-600">
                      {((item.fatores.bioincrustacao / (item.potenciaReal - item.potenciaIdeal)) * 100).toFixed(0)}%
                    </div>
                  </div>

                  {/* Ambiental */}
                  <div className="flex items-center gap-3">
                    <div className="w-40 text-sm text-gray-700">Condições Ambientais:</div>
                    <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden relative">
                      <div 
                        className="h-full bg-orange-500"
                        style={{ width: `${(item.fatores.ambiental / (item.potenciaReal - item.potenciaIdeal)) * 100}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center px-3">
                        <span className="text-xs font-medium text-gray-900">+{item.fatores.ambiental} kW</span>
                      </div>
                    </div>
                    <div className="w-20 text-right text-sm font-bold text-orange-600">
                      {((item.fatores.ambiental / (item.potenciaReal - item.potenciaIdeal)) * 100).toFixed(0)}%
                    </div>
                  </div>

                  {/* Carregamento */}
                  <div className="flex items-center gap-3">
                    <div className="w-40 text-sm text-gray-700">Carregamento:</div>
                    <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden relative">
                      <div 
                        className="h-full bg-yellow-500"
                        style={{ width: `${(item.fatores.carregamento / (item.potenciaReal - item.potenciaIdeal)) * 100}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center px-3">
                        <span className="text-xs font-medium text-gray-900">+{item.fatores.carregamento} kW</span>
                      </div>
                    </div>
                    <div className="w-20 text-right text-sm font-bold text-yellow-600">
                      {((item.fatores.carregamento / (item.potenciaReal - item.potenciaIdeal)) * 100).toFixed(0)}%
                    </div>
                  </div>

                  {/* TRIM */}
                  <div className="flex items-center gap-3">
                    <div className="w-40 text-sm text-gray-700">TRIM não otimizado:</div>
                    <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden relative">
                      <div 
                        className="h-full bg-blue-500"
                        style={{ width: `${(item.fatores.trim / (item.potenciaReal - item.potenciaIdeal)) * 100}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center px-3">
                        <span className="text-xs font-medium text-gray-900">+{item.fatores.trim} kW</span>
                      </div>
                    </div>
                    <div className="w-20 text-right text-sm font-bold text-blue-600">
                      {((item.fatores.trim / (item.potenciaReal - item.potenciaIdeal)) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Cartao>

        {/* Recomendações Baseadas em Regressão */}
        <Cartao className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 flex items-center justify-center bg-indigo-600 rounded-xl flex-shrink-0">
              <i className="ri-lightbulb-line text-3xl text-white"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recomendações Baseadas em Análise Multivariada</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-red-500 rounded-lg text-white font-bold text-sm flex-shrink-0">1</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">Prioridade Máxima: Limpeza do Casco</div>
                    <div className="text-sm text-gray-700">Bioincrustação representa <span className="font-bold text-red-600">35.8%</span> do excesso de consumo. Limpeza imediata pode economizar <span className="font-bold">R$ 1.45M/mês</span></div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-orange-500 rounded-lg text-white font-bold text-sm flex-shrink-0">2</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">Otimização de Rota e Weather Routing</div>
                    <div className="text-sm text-gray-700">Condições ambientais impactam <span className="font-bold text-orange-600">10.9%</span> do excesso. Sistema de weather routing pode reduzir em até 40% este impacto</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-lg text-white font-bold text-sm flex-shrink-0">3</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">Ajuste e Otimização de TRIM</div>
                    <div className="text-sm text-gray-700">TRIM atual de <span className="font-bold">+{navioSelecionado.dadosOperacionais?.trim.toFixed(2)}m</span> pode ser otimizado. Potencial de economia de <span className="font-bold">3.9%</span> no consumo</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-lg text-white font-bold text-sm flex-shrink-0">4</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">Planejamento Antecipado de Docagem</div>
                    <div className="text-sm text-gray-700">Degradação da tinta em <span className="font-bold text-purple-600">68%</span>. Próxima docagem deve ser antecipada para maximizar ROI e eficiência operacional</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Cartao>

      </div>
    </div>
  );
};

export default AnaliseRegressao;
