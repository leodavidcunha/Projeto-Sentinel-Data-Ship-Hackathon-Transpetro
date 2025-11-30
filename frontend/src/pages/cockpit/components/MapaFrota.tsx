/**
 * Componente: Mapa da Frota
 * Visualizacao geografica com posicoes AIS dos navios - DADOS REAIS DA API
 * Usando Leaflet para mapa interativo com marcadores nativos
 */

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Cartao } from '../../../components/atoms/Cartao';
import { Badge } from '../../../components/atoms/Badge';
import { fetchNavios, NavioAPI } from '../../../services/api';

// Corrigir icones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Criar icones customizados para cada nivel de IBE
// Limites baseados na metodologia: CRITICO >30%, ALERTA 15-30%, ATENCAO 5-15%, NORMAL <=5%
const criarIconeNavio = (ibe: number, selecionado: boolean = false) => {
  let cor = '#10b981'; // verde - normal (<=5%)
  if (ibe > 30) cor = '#ef4444'; // vermelho - critico (>30%)
  else if (ibe > 15) cor = '#f59e0b'; // laranja - alerta (15-30%)
  else if (ibe > 5) cor = '#eab308'; // amarelo - atencao (5-15%)

  const tamanho = selecionado ? 40 : 28;
  const borda = selecionado ? 4 : 3;

  return L.divIcon({
    className: 'custom-ship-marker',
    html: `
      <div style="
        width: ${tamanho}px;
        height: ${tamanho}px;
        background-color: ${cor};
        border: ${borda}px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        ${selecionado ? 'animation: pulse 1.5s infinite;' : ''}
      ">
        <svg width="${tamanho * 0.5}" height="${tamanho * 0.5}" viewBox="0 0 24 24" fill="white">
          <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/>
        </svg>
      </div>
    `,
    iconSize: [tamanho, tamanho],
    iconAnchor: [tamanho / 2, tamanho / 2],
    popupAnchor: [0, -tamanho / 2],
  });
};

interface MapaFrotaProps {
  filtroClasse: string;
  filtroRisco: string;
}

// Componente para centralizar o mapa quando um navio e selecionado
const CentralizarMapa: React.FC<{ posicao: [number, number] | null }> = ({ posicao }) => {
  const map = useMap();
  useEffect(() => {
    if (posicao) {
      map.flyTo(posicao, 8, { duration: 1 });
    }
  }, [posicao, map]);
  return null;
};

