/**
 * Componente: Cartão Base
 * Cartão reutilizável para conteúdo
 */

import React from 'react';

interface CartaoProps {
  children: React.ReactNode;
  titulo?: string;
  subtitulo?: string;
  acoes?: React.ReactNode;
  hover?: boolean;
  padding?: 'pequeno' | 'medio' | 'grande';
  className?: string;
  onClick?: () => void;
}

export const Cartao: React.FC<CartaoProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {children}
    </div>
  );
};
