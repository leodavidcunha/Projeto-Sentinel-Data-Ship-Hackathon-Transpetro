/**
 * Componente: Input Base
 * Campo de entrada reutilizável
 */

import React from 'react';

interface InputProps {
  tipo?: 'text' | 'number' | 'email' | 'password' | 'date' | 'time';
  valor?: string | number;
  onChange?: (valor: string) => void;
  placeholder?: string;
  label?: string;
  erro?: string;
  desabilitado?: boolean;
  obrigatorio?: boolean;
  icone?: React.ReactNode;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  tipo = 'text',
  valor,
  onChange,
  placeholder,
  label,
  erro,
  desabilitado = false,
  obrigatorio = false,
  icone,
  className = ''
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-300">
          {label}
          {obrigatorio && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icone && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icone}
          </div>
        )}
        <input
          type={tipo}
          value={valor}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={desabilitado}
          required={obrigatorio}
          className={`
            w-full bg-slate-900/50 border rounded-lg
            px-4 py-2.5 text-sm text-white
            ${icone ? 'pl-10' : ''}
            ${erro ? 'border-red-500/50' : 'border-slate-700/50'}
            focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
          `}
        />
      </div>
      {erro && (
        <span className="text-xs text-red-400">{erro}</span>
      )}
    </div>
  );
};