export const MapaFrota: React.FC<MapaFrotaProps> = ({ filtroClasse, filtroRisco }) => {
  const [navioSelecionado, setNavioSelecionado] = useState<NavioAPI | null>(null);
  const [navios, setNavios] = useState<NavioAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarNavios = async () => {
      setLoading(true);
      const dados = await fetchNavios();
      setNavios(dados);
      setLoading(false);
    };
    carregarNavios();
  }, []);

  // Filtrar navios
  const naviosFiltrados = navios.filter(navio => {
    const passaClasse = filtroClasse === 'todos' || navio.classe === filtroClasse;
    const passaRisco = filtroRisco === 'todos' || navio.riscoNormam401 === filtroRisco;
    return passaClasse && passaRisco;
  });

  // Limites baseados na metodologia: CRITICO >30%, ALERTA 15-30%, ATENCAO 5-15%, NORMAL <=5%
  const getCorIBE = (ibe: number) => {
    if (ibe > 30) return 'bg-red-500';
    if (ibe > 15) return 'bg-amber-500';
    if (ibe > 5) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  // Centro do mapa - Costa do Brasil
  const centroInicial: [number, number] = [-15, -40];

  if (loading) {
    return (
      <Cartao titulo="Mapa AIS da Frota" padding="pequeno">
        <div className="relative w-full h-[600px] bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-50 rounded-lg overflow-hidden border-2 border-gray-300 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <i className="ri-loader-4-line text-4xl text-cyan-600 animate-spin"></i>
              <p className="mt-2 text-gray-600">Carregando posicoes AIS...</p>
            </div>
          </div>
        </div>
      </Cartao>
    );
  }

  return (
    <Cartao titulo="Mapa AIS da Frota" padding="pequeno">
      <div className="relative">
        {/* Estilos para animacao do marcador */}
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
            50% { transform: scale(1.1); box-shadow: 0 6px 20px rgba(0,0,0,0.5); }
          }
          .custom-ship-marker > div {
            transition: all 0.3s ease;
          }
          .custom-ship-marker:hover > div {
            transform: scale(1.2);
          }
          .leaflet-container {
            font-family: inherit;
          }
        `}</style>

        {/* Mapa Leaflet */}
        <div className="relative w-full h-[600px] rounded-lg overflow-hidden border-2 border-gray-300">
          <MapContainer
            center={centroInicial}
            zoom={4}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Centralizar quando selecionar navio */}
            <CentralizarMapa
              posicao={navioSelecionado ? [navioSelecionado.posicaoAtual.latitude, navioSelecionado.posicaoAtual.longitude] : null}
            />

            {/* Marcadores dos Navios */}
            {naviosFiltrados.map((navio) => (
              <Marker
                key={navio.id}
                position={[navio.posicaoAtual.latitude, navio.posicaoAtual.longitude]}
                icon={criarIconeNavio(navio.ibe, navioSelecionado?.id === navio.id)}
                eventHandlers={{
                  click: () => setNavioSelecionado(navio),
                }}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <h4 className="font-bold text-gray-900 mb-1">{navio.nome}</h4>
                    <p className="text-sm text-gray-600 mb-2">{navio.classe}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">IBE:</span>
                        <span className="ml-1 font-bold">{navio.ibe.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Risco:</span>
                        <span className="ml-1 font-bold">{navio.riscoNormam401}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span className="ml-1">{navio.statusOperacional}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Vel:</span>
                        <span className="ml-1">{navio.posicaoAtual.velocidade.toFixed(1)} nos</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Legenda IBI - Canto Superior Direito */}
          <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg">
            <p className="text-xs font-semibold text-gray-900 mb-3">Indice de Bioincrustacao (IBE)</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-sm flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">&gt;30%</p>
                  <p className="text-xs text-gray-600">Critico</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full border-2 border-white shadow-sm flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">15-30%</p>
                  <p className="text-xs text-gray-600">Alerta</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-white shadow-sm flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">5-15%</p>
                  <p className="text-xs text-gray-600">Atencao</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-emerald-500 rounded-full border-2 border-white shadow-sm flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">&le;5%</p>
                  <p className="text-xs text-gray-600">Normal</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info - Canto Superior Esquerdo */}
          <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg">
            <p className="text-xs font-semibold text-gray-900 mb-2">Mapa Interativo</p>
            <p className="text-xs text-gray-600">Navios: {naviosFiltrados.length}</p>
            <p className="text-xs text-gray-600">Dados: API Real</p>
            <p className="text-xs text-gray-500 mt-2">Arraste para mover</p>
            <p className="text-xs text-gray-500">Scroll para zoom</p>
          </div>
        </div>

        {/* Painel de Detalhes do Navio Selecionado */}
        {navioSelecionado && (
          <div className="mt-4 bg-white border-2 border-gray-300 rounded-xl p-5 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${getCorIBE(navioSelecionado.ibe)} rounded-full border-3 border-white shadow-lg flex items-center justify-center`}>
                  <i className="ri-ship-fill text-white text-xl"></i>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{navioSelecionado.nome}</h4>
                  <p className="text-sm text-gray-600">{navioSelecionado.classe}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variante={navioSelecionado.ibe > 30 ? 'perigo' : navioSelecionado.ibe > 15 ? 'aviso' : 'sucesso'}>
                      {navioSelecionado.riscoNormam401}
                    </Badge>
                    <span className="text-xs text-gray-600">{navioSelecionado.statusOperacional}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setNavioSelecionado(null)}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">IBE Atual</p>
                <p className="text-2xl font-bold text-gray-900">{navioSelecionado.ibe.toFixed(1)}%</p>
                <p className="text-xs text-gray-600 mt-1">Indice de Bioincrustacao</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Consumo Real</p>
                <p className="text-2xl font-bold text-gray-900">{navioSelecionado.consumoReal.toFixed(1)}</p>
                <p className="text-xs text-red-600 mt-1">+{navioSelecionado.deltaFuelNm.toFixed(1)} t/d extra</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Velocidade</p>
                <p className="text-2xl font-bold text-gray-900">{navioSelecionado.posicaoAtual.velocidade.toFixed(1)}</p>
                <p className="text-xs text-gray-600 mt-1">nos</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Posicao</p>
                <p className="text-sm font-bold text-gray-900">{navioSelecionado.posicaoAtual.latitude.toFixed(2)}°</p>
                <p className="text-sm font-bold text-gray-900">{navioSelecionado.posicaoAtual.longitude.toFixed(2)}°</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Dias Docagem</p>
                <p className="text-2xl font-bold text-gray-900">{navioSelecionado.diasDesdeUltimaLimpeza}</p>
                <p className="text-xs text-gray-600 mt-1">dias</p>
              </div>
            </div>

            {/* Informacoes Adicionais */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <i className="ri-compass-3-line text-cyan-600 text-lg"></i>
                <div>
                  <p className="text-xs text-gray-600">Rumo</p>
                  <p className="text-sm font-bold text-gray-900">{navioSelecionado.posicaoAtual.rumo.toFixed(0)}°</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <i className="ri-money-dollar-circle-line text-cyan-600 text-lg"></i>
                <div>
                  <p className="text-xs text-gray-600">Economia Potencial</p>
                  <p className="text-sm font-bold text-gray-900">R$ {(navioSelecionado.economiaAnual / 1000).toFixed(0)}k/ano</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <i className="ri-leaf-line text-cyan-600 text-lg"></i>
                <div>
                  <p className="text-xs text-gray-600">CO2 Extra</p>
                  <p className="text-sm font-bold text-gray-900">{navioSelecionado.emissoesCO2Perdidas.toFixed(0)} t/ano</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estatisticas do Mapa - HORIZONTAL ABAIXO DO MAPA */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <i className="ri-ship-line text-cyan-600 text-xl"></i>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Navios Exibidos</p>
                <p className="text-2xl font-bold text-gray-900">{naviosFiltrados.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-dashboard-line text-blue-600 text-xl"></i>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">IBE Medio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {naviosFiltrados.length > 0 ? Math.round(naviosFiltrados.reduce((acc, n) => acc + n.ibe, 0) / naviosFiltrados.length) : 0}%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="ri-alert-line text-red-600 text-xl"></i>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Alto Risco</p>
                <p className="text-2xl font-bold text-gray-900">
                  {naviosFiltrados.filter(n => n.riscoNormam401 === 'Alto' || n.riscoNormam401 === 'Critico').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <i className="ri-navigation-line text-emerald-600 text-xl"></i>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Navegando</p>
                <p className="text-2xl font-bold text-gray-900">
                  {naviosFiltrados.filter(n => n.statusOperacional === 'Navegando').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <i className="ri-gas-station-line text-amber-600 text-xl"></i>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Consumo Medio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {naviosFiltrados.length > 0 ? (naviosFiltrados.reduce((acc, n) => acc + n.consumoReal, 0) / naviosFiltrados.length).toFixed(1) : 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-leaf-line text-green-600 text-xl"></i>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Emissoes CO2</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(naviosFiltrados.reduce((acc, n) => acc + n.emissoesCO2Perdidas, 0) / 1000).toFixed(1)}kt
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Cartao>
  );
};
