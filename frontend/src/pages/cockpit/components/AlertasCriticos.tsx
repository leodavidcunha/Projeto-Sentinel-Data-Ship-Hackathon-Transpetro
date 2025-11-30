/**
 * Componente: Alertas Criticos
 * Banner com alertas mais urgentes - DADOS REAIS DA API
 */

import React, { useEffect, useState } from 'react';
import { fetchAlertas, AlertaAPI } from '../../../services/api';

export const AlertasCriticos: React.FC = () => {
  const [alertas, setAlertas] = useState<AlertaAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarAlertas = async () => {
      setLoading(true);
      const dados = await fetchAlertas();
      setAlertas(dados.slice(0, 3)); // Top 3 alertas
      setLoading(false);
    };
    carregarAlertas();
  }, []);

  const getIcone = (tipo: string) => {
    if (tipo.includes('Limpeza')) return 'ri-brush-line';
    if (tipo.includes('Agendar')) return 'ri-calendar-line';
    return 'ri-alert-line';
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-red-500/20 rounded-lg animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-2 bg-white rounded-lg border border-gray-200 animate-pulse">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-1"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (alertas.length === 0) {
    return (
      <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <i className="ri-checkbox-circle-line text-emerald-400 text-sm"></i>
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Nenhum alerta critico no momento</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-red-500/20 rounded-lg flex items-center justify-center">
          <i className="ri-alarm-warning-line text-red-400 text-sm"></i>
        </div>
        <h3 className="text-sm font-semibold text-gray-900">Alertas Criticos</h3>
        <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-medium">
          {alertas.length}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {alertas.map((alerta) => (
          <div
            key={alerta.id}
            className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 hover:border-red-500/50 transition-all cursor-pointer"
          >
            <div className="w-7 h-7 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className={`${getIcone(alerta.tipo)} text-red-400 text-sm`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{alerta.titulo}</p>
              <p className="text-xs text-gray-600">{alerta.tipo}</p>
            </div>
            <span className="text-xs font-bold text-red-600 whitespace-nowrap">{alerta.prazo}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
