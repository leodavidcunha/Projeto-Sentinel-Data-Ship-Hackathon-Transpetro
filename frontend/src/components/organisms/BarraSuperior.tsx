/**
 * Componente: Barra Superior
 * Header com informações contextuais e ações rápidas
 */

import React, { useState } from 'react';
import { Badge } from '../atoms/Badge';

export const BarraSuperior: React.FC = () => {
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-64 z-30">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Informações Contextuais */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-transpetro-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-700">Sistema Online</span>
          </div>
          <div className="h-6 w-px bg-slate-300"></div>
          <div className="flex items-center gap-2">
            <i className="ri-ship-line text-transpetro-green-600"></i>
            <span className="text-sm text-slate-700">21 Navios Ativos</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="ri-time-line text-slate-500"></i>
            <span className="text-sm text-slate-500">Última atualização: há 2 min</span>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="flex items-center gap-3">
          {/* Alertas Críticos */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
            <i className="ri-alert-line text-red-600"></i>
            <span className="text-sm text-red-600 font-medium">3 Alertas Críticos</span>
          </div>

          {/* Notificações */}
          <div className="relative">
            <button
              onClick={() => setMostrarNotificacoes(!mostrarNotificacoes)}
              className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer relative"
            >
              <i className="ri-notification-3-line text-xl"></i>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {mostrarNotificacoes && (
              <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-lg shadow-xl">
                <div className="p-4 border-b border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-800">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className="ri-alert-line text-red-600"></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-800">IBI Crítico - Transpetro Bahia</p>
                        <p className="text-xs text-slate-500 mt-1">há 15 minutos</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className="ri-file-warning-line text-amber-600"></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-800">Certificado vencendo em 10 dias</p>
                        <p className="text-xs text-slate-500 mt-1">há 1 hora</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Busca Rápida */}
          <button className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
            <i className="ri-search-line text-xl"></i>
          </button>

          {/* Configurações */}
          <button className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
            <i className="ri-settings-3-line text-xl"></i>
          </button>
        </div>
      </div>
    </header>
  );
};
