import { useState } from 'react';
import { naviosMock } from '../../mocks/navios';
import { dadosESG } from '../../mocks/esg';
import { Cartao } from '../../components/atoms/Cartao';
import { Badge } from '../../components/atoms/Badge';

const PaginaESG = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState<'mes' | 'trimestre' | 'ano'>('mes');
  const [projetoSelecionado, setProjetoSelecionado] = useState<typeof projetosDescarbonizacao[0] | null>(null);

  const emissoesFouling = naviosMock.reduce((acc, navio) => acc + navio.emissoesFouling, 0);
  const emissoesEvitadas = 12847;
  const percentualReducao = 22.4;

  const metasESG = [
    { meta: 'Redução de 30% nas emissões até 2030', progresso: 18, status: 'em_andamento' },
    { meta: 'Zero incidentes de bioinvasão até 2026', progresso: 92, status: 'em_andamento' },
    { meta: '100% da frota com IBI &lt; 50 até 2025', progresso: 76, status: 'em_andamento' },
    { meta: 'Certificação ISO 14001 para toda frota', progresso: 100, status: 'concluida' }
  ];

  const projetosDescarbonizacao = [
    {
      id: 'PROJ-001',
      nome: 'Programa de Limpeza Preventiva',
      descricao: 'Limpezas programadas baseadas em IA para otimizar consumo',
      reducaoAnual: 8450,
      investimento: 3200000,
      status: 'ativo',
      inicio: '2024-01-15'
    },
    {
      id: 'PROJ-002',
      nome: 'Otimização de Rotas',
      descricao: 'Rotas inteligentes evitando zonas de alto risco de fouling',
      reducaoAnual: 3280,
      investimento: 850000,
      status: 'ativo',
      inicio: '2024-03-01'
    },
    {
      id: 'PROJ-003',
      nome: 'Coating Avançado',
      descricao: 'Aplicação de tintas antiincrustantes de nova geração',
      reducaoAnual: 12600,
      investimento: 8500000,
      status: 'planejado',
      inicio: '2025-06-01'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ESG & Sustentabilidade</h1>
            <p className="text-gray-600">Monitoramento de indicadores ambientais, sociais e de governança</p>
          </div>
          <button className="px-6 py-3 bg-transpetro-green-600 text-white rounded-lg font-medium hover:bg-transpetro-green-700 transition-colors whitespace-nowrap">
            <i className="ri-download-line mr-2"></i>
            Relatório ESG
          </button>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Cartao className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400 mb-1">Emissões por Fouling</div>
                <div className="text-3xl font-bold text-red-400">{emissoesFouling.toFixed(0)}</div>
                <div className="text-xs text-slate-500 mt-1">t CO₂ / mês</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-red-500/20 rounded-lg">
                <i className="ri-fire-line text-2xl text-red-400"></i>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400 mb-1">Emissões Evitadas</div>
                <div className="text-3xl font-bold text-emerald-400">{emissoesEvitadas.toFixed(0)}</div>
                <div className="text-xs text-slate-500 mt-1">t CO₂ / mês</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-emerald-500/20 rounded-lg">
                <i className="ri-leaf-line text-2xl text-emerald-400"></i>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400 mb-1">Redução Potencial</div>
                <div className="text-3xl font-bold text-cyan-400">{percentualReducao.toFixed(1)}%</div>
                <div className="text-xs text-slate-500 mt-1">vs emissões totais</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-cyan-500/20 rounded-lg">
                <i className="ri-arrow-down-circle-line text-2xl text-cyan-400"></i>
              </div>
            </div>
          </Cartao>

          <Cartao className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400 mb-1">Economia Anual</div>
                <div className="text-3xl font-bold text-yellow-400">R$ 42M</div>
                <div className="text-xs text-slate-500 mt-1">com mitigação</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-yellow-500/20 rounded-lg">
                <i className="ri-money-dollar-circle-line text-2xl text-yellow-400"></i>
              </div>
            </div>
          </Cartao>
        </div>

        {/* Gráfico de Emissões */}
        <Cartao>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Evolução de Emissões CO₂</h3>
            <div className="flex gap-2">
              {(['mes', 'trimestre', 'ano'] as const).map(periodo => (
                <button
                  key={periodo}
                  onClick={() => setPeriodoSelecionado(periodo)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    periodoSelecionado === periodo 
                      ? 'bg-cyan-500 text-white' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {periodo === 'mes' ? 'Mês' : periodo === 'trimestre' ? 'Trimestre' : 'Ano'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {[
              { periodo: 'Jan/25', emissoes: 4250, evitadas: 1820, meta: 5000 },
              { periodo: 'Dez/24', emissoes: 4680, evitadas: 1650, meta: 5000 },
              { periodo: 'Nov/24', emissoes: 5120, evitadas: 1420, meta: 5000 },
              { periodo: 'Out/24', emissoes: 5450, evitadas: 1180, meta: 5000 },
              { periodo: 'Set/24', emissoes: 5890, evitadas: 950, meta: 5000 },
              { periodo: 'Ago/24', emissoes: 6200, evitadas: 720, meta: 5000 }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-20 text-sm text-gray-700">{item.periodo}</div>
                <div className="flex-1">
                  <div className="h-12 bg-gray-100 rounded-lg overflow-hidden relative">
                    <div 
                      className="absolute h-full bg-red-500/30"
                      style={{ width: `${(item.emissoes / 7000) * 100}%` }}
                    ></div>
                    <div 
                      className="absolute h-full bg-emerald-500/50"
                      style={{ width: `${(item.evitadas / 7000) * 100}%` }}
                    ></div>
                    <div 
                      className="absolute h-full w-0.5 bg-yellow-400"
                      style={{ left: `${(item.meta / 7000) * 100}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                      <span className="text-gray-900 font-medium text-sm">{item.emissoes} t CO₂</span>
                      <span className="text-emerald-600 font-medium text-sm">-{item.evitadas} t</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500/30 rounded"></div>
              <span className="text-xs text-gray-700">Emissões por Fouling</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500/50 rounded"></div>
              <span className="text-xs text-gray-700">Emissões Evitadas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-0.5 h-4 bg-yellow-400"></div>
              <span className="text-xs text-gray-700">Meta Mensal</span>
            </div>
          </div>
        </Cartao>

        {/* Metas ESG */}
        <Cartao>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Metas ESG 2025-2030</h3>
          <div className="space-y-4">
            {metasESG.map((meta, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-900">{meta.meta}</span>
                    {meta.status === 'concluida' && (
                      <Badge cor="bg-emerald-500" className="text-xs">
                        <i className="ri-check-line mr-1"></i>
                        CONCLUÍDA
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm font-medium text-cyan-600">{meta.progresso}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      meta.progresso === 100 ? 'bg-emerald-500' :
                      meta.progresso >= 75 ? 'bg-cyan-500' :
                      meta.progresso >= 50 ? 'bg-yellow-500' :
                      'bg-orange-500'
                    }`}
                    style={{ width: `${meta.progresso}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Cartao>

        {/* Projetos de Descarbonização */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Projetos de Descarbonização</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {projetosDescarbonizacao.map(projeto => (
              <Cartao key={projeto.id} className="border-l-4 border-l-emerald-500">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">{projeto.nome}</h4>
                  <Badge cor={
                    projeto.status === 'ativo' ? 'bg-emerald-500' :
                    projeto.status === 'planejado' ? 'bg-yellow-500' :
                    'bg-slate-600'
                  } className="text-xs">
                    {projeto.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">{projeto.descricao}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-600">Redução Anual</span>
                    <span className="text-sm font-bold text-emerald-600">-{projeto.reducaoAnual} t CO₂</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-600">Investimento</span>
                    <span className="text-sm font-bold text-gray-900">R$ {(projeto.investimento / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-600">Início</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(projeto.inicio).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setProjetoSelecionado(projeto)}
                  className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  <i className="ri-eye-line mr-2"></i>
                  Ver Detalhes
                </button>
              </Cartao>
            ))}
          </div>
        </div>

        {/* Ranking de Navios por Emissões */}
        <Cartao>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ranking de Emissões por Fouling</h3>
          <div className="space-y-2">
            {naviosMock
              .sort((a, b) => b.emissoesFouling - a.emissoesFouling)
              .slice(0, 10)
              .map((navio, idx) => (
                <div key={navio.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                  <div className="w-8 text-center">
                    <span className={`font-bold ${
                      idx === 0 ? 'text-red-600' :
                      idx === 1 ? 'text-orange-600' :
                      idx === 2 ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>#{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{navio.nome}</div>
                    <div className="text-xs text-gray-600">{navio.classe}</div>
                  </div>
                  <div className="w-48">
                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                        style={{ width: `${(navio.emissoesFouling / 2000) * 100}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center px-3">
                        <span className="text-gray-900 font-medium text-xs">{navio.emissoesFouling.toFixed(0)} t CO₂</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-32 text-right">
                    <span className="text-sm text-gray-700">
                      R$ {((navio.emissoesFouling * 150) / 1000).toFixed(0)}k/mês
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </Cartao>

        {/* Ações Rápidas */}
        <Cartao className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-2 border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Relatório ESG Mensal</h3>
              <p className="text-sm text-gray-600">
                Gere relatórios executivos com métricas ambientais, metas e projetos de descarbonização
              </p>
            </div>
            <button className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors whitespace-nowrap">
              <i className="ri-file-download-line mr-2"></i>
              Gerar Relatório PDF
            </button>
          </div>
        </Cartao>

      </div>

      {/* Modal de Detalhes do Projeto */}
      {projetoSelecionado && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setProjetoSelecionado(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {projetoSelecionado.nome}
              </h3>
              <button
                onClick={() => setProjetoSelecionado(null)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                <Badge cor={
                  projetoSelecionado.status === 'ativo' ? 'bg-emerald-500' :
                  projetoSelecionado.status === 'planejado' ? 'bg-yellow-500' :
                  'bg-slate-600'
                } className="text-xs">
                  {projetoSelecionado.status.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-600">ID: {projetoSelecionado.id}</span>
              </div>

              {/* Descrição */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Descrição</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {projetoSelecionado.descricao}
                </p>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="text-xs text-emerald-600 font-medium mb-1">Redução Anual</div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {projetoSelecionado.reducaoAnual}
                  </div>
                  <div className="text-xs text-emerald-600 mt-1">toneladas CO₂</div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-xs text-blue-600 font-medium mb-1">Investimento</div>
                  <div className="text-2xl font-bold text-blue-700">
                    R$ {(projetoSelecionado.investimento / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-blue-600 mt-1">milhões de reais</div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="text-xs text-amber-600 font-medium mb-1">Início</div>
                  <div className="text-2xl font-bold text-amber-700">
                    {new Date(projetoSelecionado.inicio).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                  </div>
                  <div className="text-xs text-amber-600 mt-1">data de início</div>
                </div>
              </div>

              {/* Objetivos e Benefícios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <i className="ri-target-line mr-2 text-emerald-600"></i>
                    Objetivos
                  </h4>
                  <ul className="space-y-2">
                    <li className="text-sm text-gray-600 flex items-start">
                      <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-0.5"></i>
                      <span>Redução significativa de emissões de CO₂</span>
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-0.5"></i>
                      <span>Melhoria da eficiência operacional</span>
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-0.5"></i>
                      <span>Conformidade com regulamentações ambientais</span>
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <i className="ri-checkbox-circle-fill text-emerald-600 mr-2 mt-0.5"></i>
                      <span>Redução de custos com combustível</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <i className="ri-star-line mr-2 text-amber-600"></i>
                    Benefícios
                  </h4>
                  <ul className="space-y-2">
                    <li className="text-sm text-gray-600 flex items-start">
                      <i className="ri-arrow-right-circle-fill text-amber-600 mr-2 mt-0.5"></i>
                      <span>Economia operacional significativa</span>
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <i className="ri-arrow-right-circle-fill text-amber-600 mr-2 mt-0.5"></i>
                      <span>Melhoria da imagem corporativa</span>
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <i className="ri-arrow-right-circle-fill text-amber-600 mr-2 mt-0.5"></i>
                      <span>Contribuição para metas ESG</span>
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <i className="ri-arrow-right-circle-fill text-amber-600 mr-2 mt-0.5"></i>
                      <span>Vantagem competitiva no mercado</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <i className="ri-time-line mr-2 text-blue-600"></i>
                  Cronograma
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-20 h-20 flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                    </div>
                    <div className="flex-1 border-l-2 border-emerald-600 pl-4 pb-4">
                      <div className="text-xs text-emerald-600 font-semibold mb-1">Fase 1 - Concluída</div>
                      <div className="text-sm text-gray-600">Planejamento e análise de viabilidade técnica</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-20 h-20 flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex-1 border-l-2 border-blue-600 pl-4 pb-4">
                      <div className="text-xs text-blue-600 font-semibold mb-1">Fase 2 - Em Andamento</div>
                      <div className="text-sm text-gray-600">Implementação piloto e testes operacionais</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-20 h-20 flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="flex-1 border-l-2 border-gray-300 pl-4 pb-4">
                      <div className="text-xs text-gray-500 font-semibold mb-1">Fase 3 - Planejada</div>
                      <div className="text-sm text-gray-600">Expansão para toda a frota e monitoramento</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impacto Financeiro */}
              <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <i className="ri-money-dollar-circle-line mr-2 text-emerald-600"></i>
                  Impacto Financeiro
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">ROI Estimado</div>
                    <div className="text-lg font-bold text-emerald-700">
                      {((projetoSelecionado.reducaoAnual * 150) / projetoSelecionado.investimento * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Payback</div>
                    <div className="text-lg font-bold text-cyan-700">
                      {(projetoSelecionado.investimento / (projetoSelecionado.reducaoAnual * 150)).toFixed(1)} anos
                    </div>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium whitespace-nowrap">
                  <i className="ri-download-line mr-2"></i>
                  Baixar Relatório
                </button>
                <button className="flex-1 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap">
                  <i className="ri-share-line mr-2"></i>
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginaESG;
