/**
 * Componente: Lista de Navios
 * Ranking e lista detalhada dos navios - DADOS REAIS DA API
 */

import React, { useState, useEffect } from 'react';
import { Cartao } from '../../../components/atoms/Cartao';
import { Badge } from '../../../components/atoms/Badge';
import { fetchNavios, NavioAPI } from '../../../services/api';

interface ListaNaviosProps {
  filtroClasse: string;
  filtroRisco: string;
}

export const ListaNavios: React.FC<ListaNaviosProps> = ({ filtroClasse, filtroRisco }) => {
  const [ordenacao, setOrdenacao] = useState<'ibe' | 'consumo' | 'emissoes'>('ibe');
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

  // Filtrar e ordenar navios
  let naviosFiltrados = navios.filter(navio => {
    const passaClasse = filtroClasse === 'todos' || navio.classe === filtroClasse;
    const passaRisco = filtroRisco === 'todos' || navio.riscoNormam401 === filtroRisco;
    return passaClasse && passaRisco;
  });

  // Ordenar
  naviosFiltrados = [...naviosFiltrados].sort((a, b) => {
    if (ordenacao === 'ibe') return b.ibe - a.ibe;
    if (ordenacao === 'consumo') return b.deltaFuelNm - a.deltaFuelNm;
    if (ordenacao === 'emissoes') return b.emissoesCO2Perdidas - a.emissoesCO2Perdidas;
    return 0;
  });

  const getVarianteBadge = (risco: string) => {
    if (risco === 'Critico') return 'perigo';
    if (risco === 'Alto') return 'aviso';
    if (risco === 'Medio') return 'info';
    return 'sucesso';
  };

  if (loading) {
    return (
      <Cartao titulo="Ranking da Frota" padding="pequeno">
        <div className="space-y-2 px-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </Cartao>
    );
  }

  return (
    <Cartao titulo="Ranking da Frota" padding="pequeno">
      {/* Controles de Ordenacao */}
      <div className="flex items-center gap-2 mb-4 px-4">
        <span className="text-xs text-gray-700">Ordenar por:</span>
        <button
          onClick={() => setOrdenacao('ibe')}
          className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap ${
            ordenacao === 'ibe'
              ? 'bg-cyan-500/20 text-cyan-700 border border-cyan-500/30'
              : 'bg-gray-100 text-gray-700 hover:text-gray-900'
          }`}
        >
          IBE
        </button>
        <button
          onClick={() => setOrdenacao('consumo')}
          className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap ${
            ordenacao === 'consumo'
              ? 'bg-cyan-500/20 text-cyan-700 border border-cyan-500/30'
              : 'bg-gray-100 text-gray-700 hover:text-gray-900'
          }`}
        >
          Consumo
        </button>
        <button
          onClick={() => setOrdenacao('emissoes')}
          className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap ${
            ordenacao === 'emissoes'
              ? 'bg-cyan-500/20 text-cyan-700 border border-cyan-500/30'
              : 'bg-gray-100 text-gray-700 hover:text-gray-900'
          }`}
        >
          Emissoes
        </button>
      </div>

      {/* Lista de Navios */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto px-4">
        {naviosFiltrados.map((navio, index) => (
          <div
            key={navio.id}
            className="bg-white hover:bg-gray-50 border border-gray-200 hover:border-cyan-500/30 rounded-lg p-2 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex items-start gap-2 flex-1">
                <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-cyan-600">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-0.5">
                    <h4 className="text-xs font-semibold text-gray-900">{navio.nome}</h4>
                    <Badge variante={getVarianteBadge(navio.riscoNormam401)} tamanho="pequeno">
                      {navio.riscoNormam401}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{navio.classe} • {navio.diasDesdeUltimaLimpeza} dias desde docagem</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{navio.ibe.toFixed(1)}</p>
                <p className="text-xs text-gray-600">IBE %</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-1.5 pt-1.5 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Consumo Extra</p>
                <p className="text-xs font-medium text-red-600">+{navio.deltaFuelNm.toFixed(1)} t/d</p>
                <p className="text-xs text-gray-500">Base: {navio.consumoReal.toFixed(1)} t/d</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-0.5">CO2 Extra/Ano</p>
                <p className="text-xs font-medium text-red-600">+{navio.emissoesCO2Perdidas.toFixed(0)} t</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Status</p>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    navio.statusOperacional === 'Navegando' ? 'bg-emerald-500' :
                    navio.statusOperacional === 'Atracado' ? 'bg-blue-500' :
                    navio.statusOperacional === 'Fundeado' ? 'bg-amber-500' :
                    'bg-slate-500'
                  }`}></div>
                  <p className="text-xs text-gray-700">{navio.statusOperacional}</p>
                </div>
              </div>
            </div>

            {/* Barra de Progresso IBE */}
            <div className="mt-1.5">
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    navio.ibe >= 80 ? 'bg-red-500' :
                    navio.ibe >= 60 ? 'bg-amber-500' :
                    navio.ibe >= 40 ? 'bg-yellow-500' :
                    'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(navio.ibe, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {naviosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-ship-line text-4xl text-gray-400 mb-3"></i>
          <p className="text-gray-600">Nenhum navio encontrado com os filtros selecionados</p>
        </div>
      )}
    </Cartao>
  );
};
