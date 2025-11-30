/**
 * Componente: Botão Base
 * Botão reutilizável com variantes de estilo
 */

import React from 'react';

interface BotaoProps {
  children: React.ReactNode;
  variante?: 'primario' | 'secundario' | 'perigo' | 'sucesso' | 'fantasma';
  tamanho?: 'pequeno' | 'medio' | 'grande';
  larguraCompleta?: boolean;
  desabilitado?: boolean;
  icone?: React.ReactNode;
  onClick?: () => void;
  tipo?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const Botao: React.FC<BotaoProps> = ({
  children,
  variante = 'primario',
  tamanho = 'medio',
  larguraCompleta = false,
  desabilitado = false,
  icone,
  onClick,
  tipo = 'button',
  className = ''
}) => {
  const varianteClasses = {
    primario: 'bg-cyan-500 hover:bg-cyan-600 text-white',
    secundario: 'bg-slate-700 hover:bg-slate-600 text-white',
    perigo: 'bg-red-600 hover:bg-red-700 text-white',
    sucesso: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    fantasma: 'bg-transparent hover:bg-slate-800 text-cyan-400 border border-cyan-500/30'
  };

  const tamanhoClasses = {
    pequeno: 'px-3 py-1.5 text-sm',
    medio: 'px-4 py-2 text-sm',
    grande: 'px-6 py-3 text-base'
  };

  return (
    <button
      type={tipo}
      onClick={onClick}
      disabled={desabilitado}
      className={`
        ${varianteClasses[variante]}
        ${tamanhoClasses[tamanho]}
        ${larguraCompleta ? 'w-full' : ''}
        ${desabilitado ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        rounded-lg font-medium transition-all duration-200
        flex items-center justify-center gap-2
        whitespace-nowrap
        ${className}
      `}
    >
      {icone && <span className="flex items-center justify-center">{icone}</span>}
      {children}
    </button>
  );
};
