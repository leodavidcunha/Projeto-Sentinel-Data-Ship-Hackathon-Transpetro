/**
 * Componente: Navegação Lateral
 * Menu de navegação principal da plataforma
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface ItemMenu {
  icone: string;
  titulo: string;
  caminho: string;
  descricao: string;
}

export const NavegacaoLateral: React.FC = () => {
  const location = useLocation();
  const [expandido, setExpandido] = useState(true);

  const itensMenu: ItemMenu[] = [
    {
      icone: 'ri-dashboard-line',
      titulo: 'Dashboard da Frota',
      caminho: '/app/cockpit',
      descricao: 'Visão geral da frota'
    },
    {
      icone: 'ri-bar-chart-box-line',
      titulo: 'Índice IBE',
      caminho: '/app/ibi',
      descricao: 'Índice de Bioincrustação Estimado'
    },
    {
      icone: 'ri-ship-line',
      titulo: 'Análise por Navio',
      caminho: '/app/digital-twin',
      descricao: 'Detalhes e análise individual'
    },
    { 
      icone: 'ri-line-chart-line', 
      titulo: 'Previsão de Fouling', 
      caminho: '/app/previsao',
      descricao: 'Previsão de incrustação'
    },
    { 
      icone: 'ri-shield-check-line', 
      titulo: 'Compliance NORMAM-401', 
      caminho: '/app/compliance',
      descricao: 'Conformidade regulatória'
    },
    { 
      icone: 'ri-tools-line', 
      titulo: 'Manutenção & Limpeza', 
      caminho: '/app/manutencao',
      descricao: 'Gestão de manutenção'
    },
    { 
      icone: 'ri-leaf-line', 
      titulo: 'ESG & Descarbonização', 
      caminho: '/app/esg',
      descricao: 'Sustentabilidade'
    },
    { 
      icone: 'ri-database-2-line', 
      titulo: 'DataSet', 
      caminho: '/app/ingestao',
      descricao: 'Ingestão de dados'
    },
    { 
      icone: 'ri-notification-3-line', 
      titulo: 'Alertas & Automação', 
      caminho: '/app/alertas',
      descricao: 'Sistema de alertas'
    }
  ];

  const estaAtivo = (rota: string) => location.pathname === rota;

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-white border-r border-slate-200
        transition-all duration-300 z-40
        ${expandido ? 'w-64' : 'w-20'}
      `}
    >
      {/* Logo e Toggle */}
      <div className="h-20 flex items-center justify-center px-6 border-b border-gray-200">
        <img 
          src="https://static.readdy.ai/image/5da477fdae7b1d111ee386eccbf37db2/732a02039d321f0d322d28065ca5f71b.png" 
          alt="Sentinel Data Ship" 
          className="h-14 w-auto"
        />
      </div>

      {/* Menu Items */}
      <nav className="p-3 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
        {itensMenu.map((item) => (
          <Link
            key={item.caminho}
            to={item.caminho}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg
              transition-all duration-200 cursor-pointer group
              ${estaAtivo(item.caminho)
                ? 'bg-transpetro-green-50 text-transpetro-green-700 border border-transpetro-green-200'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }
            `}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={`${item.icone} text-lg`}></i>
            </div>
            {expandido && (
              <span className="text-sm font-medium flex-1 whitespace-nowrap">{item.titulo}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      {expandido && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-transpetro-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">TP</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">Transpetro</p>
              <p className="text-xs text-slate-500">Sistema Operacional</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
