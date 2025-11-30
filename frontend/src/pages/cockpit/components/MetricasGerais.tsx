/**
 * Componente: Metricas Gerais
 * Cards com indicadores principais da frota - DADOS REAIS DA API
 */

import React, { useEffect, useState } from 'react';
import { fetchMetricas, MetricasAPI } from '../../../services/api';

export const MetricasGerais: React.FC = () => {
  const [metricas, setMetricas] = useState<MetricasAPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarMetricas = async () => {
      setLoading(true);
      const dados = await fetchMetricas();
      setMetricas(dados);
      setLoading(false);
    };
    carregarMetricas();
  }, []);

  const getCorClasses = (cor: string) => {
    const cores: Record<string, { bg: string; text: string; border: string }> = {
      cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-600', border: 'border-cyan-500/30' },
      amber: { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/30' },
      red: { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/30' },
      emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/30' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-600', border: 'border-orange-500/30' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/30' },
    };
    return cores[cor] || cores.cyan;
  };

  // Dados das metricas (usando API ou valores padrao)
  const metricasCards = [
    {
      titulo: 'Frota Ativa',
      valor: metricas?.frotaAtiva?.toString() || '21',
      unidade: 'navios',
      icone: 'ri-ship-line',
      cor: 'cyan',
      tendencia: '',
    },
    {
      titulo: 'IBE Medio',
      valor: metricas?.ibeMedio?.toFixed(1) || '0',
      unidade: '%',
      icone: 'ri-bar-chart-box-line',
      cor: 'amber',
      tendencia: '',
    },
    {
      titulo: 'Excesso de Consumo',
      valor: metricas?.excessoConsumoMensal?.toFixed(0) || '0',
      unidade: 't/mes',
      icone: 'ri-gas-station-line',
      cor: 'red',
      tendencia: '',
    },
    {
      titulo: 'Emissoes Fouling',
      valor: metricas?.emissoesFouling?.toFixed(1) || '0',
      unidade: 'kt CO2/ano',
      icone: 'ri-leaf-line',
      cor: 'emerald',
      tendencia: '',
    },
    {
      titulo: 'Risco NORMAM-401',
      valor: metricas?.naviosRiscoNormam?.toString() || '0',
      unidade: 'navios',
      icone: 'ri-alert-line',
      cor: 'orange',
      tendencia: `${metricas?.naviosCriticos || 0} criticos`,
    },
    {
      titulo: 'Economia Potencial',
      valor: `R$ ${((metricas?.economiaPotencialAnual || 0) / 1000000).toFixed(1)}`,
      unidade: 'mi/ano',
      icone: 'ri-money-dollar-circle-line',
      cor: 'blue',
      tendencia: '',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 animate-pulse">
            <div className="h-8 w-8 bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-6 bg-gray-200 rounded mb-1"></div>
            <div className="h-4 bg-gray-100 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {metricasCards.map((metrica) => {
        const cores = getCorClasses(metrica.cor);
        return (
          <div
            key={metrica.titulo}
            className="bg-white backdrop-blur-sm border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className={`w-8 h-8 ${cores.bg} rounded-lg flex items-center justify-center`}>
                <i className={`${metrica.icone} ${cores.text} text-base`}></i>
              </div>
              {metrica.tendencia && (
                <span className="text-gray-500 text-xs font-medium">{metrica.tendencia}</span>
              )}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900">{metrica.valor}</span>
                <span className="text-xs text-gray-600">{metrica.unidade}</span>
              </div>
              <p className="text-xs text-gray-600">{metrica.titulo}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
