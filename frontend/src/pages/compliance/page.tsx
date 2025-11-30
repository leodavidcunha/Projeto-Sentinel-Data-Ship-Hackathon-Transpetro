import { useState } from 'react';
import { naviosMock } from '../../mocks/navios';
import { Cartao } from '../../components/atoms/Cartao';
import { Badge } from '../../components/atoms/Badge';

// Configurações do sistema
const CONFIG = {
  LOOKAHEAD_DAYS: 14,
  IBI_THRESHOLD_NORMAM2: 50.0,
  ALERT_WARN_DAYS: 14,
  ALERT_ACTION_DAYS: 7,
  ALERT_CRITICAL_DAYS: 3
};

// Regiões biogeográficas (NORMAM-401 Anexo I)
const regioesBiogeograficas = [
  {
    id: 'norte',
    nome: 'Norte',
    descricao: 'Bacia da Foz do Amazonas → Bacia de Barreirinhas',
    limites: 'Limite leste pela Bacia do Ceará',
    cor: 'bg-blue-500'
  },
  {
    id: 'nordeste',
    nome: 'Nordeste',
    descricao: 'Bacia do Ceará até Bacia de Mucuri',
    limites: 'Rio Mucuri como limite sul',
    cor: 'bg-amber-500'
  },
  {
    id: 'sudeste-sul',
    nome: 'Sudeste-Sul',
    descricao: 'Espírito Santo até Pelotas',
    limites: 'Rio Mucuri (norte) até Bacia de Pelotas (sul)',
    cor: 'bg-emerald-500'
  }
];

// Mapeamento IBI → Fouling Rating
const getFoulingRating = (ibi: number) => {
  if (ibi < 25) return { rating: '0-1', status: 'Aceitável', cor: 'bg-emerald-500', texto: 'text-emerald-600' };
  if (ibi < 50) return { rating: '1', status: 'Atenção', cor: 'bg-amber-500', texto: 'text-amber-600' };
  if (ibi < 75) return { rating: '2', status: 'Limite NORMAM', cor: 'bg-orange-500', texto: 'text-orange-600' };
  return { rating: '3-4', status: 'Não Aceitável', cor: 'bg-red-500', texto: 'text-red-600' };
};

// Calcular nível de alerta
const calcularNivelAlerta = (ibiAtual: number, ibiPrevisto: number, diasParaTravessia: number, diasAteThreshold: number) => {
  if (ibiAtual >= CONFIG.IBI_THRESHOLD_NORMAM2 && diasParaTravessia <= CONFIG.LOOKAHEAD_DAYS) {
    return {
      nivel: 'IMMEDIATE',
      cor: 'bg-red-600',
      texto: 'text-red-600',
      icone: 'ri-alarm-warning-line',
      mensagem: 'Risco imediato de sanção/detenção'
    };
  }
  
  if (diasAteThreshold <= CONFIG.ALERT_ACTION_DAYS && diasParaTravessia <= diasAteThreshold) {
    return {
      nivel: 'CRITICAL',
      cor: 'bg-red-500',
      texto: 'text-red-600',
      icone: 'ri-error-warning-line',
      mensagem: 'Vai violar antes da travessia'
    };
  }
  
  if (diasAteThreshold > CONFIG.ALERT_ACTION_DAYS && diasAteThreshold <= CONFIG.ALERT_WARN_DAYS) {
    return {
      nivel: 'WARNING',
      cor: 'bg-amber-500',
      texto: 'text-amber-600',
      icone: 'ri-alert-line',
      mensagem: 'Ação recomendada'
    };
  }
  
  return {
    nivel: 'INFORMATION',
    cor: 'bg-emerald-500',
    texto: 'text-emerald-600',
    icone: 'ri-information-line',
    mensagem: 'Situação sob controle'
  };
};

