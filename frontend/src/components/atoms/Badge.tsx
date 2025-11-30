/**
 * Componente: Badge
 * Etiqueta para status e categorias
 */

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variante?: 'padrao' | 'sucesso' | 'aviso' | 'perigo' | 'info' | 'neutro';
  tamanho?: 'pequeno' | 'medio';
  icone?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variante = 'padrao',
  tamanho = 'medio',
  icone,
  className = ''
}) => {
  const varianteClasses = {
    padrao: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    sucesso: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    aviso: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    perigo: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    neutro: 'bg-slate-700/50 text-slate-300 border-slate-600/30'
  };

  const tamanhoClasses = {
    pequeno: 'px-2 py-0.5 text-xs',
    medio: 'px-2.5 py-1 text-sm'
  };

  return (
    <span
      className={`
        ${varianteClasses[variante]}
        ${tamanhoClasses[tamanho]}
        inline-flex items-center gap-1.5
        border rounded-full font-medium whitespace-nowrap
        ${className}
      `}
    >
      {icone && <span className="flex items-center justify-center">{icone}</span>}
      {children}
    </span>
  );
};
