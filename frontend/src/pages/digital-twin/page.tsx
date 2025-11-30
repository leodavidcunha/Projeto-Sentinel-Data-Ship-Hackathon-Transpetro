import { useState, useEffect } from 'react';
import { Cartao } from '../../components/atoms/Cartao';
import { Badge } from '../../components/atoms/Badge';
import { fetchNavios, fetchAnaliseClima, NavioAPI, AnaliseClimaAPI } from '../../services/api';

const PaginaDigitalTwin = () => {
  const [navios, setNavios] = useState<NavioAPI[]>([]);
  const [navioSelecionado, setNavioSelecionado] = useState<NavioAPI | null>(null);
  const [analiseClima, setAnaliseClima] = useState<AnaliseClimaAPI | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [visaoAtiva, setVisaoAtiva] = useState<'3d' | 'clima'>('3d');
  const [anguloVisao, setAnguloVisao] = useState<'lateral' | 'frontal' | 'superior' | 'inferior'>('lateral');
    const [explicacaoExpandida, setExplicacaoExpandida] = useState(false);

  // Carregar navios da API
  useEffect(() => {
    const carregarNavios = async () => {
      const data = await fetchNavios();
      setNavios(data);
      if (data.length > 0) {
        setNavioSelecionado(data[0]);
      }
      setCarregando(false);
    };
    carregarNavios();
  }, []);

  // Carregar análise climática quando mudar o navio
  useEffect(() => {
    const carregarAnaliseClima = async () => {
      if (navioSelecionado) {
        const data = await fetchAnaliseClima(navioSelecionado.id);
        setAnaliseClima(data);
      }
    };
    carregarAnaliseClima();
  }, [navioSelecionado]);

  // Dados de incrustação por região do casco (simulado baseado no IBE do navio)
  const regioesCasco = navioSelecionado ? [
    { id: 'proa', nome: 'Proa', nivel: Math.min(100, navioSelecionado.ibe * 0.7), classe: Math.floor(navioSelecionado.ibe / 25), cor: navioSelecionado.ibe * 0.7 > 50 ? 'bg-orange-500' : 'bg-yellow-500' },
    { id: 'meio-bombordo', nome: 'Meio Bombordo', nivel: Math.min(100, navioSelecionado.ibe * 1.1), classe: Math.floor(navioSelecionado.ibe / 20), cor: navioSelecionado.ibe > 50 ? 'bg-orange-500' : 'bg-yellow-500' },
    { id: 'meio-estibordo', nome: 'Meio Estibordo', nivel: Math.min(100, navioSelecionado.ibe * 1.15), classe: Math.floor(navioSelecionado.ibe / 20), cor: navioSelecionado.ibe > 50 ? 'bg-orange-500' : 'bg-yellow-500' },
    { id: 'popa', nome: 'Popa', nivel: Math.min(100, navioSelecionado.ibe * 1.3), classe: Math.floor(navioSelecionado.ibe / 18), cor: navioSelecionado.ibe * 1.3 > 75 ? 'bg-red-500' : 'bg-orange-500' },
    { id: 'fundo', nome: 'Fundo', nivel: Math.min(100, navioSelecionado.ibe * 0.9), classe: Math.floor(navioSelecionado.ibe / 22), cor: navioSelecionado.ibe * 0.9 > 50 ? 'bg-orange-500' : 'bg-yellow-500' },
    { id: 'helice', nome: 'Hélice', nivel: Math.min(100, navioSelecionado.ibe * 1.4), classe: Math.floor(navioSelecionado.ibe / 17), cor: navioSelecionado.ibe * 1.4 > 75 ? 'bg-red-500' : 'bg-orange-500' },
    { id: 'leme', nome: 'Leme', nivel: Math.min(100, navioSelecionado.ibe * 1.05), classe: Math.floor(navioSelecionado.ibe / 21), cor: navioSelecionado.ibe > 50 ? 'bg-orange-500' : 'bg-yellow-500' }
  ] : [];

  const getClasseIMO = (classe: number) => {
    const classes = [
      { label: 'Classe 0 - Sem Incrustação', cor: 'bg-transpetro-green-500', desc: 'Casco limpo' },
      { label: 'Classe 1 - Microfouling', cor: 'bg-transpetro-yellow-400', desc: 'Biofilme leve' },
      { label: 'Classe 2 - Macro Leve', cor: 'bg-yellow-500', desc: 'Incrustação inicial' },
      { label: 'Classe 3 - Macro Moderada', cor: 'bg-orange-500', desc: 'Incrustação moderada' },
      { label: 'Classe 4 - Macro Pesada', cor: 'bg-red-500', desc: 'Incrustação severa' }
    ];
    return classes[Math.min(classe, 4)] || classes[0];
  };

  const getBeaufortIcon = (beaufort: number) => {
    if (beaufort <= 2) return 'ri-sun-line';
    if (beaufort <= 4) return 'ri-windy-line';
    if (beaufort <= 6) return 'ri-windy-fill';
    if (beaufort <= 8) return 'ri-thunderstorms-line';
    return 'ri-typhoon-line';
  };

  const getBeaufortColor = (beaufort: number) => {
    if (beaufort <= 2) return 'text-green-600 bg-green-100';
    if (beaufort <= 4) return 'text-blue-600 bg-blue-100';
    if (beaufort <= 6) return 'text-yellow-600 bg-yellow-100';
    if (beaufort <= 8) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados dos navios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              <i className="ri-ship-2-line text-cyan-600 mr-3"></i>
              Análise por Navio
            </h1>
            <p className="text-gray-600">Detalhes e análise individual de bioincrustação</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-transpetro-green-600 text-white rounded-lg font-medium hover:bg-transpetro-green-700 transition-colors whitespace-nowrap">
              <i className="ri-download-line mr-2"></i>
              Exportar
            </button>
          </div>
        </div>

        {/* Seletor de Navio */}
        <Cartao>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="text-sm font-medium text-gray-700">Selecionar Navio:</label>
            <select
              value={navioSelecionado?.id || ''}
              onChange={(e) => {
                const navio = navios.find(n => n.id === e.target.value);
                if (navio) setNavioSelecionado(navio);
              }}
              className="bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 focus:border-transpetro-green-500 focus:outline-none text-sm"
            >
              {navios.map(navio => (
                <option key={navio.id} value={navio.id}>{navio.nome} - {navio.classe}</option>
              ))}
            </select>
            {navioSelecionado && (
              <div className="flex items-center gap-4 ml-auto">
                <Badge cor={navioSelecionado.ibe > 30 ? 'bg-red-500' : navioSelecionado.ibe > 15 ? 'bg-orange-500' : 'bg-green-500'}>
                  IBE: {navioSelecionado.ibe.toFixed(1)}%
                </Badge>
              </div>
            )}
          </div>
        </Cartao>

        {/* Abas de Visualização - Apenas 2 */}
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          {[
            { id: '3d', label: 'Visualização 3D', icon: 'ri-3d-view' },
            { id: 'clima', label: 'Impacto do Clima', icon: 'ri-cloud-windy-line' }
          ].map(aba => (
            <button
              key={aba.id}
              onClick={() => setVisaoAtiva(aba.id as '3d' | 'clima')}
              className={`px-5 py-2 font-medium transition-all whitespace-nowrap text-sm ${
                visaoAtiva === aba.id
                  ? 'text-cyan-600 border-b-2 border-cyan-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className={`${aba.icon} mr-2`}></i>
              {aba.label}
            </button>
          ))}
        </div>

        {/* Visualização 3D */}
        {visaoAtiva === '3d' && navioSelecionado && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Modelo 3D Principal */}
            <Cartao className="lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Modelo 3D do Casco - {navioSelecionado.nome}
                </h3>
                <div className="flex gap-2">
                  {(['lateral', 'frontal', 'superior', 'inferior'] as const).map(angulo => (
                    <button
                      key={angulo}
                      onClick={() => setAnguloVisao(angulo)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                        anguloVisao === angulo
                          ? 'bg-cyan-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {angulo.charAt(0).toUpperCase() + angulo.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Área de Visualização 3D */}
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg overflow-hidden" style={{ height: '550px' }}>

                {/* Grid de fundo */}
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                  }}></div>
                </div>

                {/* Modelo 3D Simplificado do Navio */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  {anguloVisao === 'lateral' && (
                    <div className="relative w-full h-full flex items-center justify-center">

                      {/* SVG do Navio Petroleiro - Vista Lateral */}
                      <svg viewBox="0 0 900 300" className="w-full max-w-4xl" style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }}>
                        {/* Definições de gradientes */}
                        <defs>
                          <linearGradient id="cascoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#374151" />
                            <stop offset="50%" stopColor="#1f2937" />
                            <stop offset="100%" stopColor="#111827" />
                          </linearGradient>
                          <linearGradient id="superestruturaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f8fafc" />
                            <stop offset="100%" stopColor="#cbd5e1" />
                          </linearGradient>
                        </defs>

                        {/* Casco Principal - Forma de navio petroleiro com proa afilada */}
                        <path
                          d="M 20 150
                             L 5 160
                             L 5 180
                             L 20 195
                             L 30 200
                             L 820 200
                             Q 840 200, 850 190
                             L 855 170
                             Q 855 155, 845 150
                             L 30 150
                             L 20 150 Z"
                          fill="url(#cascoGrad)"
                          stroke="#4b5563"
                          strokeWidth="2"
                        />

                        {/* Linha d'água (waterline) */}
                        <path
                          d="M 8 185 L 852 185"
                          stroke="#dc2626"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />

                        {/* Deck principal */}
                        <rect x="28" y="140" width="825" height="12" fill="#374151" stroke="#4b5563" strokeWidth="1" rx="2"/>

                        {/* Tanques no deck (típico de petroleiro) */}
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <g key={i}>
                            <rect
                              x={60 + i * 110}
                              y="110"
                              width="90"
                              height="32"
                              fill="#1f2937"
                              stroke="#374151"
                              strokeWidth="1"
                              rx="3"
                            />
                            <ellipse
                              cx={105 + i * 110}
                              cy="110"
                              rx="45"
                              ry="7"
                              fill="#374151"
                              stroke="#4b5563"
                              strokeWidth="1"
                            />
                          </g>
                        ))}

                        {/* Superestrutura (ponte de comando) na popa */}
                        <rect x="730" y="65" width="100" height="78" fill="url(#superestruturaGrad)" stroke="#94a3b8" strokeWidth="1" rx="3"/>
                        <rect x="735" y="70" width="90" height="18" fill="#0ea5e9" stroke="#0284c7" strokeWidth="1" rx="2"/>
                        <rect x="735" y="92" width="90" height="12" fill="#1e3a5f" stroke="#0284c7" strokeWidth="1" rx="1"/>

                        {/* Janelas da superestrutura */}
                        <rect x="740" y="110" width="15" height="10" fill="#64748b" rx="1"/>
                        <rect x="760" y="110" width="15" height="10" fill="#64748b" rx="1"/>
                        <rect x="780" y="110" width="15" height="10" fill="#64748b" rx="1"/>
                        <rect x="800" y="110" width="15" height="10" fill="#64748b" rx="1"/>

                        {/* Chaminé */}
                        <rect x="800" y="35" width="22" height="35" fill="#1f2937" stroke="#374151" strokeWidth="1" rx="2"/>
                        <rect x="797" y="30" width="28" height="8" fill="#374151" stroke="#4b5563" strokeWidth="1" rx="1"/>

                        {/* Mastro de proa */}
                        <rect x="80" y="80" width="3" height="62" fill="#64748b"/>
                        <rect x="68" y="80" width="28" height="3" fill="#64748b"/>

                        {/* Guindaste no deck */}
                        <rect x="350" y="95" width="5" height="47" fill="#64748b"/>
                        <rect x="332" y="92" width="40" height="5" fill="#64748b"/>

                        {/* Hélice - posicionada dentro do SVG */}
                        <circle cx="865" cy="180" r="15" fill={regioesCasco[5]?.nivel > 75 ? '#ef4444' : '#f97316'} stroke="#fff" strokeWidth="2"/>
                        <line x1="865" y1="168" x2="865" y2="192" stroke="#fff" strokeWidth="2"/>
                        <line x1="853" y1="180" x2="877" y2="180" stroke="#fff" strokeWidth="2"/>

                        {/* Leme */}
                        <rect x="858" y="195" width="6" height="25" fill={regioesCasco[6]?.nivel > 75 ? '#ef4444' : '#f97316'} stroke="#fff" strokeWidth="1" rx="1"/>

                        {/* Âncora na proa */}
                        <circle cx="45" cy="165" r="5" fill="none" stroke="#9ca3af" strokeWidth="2"/>
                        <line x1="45" y1="170" x2="45" y2="182" stroke="#9ca3af" strokeWidth="2"/>

                        {/* Regiões de incrustação com overlay colorido */}
                        <rect x="5" y="185" width="210" height="15" fill={regioesCasco[0]?.nivel > 50 ? 'rgba(249,115,22,0.5)' : 'rgba(234,179,8,0.4)'} />
                        <rect x="215" y="185" width="210" height="15" fill={regioesCasco[1]?.nivel > 50 ? 'rgba(249,115,22,0.5)' : 'rgba(234,179,8,0.4)'} />
                        <rect x="425" y="185" width="210" height="15" fill={regioesCasco[2]?.nivel > 50 ? 'rgba(249,115,22,0.5)' : 'rgba(234,179,8,0.4)'} />
                        <rect x="635" y="185" width="220" height="15" fill={regioesCasco[3]?.nivel > 75 ? 'rgba(239,68,68,0.5)' : 'rgba(249,115,22,0.5)'} />

                        {/* Linhas divisórias das regiões */}
                        <line x1="215" y1="185" x2="215" y2="200" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3,2"/>
                        <line x1="425" y1="185" x2="425" y2="200" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3,2"/>
                        <line x1="635" y1="185" x2="635" y2="200" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3,2"/>

                        {/* Marcadores integrados no SVG */}
                        {/* Proa */}
                        <circle cx="110" cy="55" r="6" fill={regioesCasco[0]?.nivel > 50 ? '#f97316' : '#eab308'} className="animate-pulse"/>
                        <line x1="110" y1="61" x2="110" y2="108" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
                        <rect x="55" y="35" width="110" height="22" rx="4" fill="rgba(0,0,0,0.8)"/>
                        <text x="110" y="50" fill="white" fontSize="11" textAnchor="middle" fontFamily="sans-serif">Proa: {regioesCasco[0]?.nivel.toFixed(0)}%</text>

                        {/* Meio Bombordo */}
                        <circle cx="320" cy="55" r="6" fill={regioesCasco[1]?.nivel > 50 ? '#f97316' : '#eab308'} className="animate-pulse"/>
                        <line x1="320" y1="61" x2="320" y2="108" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
                        <rect x="230" y="35" width="180" height="22" rx="4" fill="rgba(0,0,0,0.8)"/>
                        <text x="320" y="50" fill="white" fontSize="11" textAnchor="middle" fontFamily="sans-serif">Meio Bombordo: {regioesCasco[1]?.nivel.toFixed(0)}%</text>

                        {/* Meio Estibordo */}
                        <circle cx="530" cy="55" r="6" fill={regioesCasco[2]?.nivel > 50 ? '#f97316' : '#eab308'} className="animate-pulse"/>
                        <line x1="530" y1="61" x2="530" y2="108" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
                        <rect x="435" y="35" width="190" height="22" rx="4" fill="rgba(0,0,0,0.8)"/>
                        <text x="530" y="50" fill="white" fontSize="11" textAnchor="middle" fontFamily="sans-serif">Meio Estibordo: {regioesCasco[2]?.nivel.toFixed(0)}%</text>

                        {/* Popa */}
                        <circle cx="750" cy="55" r="6" fill={regioesCasco[3]?.nivel > 75 ? '#ef4444' : '#f97316'} className="animate-pulse"/>
                        <line x1="750" y1="61" x2="750" y2="65" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
                        <rect x="695" y="35" width="110" height="22" rx="4" fill="rgba(0,0,0,0.8)"/>
                        <text x="750" y="50" fill="white" fontSize="11" textAnchor="middle" fontFamily="sans-serif">Popa: {regioesCasco[3]?.nivel.toFixed(0)}%</text>

                        {/* Fundo */}
                        <circle cx="430" cy="245" r="6" fill={regioesCasco[4]?.nivel > 50 ? '#f97316' : '#eab308'} className="animate-pulse"/>
                        <line x1="430" y1="239" x2="430" y2="202" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
                        <rect x="370" y="248" width="120" height="22" rx="4" fill="rgba(0,0,0,0.8)"/>
                        <text x="430" y="263" fill="white" fontSize="11" textAnchor="middle" fontFamily="sans-serif">Fundo: {regioesCasco[4]?.nivel.toFixed(0)}%</text>

                        {/* Hélice label */}
                        <rect x="780" y="225" width="100" height="22" rx="4" fill="rgba(0,0,0,0.8)"/>
                        <text x="830" y="240" fill="white" fontSize="11" textAnchor="middle" fontFamily="sans-serif">Hélice: {regioesCasco[5]?.nivel.toFixed(0)}%</text>
                        <line x1="865" y1="195" x2="850" y2="225" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>

                        {/* Leme label */}
                        <rect x="780" y="255" width="100" height="22" rx="4" fill="rgba(0,0,0,0.8)"/>
                        <text x="830" y="270" fill="white" fontSize="11" textAnchor="middle" fontFamily="sans-serif">Leme: {regioesCasco[6]?.nivel.toFixed(0)}%</text>
                        <line x1="861" y1="220" x2="850" y2="255" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
                      </svg>
                    </div>
                  )}

                  {anguloVisao === 'frontal' && (
                    <div className="relative" style={{ width: '450px', height: '400px' }}>
                      {/* SVG da Vista Frontal do Navio */}
                      <svg viewBox="0 0 400 350" className="w-full h-full" style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }}>
                        <defs>
                          <linearGradient id="cascoFrontalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#374151" />
                            <stop offset="50%" stopColor="#1f2937" />
                            <stop offset="100%" stopColor="#111827" />
                          </linearGradient>
                          <linearGradient id="superFrontalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f8fafc" />
                            <stop offset="100%" stopColor="#cbd5e1" />
                          </linearGradient>
                        </defs>

                        {/* Casco - Vista Frontal (forma de V invertido) */}
                        <path
                          d="M 80 120
                             L 50 250
                             Q 50 300, 100 310
                             L 200 320
                             L 300 310
                             Q 350 300, 350 250
                             L 320 120
                             Q 310 100, 280 95
                             L 200 90
                             L 120 95
                             Q 90 100, 80 120 Z"
                          fill="url(#cascoFrontalGrad)"
                          stroke="#4b5563"
                          strokeWidth="2"
                        />

                        {/* Linha d'água */}
                        <path
                          d="M 55 260 Q 200 275, 345 260"
                          stroke="#dc2626"
                          strokeWidth="4"
                          fill="none"
                          strokeLinecap="round"
                        />

                        {/* Deck */}
                        <ellipse cx="200" cy="100" rx="110" ry="15" fill="#374151" stroke="#4b5563" strokeWidth="1"/>

                        {/* Superestrutura */}
                        <rect x="150" y="35" width="100" height="65" fill="url(#superFrontalGrad)" stroke="#94a3b8" strokeWidth="1" rx="3"/>
                        <rect x="160" y="40" width="80" height="20" fill="#0ea5e9" stroke="#0284c7" strokeWidth="1" rx="2"/>
                        <rect x="160" y="65" width="80" height="10" fill="#1e3a5f" stroke="#0284c7" strokeWidth="1" rx="1"/>

                        {/* Chaminé */}
                        <rect x="185" y="10" width="30" height="30" fill="#1f2937" stroke="#374151" strokeWidth="1" rx="2"/>

                        {/* Mastro */}
                        <rect x="198" y="0" width="4" height="15" fill="#64748b"/>

                        {/* Divisão Bombordo/Estibordo */}
                        <line x1="200" y1="100" x2="200" y2="315" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="5,3"/>

                        {/* Overlay de incrustação - Bombordo (esquerda) */}
                        <path
                          d="M 55 260 Q 130 270, 200 275 L 200 315 L 100 310 Q 55 300, 55 260"
                          fill={regioesCasco[1]?.nivel > 50 ? 'rgba(249,115,22,0.4)' : 'rgba(234,179,8,0.3)'}
                        />

                        {/* Overlay de incrustação - Estibordo (direita) */}
                        <path
                          d="M 200 275 Q 270 270, 345 260 Q 345 300, 300 310 L 200 315 L 200 275"
                          fill={regioesCasco[2]?.nivel > 50 ? 'rgba(249,115,22,0.4)' : 'rgba(234,179,8,0.3)'}
                        />

                        {/* Fundo */}
                        <ellipse cx="200" cy="315" rx="100" ry="10" fill={regioesCasco[4]?.nivel > 50 ? 'rgba(249,115,22,0.5)' : 'rgba(234,179,8,0.4)'} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>

                        {/* Âncoras */}
                        <circle cx="90" cy="150" r="8" fill="none" stroke="#9ca3af" strokeWidth="2"/>
                        <line x1="90" y1="158" x2="90" y2="180" stroke="#9ca3af" strokeWidth="2"/>
                        <circle cx="310" cy="150" r="8" fill="none" stroke="#9ca3af" strokeWidth="2"/>
                        <line x1="310" y1="158" x2="310" y2="180" stroke="#9ca3af" strokeWidth="2"/>

                        {/* Texto identificador dos lados */}
                        <text x="110" y="200" fill="rgba(255,255,255,0.5)" fontSize="12" fontFamily="sans-serif">BB</text>
                        <text x="275" y="200" fill="rgba(255,255,255,0.5)" fontSize="12" fontFamily="sans-serif">EB</text>
                      </svg>

                      {/* Marcadores */}
                      {/* Marcador Proa (centro topo) */}
                      {regioesCasco[0] && (
                        <div className="absolute" style={{ left: '50%', top: '0px', transform: 'translateX(-50%)' }}>
                          <div className="flex flex-col items-center">
                            <div className="text-xs text-white bg-black/80 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap border border-white/20">
                              {regioesCasco[0].nome}: {regioesCasco[0].nivel.toFixed(0)}%
                            </div>
                            <div className="w-px h-3 bg-gradient-to-b from-white/70 to-transparent"></div>
                            <div className={`w-3 h-3 rounded-full ${regioesCasco[0].cor} animate-pulse shadow-lg`}></div>
                          </div>
                        </div>
                      )}

                      {/* Marcador Bombordo (esquerda) */}
                      {regioesCasco[1] && (
                        <div className="absolute" style={{ left: '-15px', top: '55%' }}>
                          <div className="flex items-center gap-2">
                            <div className="text-xs text-white bg-black/80 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap border border-white/20">
                              {regioesCasco[1].nome}: {regioesCasco[1].nivel.toFixed(0)}%
                            </div>
                            <div className="w-6 h-px bg-gradient-to-r from-transparent to-white/70"></div>
                            <div className={`w-3 h-3 rounded-full ${regioesCasco[1].cor} animate-pulse shadow-lg`}></div>
                          </div>
                        </div>
                      )}

                      {/* Marcador Estibordo (direita) */}
                      {regioesCasco[2] && (
                        <div className="absolute" style={{ right: '-15px', top: '55%' }}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${regioesCasco[2].cor} animate-pulse shadow-lg`}></div>
                            <div className="w-6 h-px bg-gradient-to-l from-transparent to-white/70"></div>
                            <div className="text-xs text-white bg-black/80 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap border border-white/20">
                              {regioesCasco[2].nome}: {regioesCasco[2].nivel.toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Marcador Fundo (embaixo) */}
                      {regioesCasco[4] && (
                        <div className="absolute" style={{ left: '50%', bottom: '5px', transform: 'translateX(-50%)' }}>
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${regioesCasco[4].cor} animate-pulse shadow-lg`}></div>
                            <div className="w-px h-3 bg-gradient-to-t from-white/70 to-transparent"></div>
                            <div className="text-xs text-white bg-black/80 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap border border-white/20">
                              {regioesCasco[4].nome}: {regioesCasco[4].nivel.toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {anguloVisao === 'superior' && (
                    <div className="relative" style={{ width: '700px', height: '320px' }}>
                      {/* SVG da Vista Superior do Navio Petroleiro */}
                      <svg viewBox="0 0 750 250" className="w-full h-full" style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }}>
                        <defs>
                          <linearGradient id="deckGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#374151" />
                            <stop offset="50%" stopColor="#4b5563" />
                            <stop offset="100%" stopColor="#374151" />
                          </linearGradient>
                        </defs>

                        {/* Casco - Vista Superior (forma de navio) */}
                        <path
                          d="M 30 125
                             Q 10 125, 10 125
                             L 50 90
                             Q 60 80, 100 75
                             L 650 75
                             Q 700 80, 720 100
                             L 740 125
                             L 720 150
                             Q 700 170, 650 175
                             L 100 175
                             Q 60 170, 50 160
                             L 10 125 Z"
                          fill="url(#deckGrad)"
                          stroke="#6b7280"
                          strokeWidth="2"
                        />

                        {/* Linha central do deck */}
                        <line x1="50" y1="125" x2="720" y2="125" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="10,5"/>

                        {/* Tanques de carga - fileira superior */}
                        {[0, 1, 2, 3, 4].map((i) => (
                          <g key={`tank-top-${i}`}>
                            <rect x={80 + i * 100} y="85" width="80" height="35" fill="#1f2937" stroke="#374151" strokeWidth="1" rx="4"/>
                            <ellipse cx={120 + i * 100} cy="102" rx="30" ry="8" fill="#374151" stroke="#4b5563" strokeWidth="1"/>
                          </g>
                        ))}

                        {/* Tanques de carga - fileira inferior */}
                        {[0, 1, 2, 3, 4].map((i) => (
                          <g key={`tank-bottom-${i}`}>
                            <rect x={80 + i * 100} y="130" width="80" height="35" fill="#1f2937" stroke="#374151" strokeWidth="1" rx="4"/>
                            <ellipse cx={120 + i * 100} cy="147" rx="30" ry="8" fill="#374151" stroke="#4b5563" strokeWidth="1"/>
                          </g>
                        ))}

                        {/* Superestrutura na popa */}
                        <rect x="620" y="95" width="90" height="60" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" rx="3"/>
                        <rect x="625" y="100" width="80" height="20" fill="#0ea5e9" stroke="#0284c7" strokeWidth="1" rx="2"/>
                        <rect x="625" y="125" width="80" height="25" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1"/>

                        {/* Chaminé */}
                        <ellipse cx="680" cy="105" rx="12" ry="8" fill="#1f2937" stroke="#374151" strokeWidth="1"/>

                        {/* Mastro de proa */}
                        <circle cx="70" cy="125" r="5" fill="#64748b" stroke="#475569" strokeWidth="1"/>

                        {/* Guindaste */}
                        <rect x="280" y="118" width="40" height="14" fill="#64748b" stroke="#475569" strokeWidth="1" rx="2"/>

                        {/* Divisões das regiões com overlay de cor */}
                        <rect x="10" y="75" width="150" height="100" fill={regioesCasco[0]?.nivel > 50 ? 'rgba(249,115,22,0.25)' : 'rgba(234,179,8,0.2)'} rx="5"/>
                        <rect x="160" y="75" width="150" height="100" fill={regioesCasco[1]?.nivel > 50 ? 'rgba(249,115,22,0.25)' : 'rgba(234,179,8,0.2)'} rx="5"/>
                        <rect x="310" y="75" width="150" height="100" fill={regioesCasco[2]?.nivel > 50 ? 'rgba(249,115,22,0.25)' : 'rgba(234,179,8,0.2)'} rx="5"/>
                        <rect x="460" y="75" width="280" height="100" fill={regioesCasco[3]?.nivel > 75 ? 'rgba(239,68,68,0.25)' : 'rgba(249,115,22,0.25)'} rx="5"/>

                        {/* Linhas divisórias */}
                        <line x1="160" y1="80" x2="160" y2="170" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="5,3"/>
                        <line x1="310" y1="80" x2="310" y2="170" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="5,3"/>
                        <line x1="460" y1="80" x2="460" y2="170" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="5,3"/>

                        {/* Âncoras */}
                        <circle cx="55" cy="100" r="4" fill="none" stroke="#9ca3af" strokeWidth="1.5"/>
                        <circle cx="55" cy="150" r="4" fill="none" stroke="#9ca3af" strokeWidth="1.5"/>

                        {/* Labels das regiões */}
                        <text x="85" y="130" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="sans-serif">PROA</text>
                        <text x="560" y="130" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="sans-serif">POPA</text>
                        <text x="200" y="95" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="sans-serif">BB</text>
                        <text x="200" y="165" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="sans-serif">EB</text>
                      </svg>

                      {/* Marcadores */}
                      {regioesCasco[0] && (
                        <div className="absolute" style={{ left: '8%', top: '5px' }}>
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${regioesCasco[0].cor} animate-pulse shadow-lg`}></div>
                            <div className="w-px h-8 bg-gradient-to-b from-white/70 to-transparent"></div>
                            <div className="text-xs text-white bg-black/80 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap border border-white/20">
                              {regioesCasco[0].nome}: {regioesCasco[0].nivel.toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      )}

                      {regioesCasco[1] && (
                        <div className="absolute" style={{ left: '28%', bottom: '15px' }}>
                          <div className="flex flex-col items-center">
                            <div className="text-xs text-white bg-black/80 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap border border-white/20">
                              {regioesCasco[1].nome}: {regioesCasco[1].nivel.toFixed(0)}%
                            </div>
                            <div className="w-px h-8 bg-gradient-to-t from-white/70 to-transparent"></div>
                            <div className={`w-3 h-3 rounded-full ${regioesCasco[1].cor} animate-pulse shadow-lg`}></div>
                          </div>
                        </div>
                      )}

                      {regioesCasco[2] && (
                        <div className="absolute" style={{ left: '50%', top: '5px' }}>
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${regioesCasco[2].cor} animate-pulse shadow-lg`}></div>
                            <div className="w-px h-8 bg-gradient-to-b from-white/70 to-transparent"></div>
                            <div className="text-xs text-white bg-black/80 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap border border-white/20">
                              {regioesCasco[2].nome}: {regioesCasco[2].nivel.toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      )}

                      {regioesCasco[3] && (
                        <div className="absolute" style={{ right: '8%', bottom: '15px' }}>
                          <div className="flex flex-col items-center">
                            <div className="text-xs text-white bg-black/80 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap border border-white/20">
                              {regioesCasco[3].nome}: {regioesCasco[3].nivel.toFixed(0)}%
                            </div>
                            <div className="w-px h-8 bg-gradient-to-t from-white/70 to-transparent"></div>
                            <div className={`w-3 h-3 rounded-full ${regioesCasco[3].cor} animate-pulse shadow-lg`}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {anguloVisao === 'inferior' && (
                    <div className="relative" style={{ width: '700px', height: '320px' }}>
                      {/* SVG da Vista Inferior do Navio */}
                      <svg viewBox="0 0 750 250" className="w-full h-full" style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }}>
                        <defs>
                          <linearGradient id="fundoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#991b1b" />
                            <stop offset="50%" stopColor="#b91c1c" />
                            <stop offset="100%" stopColor="#991b1b" />
                          </linearGradient>
                          <linearGradient id="quilhaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1f2937" />
                            <stop offset="100%" stopColor="#111827" />
                          </linearGradient>
                        </defs>

                        {/* Casco - Vista Inferior (formato de casco de navio) */}
                        <path
                          d="M 30 125
                             Q 10 125, 10 125
                             L 60 70
                             Q 80 55, 120 50
                             L 630 50
                             Q 680 55, 710 80
                             L 740 125
                             L 710 170
                             Q 680 195, 630 200
                             L 120 200
                             Q 80 195, 60 180
                             L 10 125 Z"
                          fill="url(#fundoGrad)"
                          stroke="#7f1d1d"
                          strokeWidth="2"
                        />

                        {/* Quilha central */}
                        <rect x="30" y="118" width="680" height="14" fill="url(#quilhaGrad)" stroke="#374151" strokeWidth="1" rx="2"/>

                        {/* Overlay de incrustação no fundo */}
                        <path
                          d="M 40 125
                             L 70 75
                             Q 85 60, 125 55
                             L 625 55
                             Q 675 60, 700 85
                             L 730 125
                             L 700 165
                             Q 675 190, 625 195
                             L 125 195
                             Q 85 190, 70 175
                             L 40 125 Z"
                          fill={regioesCasco[4]?.nivel > 50 ? 'rgba(249,115,22,0.35)' : 'rgba(234,179,8,0.25)'}
                        />

                        {/* Placas do casco */}
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <g key={`plate-${i}`}>
                            <line x1={80 + i * 100} y1="60" x2={80 + i * 100} y2="190" stroke="rgba(0,0,0,0.3)" strokeWidth="1"/>
                          </g>
                        ))}

                        {/* Linhas horizontais do casco */}
                        <line x1="50" y1="90" x2="720" y2="90" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
                        <line x1="50" y1="160" x2="720" y2="160" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>

                        {/* Hélice */}
                        <g transform="translate(695, 125)">
                          <circle r="30" fill={regioesCasco[5]?.nivel > 75 ? '#ef4444' : '#f97316'} stroke="#fff" strokeWidth="2"/>
                          <line x1="0" y1="-25" x2="0" y2="25" stroke="#fff" strokeWidth="3"/>
                          <line x1="-25" y1="0" x2="25" y2="0" stroke="#fff" strokeWidth="3"/>
                          <line x1="-18" y1="-18" x2="18" y2="18" stroke="#fff" strokeWidth="2"/>
                          <line x1="-18" y1="18" x2="18" y2="-18" stroke="#fff" strokeWidth="2"/>
                          <circle r="8" fill="#1f2937" stroke="#374151" strokeWidth="1"/>
                        </g>

                        {/* Leme */}
                        <rect x="640" y="100" width="12" height="50" fill={regioesCasco[6]?.nivel > 75 ? '#ef4444' : '#f97316'} stroke="#fff" strokeWidth="1" rx="2"/>

                        {/* Eixo do hélice */}
                        <rect x="655" y="120" width="40" height="10" fill="#374151" stroke="#4b5563" strokeWidth="1" rx="2"/>

                        {/* Bulbo da proa */}
                        <ellipse cx="45" cy="125" rx="20" ry="35" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1"/>

                        {/* Textos identificadores */}
                        <text x="350" y="130" fill="rgba(255,255,255,0.4)" fontSize="14" fontFamily="sans-serif" textAnchor="middle">FUNDO DO CASCO</text>
                        <text x="60" y="130" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="sans-serif">PROA</text>
                        <text x="600" y="130" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="sans-serif">POPA</text>
                      </svg>

                      {/* Marcadores */}
                      {/* Marcador do Fundo (centro) */}
                      {regioesCasco[4] && (
                        <div className="absolute" style={{ left: '40%', top: '5px' }}>
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${regioesCasco[4].cor} animate-pulse shadow-lg`}></div>
                            <div className="w-px h-8 bg-gradient-to-b from-white/70 to-transparent"></div>
                            <div className="text-xs text-white bg-black/80 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap border border-white/20">
                              {regioesCasco[4].nome}: {regioesCasco[4].nivel.toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Marcador da Hélice */}
                      {regioesCasco[5] && (
                        <div className="absolute" style={{ right: '-60px', top: '40%' }}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${regioesCasco[5].cor} animate-pulse shadow-lg`}></div>
                            <div className="w-8 h-px bg-gradient-to-r from-white/70 to-transparent"></div>
                            <div className="text-xs text-white bg-black/80 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap border border-white/20">
                              {regioesCasco[5].nome}: {regioesCasco[5].nivel.toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Marcador do Leme */}
                      {regioesCasco[6] && (
                        <div className="absolute" style={{ right: '-60px', top: '60%' }}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${regioesCasco[6].cor} animate-pulse shadow-lg`}></div>
                            <div className="w-8 h-px bg-gradient-to-r from-white/70 to-transparent"></div>
                            <div className="text-xs text-white bg-black/80 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap border border-white/20">
                              {regioesCasco[6].nome}: {regioesCasco[6].nivel.toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Legenda de cores */}
                <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-3">
                  <div className="text-xs text-white font-medium mb-2">Nível de Incrustação:</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-transpetro-green-500 rounded"></div>
                      <span className="text-xs text-white">0-25% - Limpo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-xs text-white">25-50% - Leve</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span className="text-xs text-white">50-75% - Moderado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-xs text-white">75-100% - Severo</span>
                    </div>
                  </div>
                </div>
              </div>
            </Cartao>

            {/* Painel Lateral - Regiões */}
            <Cartao>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Regiões do Casco</h3>
              <div className="space-y-3">
                {regioesCasco.map(regiao => {
                  const classeInfo = getClasseIMO(regiao.classe);
                  return (
                    <div key={regiao.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-cyan-500 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{regiao.nome}</span>
                        <Badge cor={regiao.cor} className="text-xs">{regiao.nivel.toFixed(0)}%</Badge>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full ${regiao.cor} transition-all duration-500`}
                          style={{ width: `${regiao.nivel}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600">
                        Classe IMO: {regiao.classe} - {classeInfo.desc}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-information-line text-cyan-600"></i>
                  <span className="text-sm font-medium text-gray-900">Média Geral</span>
                </div>
                <div className="text-2xl font-bold text-cyan-600">
                  {Math.round(regioesCasco.reduce((acc, r) => acc + r.nivel, 0) / regioesCasco.length)}%
                </div>
              </div>
            </Cartao>
          </div>
        )}

        {/* Aba: Impacto do Clima */}
        {visaoAtiva === 'clima' && navioSelecionado && (
          <div className="space-y-6">

            {/* Cards de Métricas Climáticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Cartao className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getBeaufortColor(analiseClima?.estatisticasClima?.beaufortMedio || 4)}`}>
                    <i className={`${getBeaufortIcon(analiseClima?.estatisticasClima?.beaufortMedio || 4)} text-2xl`}></i>
                  </div>
                  <div>
                    <div className="text-sm opacity-90">Beaufort Médio</div>
                    <div className="text-3xl font-bold">{analiseClima?.estatisticasClima?.beaufortMedio?.toFixed(1) || 'N/A'}</div>
                  </div>
                </div>
                <div className="text-xs opacity-90">{analiseClima?.estatisticasClima?.beaufortDesc || 'Carregando...'}</div>
              </Cartao>

              <Cartao className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <i className="ri-water-flash-line text-2xl"></i>
                  </div>
                  <div>
                    <div className="text-sm opacity-90">Condição do Mar</div>
                    <div className="text-3xl font-bold">{analiseClima?.estatisticasClima?.seaConditionMedio?.toFixed(1) || 'N/A'}</div>
                  </div>
                </div>
                <div className="text-xs opacity-90">{analiseClima?.estatisticasClima?.seaConditionDesc || 'Carregando...'}</div>
              </Cartao>

              <Cartao className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <i className="ri-gas-station-line text-2xl"></i>
                  </div>
                  <div>
                    <div className="text-sm opacity-90">Impacto no Consumo</div>
                    <div className="text-3xl font-bold">+{analiseClima?.impactoConsumo?.toFixed(1) || 0}%</div>
                  </div>
                </div>
                <div className="text-xs opacity-90">Acima do baseline</div>
              </Cartao>

              <Cartao className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <i className="ri-route-line text-2xl"></i>
                  </div>
                  <div>
                    <div className="text-sm opacity-90">Viagens Analisadas</div>
                    <div className="text-3xl font-bold">{analiseClima?.totalViagens || 0}</div>
                  </div>
                </div>
                <div className="text-xs opacity-90">Registros no histórico</div>
              </Cartao>
            </div>

            {/* Banner de Explicacao da Metodologia */}
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-information-line text-blue-600 text-xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      Como calculamos o Impacto do Clima?
                    </h3>
                    <p className="text-sm text-gray-700">
                      Usamos um <strong>modelo de regressao</strong> para separar os fatores que causam excesso de consumo de combustivel.
                    </p>

                    {explicacaoExpandida && analiseClima && (
                      <div className="mt-4 space-y-4">
                        {/* EXEMPLO COM VALORES REAIS */}
                        <div className="bg-white rounded-lg p-4 border-2 border-cyan-300">
                          <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <i className="ri-calculator-line text-cyan-600"></i>
                            Calculo para {analiseClima.navio}
                          </p>

                          {/* Passo 1: Baseline vs Atual */}
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-semibold text-gray-700 mb-2">PASSO 1: Identificar excesso de consumo</p>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div className="bg-green-100 rounded p-2">
                                <p className="text-xs text-green-700">Baseline (ideal)</p>
                                <p className="text-lg font-bold text-green-800">{analiseClima.baseline.toFixed(4)}</p>
                                <p className="text-xs text-green-600">ton/nm</p>
                              </div>
                              <div className="bg-orange-100 rounded p-2">
                                <p className="text-xs text-orange-700">Consumo Atual</p>
                                <p className="text-lg font-bold text-orange-800">{analiseClima.consumoAtual.toFixed(4)}</p>
                                <p className="text-xs text-orange-600">ton/nm</p>
                              </div>
                              <div className="bg-red-100 rounded p-2">
                                <p className="text-xs text-red-700">Excesso</p>
                                <p className="text-lg font-bold text-red-800">+{analiseClima.excessoTotal.toFixed(4)}</p>
                                <p className="text-xs text-red-600">(+{analiseClima.impactoConsumo.toFixed(1)}%)</p>
                              </div>
                            </div>
                            <div className="mt-2 p-2 bg-white rounded border">
                              <code className="text-xs text-gray-700">
                                Excesso = {analiseClima.consumoAtual.toFixed(4)} - {analiseClima.baseline.toFixed(4)} = <strong>{analiseClima.excessoTotal.toFixed(4)} ton/nm</strong>
                              </code>
                            </div>
                          </div>

                          {/* Passo 2: Separacao de Fatores */}
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-semibold text-gray-700 mb-2">PASSO 2: Separar causas do excesso</p>
                            <p className="text-xs text-gray-600 mb-2">
                              Dividimos o excesso de <strong>{analiseClima.excessoTotal.toFixed(4)} ton/nm</strong> entre os fatores usando coeficientes estimados:
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-24 text-xs text-gray-600">Clima:</div>
                                <div className="flex-1 bg-blue-200 rounded-full h-4 overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500"
                                    style={{ width: `${analiseClima.separacaoFatores.clima}%` }}
                                  ></div>
                                </div>
                                <div className="w-20 text-xs font-bold text-blue-700 text-right">
                                  {analiseClima.separacaoFatores.clima.toFixed(1)}% = {(analiseClima.excessoTotal * analiseClima.separacaoFatores.clima / 100).toFixed(4)} ton/nm
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-24 text-xs text-gray-600">Trim:</div>
                                <div className="flex-1 bg-yellow-200 rounded-full h-4 overflow-hidden">
                                  <div
                                    className="h-full bg-yellow-500"
                                    style={{ width: `${analiseClima.separacaoFatores.trim}%` }}
                                  ></div>
                                </div>
                                <div className="w-20 text-xs font-bold text-yellow-700 text-right">
                                  {analiseClima.separacaoFatores.trim.toFixed(1)}% = {(analiseClima.excessoTotal * analiseClima.separacaoFatores.trim / 100).toFixed(4)} ton/nm
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-24 text-xs text-gray-600">Carregamento:</div>
                                <div className="flex-1 bg-purple-200 rounded-full h-4 overflow-hidden">
                                  <div
                                    className="h-full bg-purple-500"
                                    style={{ width: `${analiseClima.separacaoFatores.carregamento}%` }}
                                  ></div>
                                </div>
                                <div className="w-20 text-xs font-bold text-purple-700 text-right">
                                  {analiseClima.separacaoFatores.carregamento.toFixed(1)}% = {(analiseClima.excessoTotal * analiseClima.separacaoFatores.carregamento / 100).toFixed(4)} ton/nm
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-24 text-xs text-gray-600">Bioincrustacao:</div>
                                <div className="flex-1 bg-red-200 rounded-full h-4 overflow-hidden">
                                  <div
                                    className="h-full bg-red-500"
                                    style={{ width: `${analiseClima.separacaoFatores.bioincrustacao}%` }}
                                  ></div>
                                </div>
                                <div className="w-20 text-xs font-bold text-red-700 text-right">
                                  {analiseClima.separacaoFatores.bioincrustacao.toFixed(1)}% = {(analiseClima.excessoTotal * analiseClima.separacaoFatores.bioincrustacao / 100).toFixed(4)} ton/nm
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Coeficientes e Formulas */}
                          <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1">
                              <i className="ri-flask-line"></i>
                              Coeficientes Utilizados (Estimativas)
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              <div className="bg-white rounded p-2 border border-amber-100">
                                <p className="font-semibold text-blue-700 mb-1">Clima (Vento + Ondas)</p>
                                <p className="text-gray-600">
                                  <strong>Beaufort:</strong> Ideal = 4. Cada ponto de desvio adiciona <strong>+2%</strong> ao consumo.
                                </p>
                                <p className="text-gray-600 mt-1">
                                  <strong>Sea Condition:</strong> Ideal = 2. Cada ponto acima adiciona <strong>+1.5%</strong>.
                                </p>
                                <div className="mt-2 p-1 bg-gray-50 rounded text-xs font-mono">
                                  Beaufort medio: {analiseClima.estatisticasClima.beaufortMedio.toFixed(1)} (desvio: {Math.abs(analiseClima.estatisticasClima.beaufortMedio - 4).toFixed(1)})<br/>
                                  Sea Condition: {analiseClima.estatisticasClima.seaConditionMedio.toFixed(1)} (excesso: {Math.max(0, analiseClima.estatisticasClima.seaConditionMedio - 2).toFixed(1)})
                                </div>
                              </div>
                              <div className="bg-white rounded p-2 border border-amber-100">
                                <p className="font-semibold text-yellow-700 mb-1">Trim (Inclinacao)</p>
                                <p className="text-gray-600">
                                  <strong>Ideal:</strong> -0.5m (leve inclinacao para popa).
                                </p>
                                <p className="text-gray-600 mt-1">
                                  Cada metro de desvio adiciona <strong>+3%</strong> ao consumo.
                                </p>
                              </div>
                              <div className="bg-white rounded p-2 border border-amber-100">
                                <p className="font-semibold text-purple-700 mb-1">Carregamento (Peso)</p>
                                <p className="text-gray-600">
                                  Comparado ao menor deslocamento registrado.
                                </p>
                                <p className="text-gray-600 mt-1">
                                  Cada <strong>10%</strong> de carga extra adiciona <strong>+2%</strong> ao consumo.
                                </p>
                              </div>
                              <div className="bg-white rounded p-2 border border-amber-100">
                                <p className="font-semibold text-red-700 mb-1">Bioincrustacao (Residuo)</p>
                                <p className="text-gray-600">
                                  <strong>Nao e medido diretamente.</strong>
                                </p>
                                <p className="text-gray-600 mt-1">
                                  E o excesso que <strong>sobra</strong> depois de descontar clima, trim e carga.
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 p-2 bg-amber-100 rounded">
                              <p className="text-xs text-amber-800">
                                <i className="ri-error-warning-line mr-1"></i>
                                <strong>Nota:</strong> Os coeficientes (2%, 1.5%, 3%) sao <strong>estimativas baseadas em literatura tecnica</strong>.
                                Em producao, devem ser calibrados com dados historicos especificos de cada embarcacao.
                              </p>
                            </div>
                          </div>

                          {/* Passo 3: Condicoes Climaticas */}
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-semibold text-gray-700 mb-2">PASSO 3: Condicoes climaticas medias nas viagens</p>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-blue-50 rounded p-2 border border-blue-200">
                                <p className="text-xs text-blue-700">Beaufort Medio</p>
                                <p className="text-lg font-bold text-blue-800">{analiseClima.estatisticasClima.beaufortMedio.toFixed(1)}</p>
                                <p className="text-xs text-blue-600">{analiseClima.estatisticasClima.beaufortDesc}</p>
                                <p className="text-xs text-gray-500 mt-1">Min: {analiseClima.estatisticasClima.beaufortMin} / Max: {analiseClima.estatisticasClima.beaufortMax}</p>
                              </div>
                              <div className="bg-cyan-50 rounded p-2 border border-cyan-200">
                                <p className="text-xs text-cyan-700">
                                  Sea Condition Media
                                  {analiseClima.estatisticasClima.seaConditionEstimado && (
                                    <span className="ml-1 text-amber-600">(est.)</span>
                                  )}
                                </p>
                                <p className="text-lg font-bold text-cyan-800">{analiseClima.estatisticasClima.seaConditionMedio.toFixed(1)}</p>
                                <p className="text-xs text-cyan-600">{analiseClima.estatisticasClima.seaConditionDesc}</p>
                                {analiseClima.estatisticasClima.seaConditionMin !== undefined && (
                                  <p className="text-xs text-gray-500 mt-1">Min: {analiseClima.estatisticasClima.seaConditionMin} / Max: {analiseClima.estatisticasClima.seaConditionMax}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Definicoes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                              <i className="ri-anchor-line text-green-600"></i>
                              <p className="text-xs font-semibold text-green-800">Baseline (Consumo Ideal)</p>
                            </div>
                            <p className="text-xs text-green-700">
                              Media do consumo em condicoes ideais: Beaufort 3-5, mar calmo, trim otimizado.
                              Valor de referencia: <strong>{analiseClima.baseline.toFixed(4)} ton/nm</strong>
                            </p>
                          </div>
                          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                            <div className="flex items-center gap-2 mb-2">
                              <i className="ri-bug-line text-red-600"></i>
                              <p className="text-xs font-semibold text-red-800">Bioincrustacao</p>
                            </div>
                            <p className="text-xs text-red-700">
                              Parcela do excesso nao explicada por clima, trim ou carga.
                              E o "residuo" da regressao - excesso sem causa conhecida.
                            </p>
                          </div>
                        </div>

                        {/* Escala Beaufort */}
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-2">Escala Beaufort (Vento):</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2 border border-green-200">
                              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                              <div>
                                <p className="text-xs font-medium text-green-800">0-3</p>
                                <p className="text-xs text-green-600">Calmo</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                              <div>
                                <p className="text-xs font-medium text-blue-800">4-5</p>
                                <p className="text-xs text-blue-600">Moderado</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-3 py-2 border border-orange-200">
                              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                              <div>
                                <p className="text-xs font-medium text-orange-800">6-7</p>
                                <p className="text-xs text-orange-600">Forte</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-red-50 rounded-lg px-3 py-2 border border-red-200">
                              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                              <div>
                                <p className="text-xs font-medium text-red-800">8+</p>
                                <p className="text-xs text-red-600">Tempestade</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Escala Sea Condition */}
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            Condicao do Mar (Ondas):
                            {analiseClima?.estatisticasClima?.seaConditionEstimado && (
                              <span className="ml-2 text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                                Estimado a partir de Beaufort (dado original vazio)
                              </span>
                            )}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2 border border-green-200">
                              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                              <div>
                                <p className="text-xs font-medium text-green-800">0-2</p>
                                <p className="text-xs text-green-600">Calmo</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-yellow-50 rounded-lg px-3 py-2 border border-yellow-200">
                              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                              <div>
                                <p className="text-xs font-medium text-yellow-800">3-4</p>
                                <p className="text-xs text-yellow-600">Moderado</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-3 py-2 border border-orange-200">
                              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                              <div>
                                <p className="text-xs font-medium text-orange-800">5-6</p>
                                <p className="text-xs text-orange-600">Agitado</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-red-50 rounded-lg px-3 py-2 border border-red-200">
                              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                              <div>
                                <p className="text-xs font-medium text-red-800">7+</p>
                                <p className="text-xs text-red-600">Muito agitado</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Fonte dos Dados */}
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <p className="text-xs font-semibold text-blue-800 mb-1">Fonte dos Dados:</p>
                          <p className="text-xs text-blue-700">
                            Analise baseada em {analiseClima?.totalViagens || 0} viagens registradas deste navio.
                            Metodologia: regressao multipla com variaveis independentes (Beaufort, Sea Condition, trim, carga)
                            e consumo por milha nautica como variavel dependente.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setExplicacaoExpandida(!explicacaoExpandida)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors cursor-pointer"
                >
                  {explicacaoExpandida ? 'Menos' : 'Saiba mais'}
                  <i className={`ri-arrow-${explicacaoExpandida ? 'up' : 'down'}-s-line`}></i>
                </button>
              </div>
            </div>

            {/* Diagnóstico de Probabilidades */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Cartao>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <i className="ri-question-line text-purple-600 mr-2"></i>
                  Por que o navio está lento?
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Análise de probabilidades para identificar a causa do excesso de consumo
                </p>

                {/* Barras de Probabilidade */}
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                          <i className="ri-bug-line text-white text-lg"></i>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Bioincrustação</div>
                          <div className="text-xs text-gray-600">Organismos marinhos no casco</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-red-600">
                        {((analiseClima?.probabilidadeCausa?.bioincrustacao || 0) * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="h-3 bg-red-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 transition-all duration-1000"
                        style={{ width: `${(analiseClima?.probabilidadeCausa?.bioincrustacao || 0) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <i className="ri-cloud-windy-line text-white text-lg"></i>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Clima (Vento/Ondas)</div>
                          <div className="text-xs text-gray-600">Condições meteorológicas</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {((analiseClima?.probabilidadeCausa?.clima || 0) * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="h-3 bg-blue-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-1000"
                        style={{ width: `${(analiseClima?.probabilidadeCausa?.clima || 0) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                          <i className="ri-settings-3-line text-white text-lg"></i>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Outros Fatores</div>
                          <div className="text-xs text-gray-600">Trim, carregamento, etc.</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-600">
                        {((analiseClima?.probabilidadeCausa?.outros || 0) * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-500 transition-all duration-1000"
                        style={{ width: `${(analiseClima?.probabilidadeCausa?.outros || 0) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Cartao>

              {/* Separação de Fatores */}
              <Cartao>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <i className="ri-pie-chart-line text-cyan-600 mr-2"></i>
                  Separação de Fatores
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Contribuição de cada fator no excesso de consumo
                </p>

                <div className="space-y-3">
                  {[
                    { label: 'Bioincrustação', value: analiseClima?.separacaoFatores?.bioincrustacao || 0, color: 'bg-red-500', icon: 'ri-bug-line' },
                    { label: 'Clima', value: analiseClima?.separacaoFatores?.clima || 0, color: 'bg-blue-500', icon: 'ri-cloud-windy-line' },
                    { label: 'Trim', value: analiseClima?.separacaoFatores?.trim || 0, color: 'bg-indigo-500', icon: 'ri-ship-line' },
                    { label: 'Carregamento', value: analiseClima?.separacaoFatores?.carregamento || 0, color: 'bg-purple-500', icon: 'ri-scales-3-line' }
                  ].map(fator => (
                    <div key={fator.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 ${fator.color} rounded-lg flex items-center justify-center`}>
                        <i className={`${fator.icon} text-white text-sm`}></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{fator.label}</span>
                          <span className="text-sm font-bold text-gray-900">{fator.value.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${fator.color} transition-all duration-1000`}
                            style={{ width: `${fator.value}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Cartao>
            </div>

            {/* Recomendação */}
            <Cartao>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  (analiseClima?.probabilidadeCausa?.bioincrustacao || 0) > 0.5
                    ? 'bg-red-500'
                    : (analiseClima?.probabilidadeCausa?.clima || 0) > 0.5
                      ? 'bg-blue-500'
                      : 'bg-green-500'
                }`}>
                  <i className="ri-lightbulb-line text-white text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Recomendação</h3>
                  <p className="text-gray-700">
                    {analiseClima?.recomendacao || 'Carregando análise...'}
                  </p>
                </div>
              </div>
            </Cartao>

            {/* Últimas Viagens */}
            {analiseClima?.ultimasViagens && analiseClima.ultimasViagens.length > 0 && (
              <Cartao>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <i className="ri-history-line text-cyan-600 mr-2"></i>
                  Últimas Viagens
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Data</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">Beaufort</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">Mar</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">Consumo/NM</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">Velocidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analiseClima.ultimasViagens.map((viagem, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{viagem.data}</td>
                          <td className="py-3 px-4 text-center">
                            <Badge cor={viagem.beaufort > 6 ? 'bg-red-500' : viagem.beaufort > 4 ? 'bg-yellow-500' : 'bg-green-500'}>
                              {viagem.beaufort}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge cor={viagem.seaCondition > 5 ? 'bg-red-500' : viagem.seaCondition > 3 ? 'bg-yellow-500' : 'bg-green-500'}>
                              {viagem.seaCondition}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center font-medium">{viagem.fuelPerNm.toFixed(3)}</td>
                          <td className="py-3 px-4 text-center">{viagem.speed.toFixed(1)} nós</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Cartao>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default PaginaDigitalTwin;
