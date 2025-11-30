/**
 * Layout Principal da Plataforma
 */

import React, { Suspense } from 'react';
import { NavegacaoLateral } from '../organisms/NavegacaoLateral';
import { BarraSuperior } from '../organisms/BarraSuperior';
import { Outlet } from 'react-router-dom';

export const LayoutPrincipal: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <NavegacaoLateral />
      <div className="flex-1 flex flex-col ml-64">
        <BarraSuperior />
        <main className="flex-1 overflow-auto mt-16 bg-gray-50">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-transpetro-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-700">Carregando...</p>
              </div>
            </div>
          }>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default LayoutPrincipal;
