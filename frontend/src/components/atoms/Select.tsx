/**
 * Componente: Select Base
 * Campo de seleção reutilizável
 */

import React from 'react';

interface OpcaoSelect {
  valor: string | number;
  label: string;
}

interface SelectProps {
  valor?: string | number;
  onChange?: (valor: string) => void;
  opcoes: OpcaoSelect[];
  placeholder?: string;
  label?: string;
  erro?: string;
  desabilitado?: boolean;
  obrigatorio?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  valor,
  onChange,
  opcoes,
  placeholder = 'Selecione...',
  label,
  erro,
  desabilitado = false,
  obrigatorio = false,
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
      <select
        value={valor}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={desabilitado}
        required={obrigatorio}
        className={`
          w-full bg-slate-900/50 border rounded-lg
          px-4 py-2.5 text-sm text-white
          ${erro ? 'border-red-500/50' : 'border-slate-700/50'}
          focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
          cursor-pointer
        `}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {opcoes.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.label}
          </option>
        ))}
      </select>
      {erro && (
        <span className="text-xs text-red-400">{erro}</span>
      )}
    </div>
  );
};
