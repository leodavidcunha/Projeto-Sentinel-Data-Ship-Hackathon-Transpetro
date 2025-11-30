/**
 * Página: Dashboard da Frota
 * Dashboard principal com mapa AIS e visão geral da frota
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutPrincipal from '../../components/templates/LayoutPrincipal';
import { MapaFrota } from './components/MapaFrota';
import { ListaNavios } from './components/ListaNavios';
import { MetricasGerais } from './components/MetricasGerais';
import { ExplicacaoIBE } from './components/ExplicacaoIBE';
import { ExplicacaoMetricas } from './components/ExplicacaoMetricas';
import { useSEO, generateWebPageSchema } from '../../utils/seo';

const PaginaCockpit = () => {
  const navigate = useNavigate();
  const [filtroClasse, setFiltroClasse] = useState('todos');
  const [filtroRisco, setFiltroRisco] = useState('todos');
  const [menuDashboardsAberto, setMenuDashboardsAberto] = useState(false);

  // SEO
  useSEO({
    title: 'Dashboard da Frota - Sentinel Data Ship',
    description: 'Visão geral da frota em tempo real com monitoramento AIS, métricas operacionais e alertas críticos de bioincrustação',
    keywords: 'dashboard, frota, monitoramento, AIS, navios, tempo real',
    schema: generateWebPageSchema(
      'Dashboard da Frota - Sentinel Data Ship',
      'Visão geral da frota em tempo real com monitoramento AIS, métricas operacionais e alertas críticos de bioincrustação',
      '/cockpit'
    )
  });

  const dashboards = [
    { id: 'executivo', label: 'Dashboard Executivo', icone: 'ri-pie-chart-line', rota: '/app/dashboard-executivo', cor: 'text-blue-600' },
    { id: 'engenharia', label: 'Dashboard Engenharia', icone: 'ri-settings-3-line', rota: '/app/dashboard-engenharia', cor: 'text-indigo-600' },
    { id: 'operacional', label: 'Dashboard Operacional', icone: 'ri-compass-3-line', rota: '/app/dashboard-operacional', cor: 'text-cyan-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard da Frota</h1>
            <p className="text-gray-600">Visão geral da frota em tempo real</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Botão Dashboards com Menu Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setMenuDashboardsAberto(!menuDashboardsAberto)}
                className="px-6 py-3 bg-transpetro-green-600 text-white rounded-lg font-medium hover:bg-transpetro-green-700 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer"
              >
                <i className="ri-dashboard-3-line"></i>
                Dashboards
                <i className={`ri-arrow-${menuDashboardsAberto ? 'up' : 'down'}-s-line text-sm`}></i>
              </button>

              {/* Menu Dropdown */}
              {menuDashboardsAberto && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {dashboards.map((dashboard) => (
                    <button
                      key={dashboard.id}
                      onClick={() => {
                        navigate(dashboard.rota);
                        setMenuDashboardsAberto(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                    >
                      <div className={`w-10 h-10 flex items-center justify-center ${dashboard.cor} bg-gray-50 rounded-lg`}>
                        <i className={`${dashboard.icone} text-xl`}></i>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{dashboard.label}</div>
                        <div className="text-xs text-gray-500">
                          {dashboard.id === 'executivo' && 'Visão estratégica'}
                          {dashboard.id === 'engenharia' && 'Análise técnica'}
                          {dashboard.id === 'operacional' && 'Gestão diária'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer">
              <i className="ri-download-line mr-2"></i>
              Exportar Relatório
            </button>
          </div>
        </div>

        {/* Métricas Gerais */}
        <MetricasGerais />

        {/* Explicacao do IBE */}
        <ExplicacaoIBE />

        {/* Mapa em largura total */}
        <div className="w-full">
          <MapaFrota filtroClasse={filtroClasse} filtroRisco={filtroRisco} />
        </div>

        {/* Explicacao de Consumo e CO2 */}
        <ExplicacaoMetricas />

        {/* Lista de Navios abaixo do mapa */}
        <div className="w-full">
          <ListaNavios filtroClasse={filtroClasse} filtroRisco={filtroRisco} />
        </div>
      </div>
    </div>
  );
};

export default PaginaCockpit;