const PaginaCompliance = () => {
  const [navioSelecionado, setNavioSelecionado] = useState<string | null>(null);
  const [filtroAlerta, setFiltroAlerta] = useState<'todos' | 'IMMEDIATE' | 'CRITICAL' | 'WARNING' | 'INFORMATION'>('todos');
  const [modalEvidencias, setModalEvidencias] = useState(false);
  const [modalRelatorio, setModalRelatorio] = useState(false);

  // Simular dados de travessia e alertas
  const naviosComAlerta = naviosMock.map(navio => {
    const ibiAtual = navio.ibi;
    const ibiPrevisto = Math.min(100, ibiAtual + Math.random() * 15);
    const diasParaTravessia = Math.floor(Math.random() * 20) + 1;
    const diasAteThreshold = ibiAtual >= CONFIG.IBI_THRESHOLD_NORMAM2 ? 0 : Math.floor((CONFIG.IBI_THRESHOLD_NORMAM2 - ibiAtual) / 2);
    
    const regiaoAtual = regioesBiogeograficas[Math.floor(Math.random() * 3)];
    const regiaoDestino = regioesBiogeograficas.filter(r => r.id !== regiaoAtual.id)[Math.floor(Math.random() * 2)];
    
    const alerta = calcularNivelAlerta(ibiAtual, ibiPrevisto, diasParaTravessia, diasAteThreshold);
    const fouling = getFoulingRating(ibiAtual);
    
    return {
      ...navio,
      ibiAtual,
      ibiPrevisto,
      diasParaTravessia,
      diasAteThreshold,
      regiaoAtual,
      regiaoDestino,
      alerta,
      fouling
    };
  }).filter(n => filtroAlerta === 'todos' || n.alerta.nivel === filtroAlerta)
    .sort((a, b) => {
      const ordem = { IMMEDIATE: 0, CRITICAL: 1, WARNING: 2, INFORMATION: 3 };
      return ordem[a.alerta.nivel as keyof typeof ordem] - ordem[b.alerta.nivel as keyof typeof ordem];
    });

  const metricas = {
    immediate: naviosComAlerta.filter(n => n.alerta.nivel === 'IMMEDIATE').length,
    critical: naviosComAlerta.filter(n => n.alerta.nivel === 'CRITICAL').length,
    warning: naviosComAlerta.filter(n => n.alerta.nivel === 'WARNING').length,
    conformidade: Math.round((naviosComAlerta.filter(n => n.ibiAtual < CONFIG.IBI_THRESHOLD_NORMAM2).length / naviosComAlerta.length) * 100)
  };

  const navioDetalhes = navioSelecionado ? naviosComAlerta.find(n => n.id === navioSelecionado) : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Compliance NORMAM-401</h1>
            <p className="text-gray-600">Detecção e prevenção de violações em travessias entre regiões biogeográficas</p>
          </div>
          <button 
            onClick={() => setModalRelatorio(true)}
            className="px-6 py-3 bg-transpetro-green-600 text-white rounded-lg font-medium hover:bg-transpetro-green-700 transition-colors whitespace-nowrap"
          >
            <i className="ri-file-pdf-line mr-2"></i>
            Gerar Relatório de Evidências
          </button>
        </div>

        {/* Métricas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Cartao>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Taxa de Conformidade</div>
                <div className="text-3xl font-bold text-transpetro-green-600">{metricas.conformidade}%</div>
                <div className="text-xs text-slate-500 mt-1">IBI &lt; 50 (Grau &lt; 2)</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-transpetro-green-100 rounded-lg">
                <i className="ri-checkbox-circle-line text-2xl text-transpetro-green-600"></i>
              </div>
            </div>
          </Cartao>

          <Cartao>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Alertas Imediatos</div>
                <div className="text-3xl font-bold text-red-600">{metricas.immediate}</div>
                <div className="text-xs text-slate-500 mt-1">Risco de detenção</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-lg">
                <i className="ri-alarm-warning-line text-2xl text-red-600"></i>
              </div>
            </div>
          </Cartao>

          <Cartao>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Alertas Críticos</div>
                <div className="text-3xl font-bold text-orange-600">{metricas.critical}</div>
                <div className="text-xs text-slate-500 mt-1">Violação prevista</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-lg">
                <i className="ri-error-warning-line text-2xl text-orange-600"></i>
              </div>
            </div>
          </Cartao>

          <Cartao>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Avisos Preventivos</div>
                <div className="text-3xl font-bold text-amber-600">{metricas.warning}</div>
                <div className="text-xs text-slate-500 mt-1">Ação recomendada</div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-amber-100 rounded-lg">
                <i className="ri-alert-line text-2xl text-amber-600"></i>
              </div>
            </div>
          </Cartao>
        </div>

        {/* Configurações do Sistema */}
        <Cartao>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Parâmetros de Configuração</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Período de Previsão</div>
              <div className="text-lg font-bold text-gray-900">{CONFIG.LOOKAHEAD_DAYS} dias</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Threshold IBI (Grau 2)</div>
              <div className="text-lg font-bold text-gray-900">{CONFIG.IBI_THRESHOLD_NORMAM2}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Aviso Precoce</div>
              <div className="text-lg font-bold text-gray-900">{CONFIG.ALERT_WARN_DAYS} dias</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Ação Recomendada</div>
              <div className="text-lg font-bold text-gray-900">{CONFIG.ALERT_ACTION_DAYS} dias</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Crítico</div>
              <div className="text-lg font-bold text-gray-900">{CONFIG.ALERT_CRITICAL_DAYS} dias</div>
            </div>
          </div>
        </Cartao>

        {/* Mapeamento IBI → Fouling Rating */}
        <Cartao>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mapeamento IBI → Fouling Rating (NORMAM-401)</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
              <div className="w-32">
                <div className="text-sm font-bold text-gray-900">IBI 0-25</div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Fouling Rating 0-1</div>
                <div className="text-xs text-gray-600">Aceitável - Sem restrições</div>
              </div>
              <Badge cor="bg-emerald-500" className="text-xs">✓ CONFORME</Badge>
            </div>

            <div className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-500">
              <div className="w-32">
                <div className="text-sm font-bold text-gray-900">IBI 25-50</div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Fouling Rating 1</div>
                <div className="text-xs text-gray-600">Atenção - Monitoramento necessário</div>
              </div>
              <Badge cor="bg-amber-500" className="text-xs">⚠ ATENÇÃO</Badge>
            </div>

            <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <div className="w-32">
                <div className="text-sm font-bold text-gray-900">IBI 50-75</div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Fouling Rating 2</div>
                <div className="text-xs text-gray-600">Limite NORMAM - Macroincrustação leve</div>
              </div>
              <Badge cor="bg-orange-500" className="text-xs">⚠ LIMITE</Badge>
            </div>

            <div className="flex items-center gap-4 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
              <div className="w-32">
                <div className="text-sm font-bold text-gray-900">IBI 75-100</div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Fouling Rating 3-4</div>
                <div className="text-xs text-gray-600">Não Aceitável - Proibido travessia entre regiões</div>
              </div>
              <Badge cor="bg-red-500" className="text-xs">✗ VIOLAÇÃO</Badge>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <div className="text-sm text-blue-900 font-medium">
              <i className="ri-information-line mr-2"></i>
              Regra Crítica NORMAM-401: Antes de atravessar entre regiões biogeográficas, o grau de incrustação deve ser menor que 2 (IBI &lt; 50)
            </div>
          </div>
        </Cartao>

        {/* Regiões Biogeográficas */}
        <Cartao>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Regiões Biogeográficas (NORMAM-401 Anexo I)</h3>
          <div className="space-y-3">
            {regioesBiogeograficas.map(regiao => (
              <div key={regiao.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className={`w-12 h-12 flex items-center justify-center ${regiao.cor} rounded-lg text-white font-bold`}>
                  {regiao.id === 'norte' ? 'N' : regiao.id === 'nordeste' ? 'NE' : 'SE-S'}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-900 mb-1">{regiao.nome}</div>
                  <div className="text-sm text-gray-700">{regiao.descricao}</div>
                  <div className="text-xs text-gray-600 mt-1">{regiao.limites}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <div className="text-xs text-gray-600">
              <i className="ri-map-pin-line mr-2"></i>
              Fonte: GeoJSON/Shapefile NORMAM-401 Anexo I. Sistema utiliza PostGIS para operações de geoprocessamento precisas.
            </div>
          </div>
        </Cartao>

        {/* Filtros */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-slate-600">Filtrar por Nível de Alerta:</span>
          {(['todos', 'IMMEDIATE', 'CRITICAL', 'WARNING', 'INFORMATION'] as const).map(nivel => (
            <button
              key={nivel}
              onClick={() => setFiltroAlerta(nivel)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filtroAlerta === nivel 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {nivel === 'todos' ? 'Todos' : nivel}
            </button>
          ))}
        </div>

        {/* Lista de Navios com Alertas */}
        <Cartao>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detecção de Travessias e Alertas Operacionais</h3>
          <div className="space-y-3">
            {naviosComAlerta.map(navio => (
              <div 
                key={navio.id}
                className="p-4 bg-white rounded-lg border-l-4 hover:bg-gray-50 transition-all cursor-pointer"
                style={{ borderLeftColor: navio.alerta.cor.replace('bg-', '#') }}
                onClick={() => setNavioSelecionado(navio.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 flex items-center justify-center ${navio.alerta.cor} rounded-lg text-white`}>
                      <i className={navio.alerta.icone}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="text-sm font-bold text-gray-900">{navio.nome}</div>
                        <Badge cor={navio.alerta.cor} className="text-xs">{navio.alerta.nivel}</Badge>
                        <Badge cor={navio.fouling.cor} className="text-xs">Fouling {navio.fouling.rating}</Badge>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">{navio.alerta.mensagem}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span><i className="ri-compass-line mr-1"></i>IBI Atual: {navio.ibiAtual}</span>
                        <span><i className="ri-line-chart-line mr-1"></i>IBI Previsto: {navio.ibiPrevisto.toFixed(1)}</span>
                        <span><i className="ri-time-line mr-1"></i>Travessia em: {navio.diasParaTravessia} dias</span>
                        <span><i className="ri-alert-line mr-1"></i>Threshold em: {navio.diasAteThreshold} dias</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setNavioSelecionado(navio.id);
                    }}
                    className="px-4 py-2 bg-transpetro-green-600 text-white rounded-lg text-sm font-medium hover:bg-transpetro-green-700 transition-colors whitespace-nowrap"
                  >
                    Ver Detalhes
                  </button>
                </div>

                <div className="flex items-center gap-6 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${navio.regiaoAtual.cor} rounded-full`}></div>
                    <span className="text-xs text-gray-600">Origem: {navio.regiaoAtual.nome}</span>
                  </div>
                  <i className="ri-arrow-right-line text-gray-400"></i>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${navio.regiaoDestino.cor} rounded-full`}></div>
                    <span className="text-xs text-gray-600">Destino: {navio.regiaoDestino.nome}</span>
                  </div>
                  <div className="flex-1"></div>
                  <span className="text-xs text-gray-600">
                    <i className="ri-calendar-line mr-1"></i>
                    Última limpeza: {navio.diasDesdeUltimaLimpeza} dias atrás
                  </span>
                </div>

                {/* Recomendações */}
                {navio.alerta.nivel !== 'INFORMATION' && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs font-medium text-blue-900 mb-2">
                      <i className="ri-lightbulb-line mr-2"></i>Recomendações Automáticas:
                    </div>
                    <div className="space-y-1">
                      {navio.alerta.nivel === 'IMMEDIATE' && (
                        <>
                          <div className="text-xs text-blue-800">• Suspender travessia imediatamente</div>
                          <div className="text-xs text-blue-800">• Realizar limpeza de emergência no porto mais próximo</div>
                          <div className="text-xs text-blue-800">• Gerar relatório de evidências para autoridade marítima</div>
                        </>
                      )}
                      {navio.alerta.nivel === 'CRITICAL' && (
                        <>
                          <div className="text-xs text-blue-800">• Marcar limpeza urgente em {navio.diasAteThreshold} dias</div>
                          <div className="text-xs text-blue-800">• Reduzir velocidade para {(navio.velocidadeMedia * 0.8).toFixed(1)} nós</div>
                          <div className="text-xs text-blue-800">• Considerar replanejar rota para evitar travessia</div>
                        </>
                      )}
                      {navio.alerta.nivel === 'WARNING' && (
                        <>
                          <div className="text-xs text-blue-800">• Agendar limpeza preventiva em até {CONFIG.ALERT_ACTION_DAYS} dias</div>
                          <div className="text-xs text-blue-800">• Monitorar IBI diariamente</div>
                          <div className="text-xs text-blue-800">• Preparar documentação PGBI</div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Cartao>

        {/* Mapa de Travessias */}
        <Cartao>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mapa de Travessias e Regiões Biogeográficas</h3>
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d58802244.84250399!2d-43.2096!3d-15.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1234567890"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg border border-gray-200 shadow-lg">
              <div className="text-xs font-medium text-gray-900 mb-2">Regiões Biogeográficas</div>
              <div className="space-y-1">
                {regioesBiogeograficas.map(regiao => (
                  <div key={regiao.id} className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${regiao.cor} rounded-full`}></div>
                    <span className="text-xs text-gray-700">{regiao.nome}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-900 mb-1">Alertas</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-xs text-gray-700">Imediato/Crítico</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-xs text-gray-700">Aviso</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-xs text-gray-700">Normal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Cartao>

        {/* Trilha de Auditoria */}
        <Cartao>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trilha de Auditoria e Evidências</h3>
          <div className="space-y-3">
            {[
              { 
                data: '2025-01-29 14:32', 
                usuario: 'Sistema Automático', 
                acao: 'Alerta IMMEDIATE gerado: Transpetro Santos com IBI 78 próximo a travessia Norte→Nordeste', 
                tipo: 'alerta',
                evidencia: true
              },
              { 
                data: '2025-01-29 10:15', 
                usuario: 'João Silva', 
                acao: 'Inspeção IWS realizada no Transpetro Rio - IBI reduzido de 52 para 34', 
                tipo: 'inspecao',
                evidencia: true
              },
              { 
                data: '2025-01-28 16:45', 
                usuario: 'Maria Santos', 
                acao: 'Limpeza de emergência concluída no Transpetro Bahia - Evidências anexadas', 
                tipo: 'limpeza',
                evidencia: true
              },
              { 
                data: '2025-01-28 09:20', 
                usuario: 'Sistema Automático', 
                acao: 'Previsão de violação: Transpetro Angra atingirá IBI 50 em 3 dias antes de travessia', 
                tipo: 'previsao',
                evidencia: false
              },
              { 
                data: '2025-01-27 14:10', 
                usuario: 'Pedro Costa', 
                acao: 'Relatório PGBI atualizado para Transpetro Vitória - Documentação completa', 
                tipo: 'documento',
                evidencia: true
              }
            ].map((evento, idx) => (
              <div key={idx} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                  evento.tipo === 'alerta' ? 'bg-red-100' :
                  evento.tipo === 'inspecao' ? 'bg-blue-100' :
                  evento.tipo === 'limpeza' ? 'bg-emerald-100' :
                  evento.tipo === 'previsao' ? 'bg-amber-100' :
                  'bg-gray-200'
                }`}>
                  <i className={`${
                    evento.tipo === 'alerta' ? 'ri-alarm-warning-line text-red-600' :
                    evento.tipo === 'inspecao' ? 'ri-search-eye-line text-blue-600' :
                    evento.tipo === 'limpeza' ? 'ri-brush-line text-emerald-600' :
                    evento.tipo === 'previsao' ? 'ri-line-chart-line text-amber-600' :
                    'ri-file-text-line text-gray-600'
                  }`}></i>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">{evento.acao}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {evento.usuario} • {evento.data}
                  </div>
                </div>
                {evento.evidencia && (
                  <button 
                    onClick={() => setModalEvidencias(true)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 transition-colors whitespace-nowrap"
                  >
                    <i className="ri-attachment-line mr-1"></i>
                    Ver Evidências
                  </button>
                )}
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap">
            <i className="ri-history-line mr-2"></i>
            Ver Histórico Completo
          </button>
        </Cartao>

      </div>

      {/* Modal de Detalhes do Navio */}
      {navioDetalhes && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6" onClick={() => setNavioSelecionado(null)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{navioDetalhes.nome}</h2>
                <p className="text-sm text-gray-600">IMO: {navioDetalhes.imo}</p>
              </div>
              <button 
                onClick={() => setNavioSelecionado(null)}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <i className="ri-close-line text-xl text-gray-600"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status de Alerta */}
              <div className={`p-4 rounded-lg border-l-4`} style={{ 
                backgroundColor: navioDetalhes.alerta.cor.replace('bg-', 'rgba(') + ', 0.1)',
                borderLeftColor: navioDetalhes.alerta.cor.replace('bg-', '#')
              }}>
                <div className="flex items-center gap-3 mb-2">
                  <i className={`${navioDetalhes.alerta.icone} text-2xl ${navioDetalhes.alerta.texto}`}></i>
                  <div>
                    <div className="font-bold text-gray-900">Nível de Alerta: {navioDetalhes.alerta.nivel}</div>
                    <div className="text-sm text-gray-700">{navioDetalhes.alerta.mensagem}</div>
                  </div>
                </div>
              </div>

              {/* Dados de IBI e Fouling */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">IBI Atual</div>
                  <div className="text-3xl font-bold text-gray-900">{navioDetalhes.ibiAtual}</div>
                  <div className="text-xs text-gray-600 mt-1">Fouling Rating: {navioDetalhes.fouling.rating}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">IBI Previsto (14 dias)</div>
                  <div className="text-3xl font-bold text-gray-900">{navioDetalhes.ibiPrevisto.toFixed(1)}</div>
                  <div className="text-xs text-gray-600 mt-1">Tendência: +{(navioDetalhes.ibiPrevisto - navioDetalhes.ibiAtual).toFixed(1)}</div>
                </div>
              </div>

              {/* Travessia */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Travessia Planejada</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Região Atual</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${navioDetalhes.regiaoAtual.cor} rounded-full`}></div>
                      <div className="text-sm font-medium text-gray-900">{navioDetalhes.regiaoAtual.nome}</div>
                    </div>
                  </div>
                  <i className="ri-arrow-right-line text-2xl text-gray-400"></i>
                  <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Região Destino</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${navioDetalhes.regiaoDestino.cor} rounded-full`}></div>
                      <div className="text-sm font-medium text-gray-900">{navioDetalhes.regiaoDestino.nome}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-900">
                    <i className="ri-time-line mr-2"></i>
                    Travessia prevista em <strong>{navioDetalhes.diasParaTravessia} dias</strong> • 
                    Threshold IBI 50 em <strong>{navioDetalhes.diasAteThreshold} dias</strong>
                  </div>
                </div>
              </div>

              {/* Histórico de Limpeza */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Histórico de Manutenção</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Última Limpeza</div>
                      <div className="text-xs text-gray-600">{navioDetalhes.ultimaLimpeza}</div>
                    </div>
                    <div className="text-sm font-bold text-gray-900">{navioDetalhes.diasDesdeUltimaLimpeza} dias atrás</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Próxima Limpeza Prevista</div>
                      <div className="text-xs text-gray-600">{navioDetalhes.proximaLimpezaPrevista}</div>
                    </div>
                    <Badge cor="bg-amber-500" className="text-xs">AGENDADA</Badge>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-3">
                <button 
                  onClick={() => setModalEvidencias(true)}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  <i className="ri-attachment-line mr-2"></i>
                  Anexar Evidências
                </button>
                <button 
                  onClick={() => setModalRelatorio(true)}
                  className="flex-1 px-4 py-3 bg-transpetro-green-600 text-white rounded-lg font-medium hover:bg-transpetro-green-700 transition-colors whitespace-nowrap"
                >
                  <i className="ri-file-pdf-line mr-2"></i>
                  Gerar Relatório
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Evidências */}
      {modalEvidencias && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6" onClick={() => setModalEvidencias(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Anexar Evidências</h2>
              <button 
                onClick={() => setModalEvidencias(false)}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <i className="ri-close-line text-xl text-gray-600"></i>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Evidência</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                  <option>Relatório de Inspeção IWS</option>
                  <option>Fotos do Casco</option>
                  <option>Laudo de Limpeza</option>
                  <option>Certificado PGBI</option>
                  <option>Relatório AIS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload de Arquivos</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer">
                  <i className="ri-upload-cloud-line text-4xl text-gray-400 mb-2"></i>
                  <div className="text-sm text-gray-600">Arraste arquivos ou clique para selecionar</div>
                  <div className="text-xs text-gray-500 mt-1">PDF, JPG, PNG até 10MB</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  rows={4}
                  placeholder="Adicione observações sobre as evidências..."
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setModalEvidencias(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors whitespace-nowrap"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => setModalEvidencias(false)}
                  className="flex-1 px-4 py-2 bg-transpetro-green-600 text-white rounded-lg font-medium hover:bg-transpetro-green-700 transition-colors whitespace-nowrap"
                >
                  <i className="ri-save-line mr-2"></i>
                  Salvar Evidências
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Relatório */}
      {modalRelatorio && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6" onClick={() => setModalRelatorio(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Gerar Relatório de Evidências</h2>
              <button 
                onClick={() => setModalRelatorio(false)}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <i className="ri-close-line text-xl text-gray-600"></i>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-900 mb-2">O relatório incluirá:</div>
                <div className="space-y-1 text-sm text-blue-800">
                  <div>✓ Resumo da previsão (IBI atual + previsão + dias até threshold)</div>
                  <div>✓ Rota planejada e ponto de cruzamento (lat/lon + data estimada)</div>
                  <div>✓ Histórico de inspeções/limpezas (IWS) e days_since_last_iws</div>
                  <div>✓ Logs AIS (pontos de posição relevantes)</div>
                  <div>✓ Recomendações de ação / ordens geradas</div>
                  <div>✓ Checklist de conformidade (PGBI) e status de documentação</div>
                  <div>✓ Espaço para anexar fotos, laudos, relatórios pós-limpeza</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Selecionar Navios</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                  <option>Todos os navios com alertas</option>
                  <option>Apenas alertas IMMEDIATE</option>
                  <option>Apenas alertas CRITICAL</option>
                  <option>Navios específicos...</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="date" 
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <input 
                    type="date" 
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setModalRelatorio(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors whitespace-nowrap"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => setModalRelatorio(false)}
                  className="flex-1 px-4 py-2 bg-transpetro-green-600 text-white rounded-lg font-medium hover:bg-transpetro-green-700 transition-colors whitespace-nowrap"
                >
                  <i className="ri-file-pdf-line mr-2"></i>
                  Gerar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginaCompliance;
