/**
 * Componente: Explicacao das Metricas de Consumo e CO2
 * Banner informativo explicando como sao calculados consumo extra e emissoes
 */

import React, { useState } from 'react';

export const ExplicacaoMetricas: React.FC = () => {
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/30 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="ri-gas-station-line text-amber-600 text-xl"></i>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Como calculamos o Consumo Extra e Emissoes de CO2?
            </h3>
            <p className="text-sm text-gray-700">
              O <strong>Consumo Extra</strong> representa o combustivel adicional gasto devido a bioincrustacao no casco.
              As <strong>Emissoes de CO2</strong> sao calculadas a partir desse consumo extra.
            </p>

            {expandido && (
              <div className="mt-4 space-y-4">
                {/* Formula Consumo Extra */}
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="ri-gas-station-line text-amber-600"></i>
                    <p className="text-xs font-semibold text-gray-700">Consumo Extra (t/dia)</p>
                  </div>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-800 block">
                    Consumo Extra = Consumo Base × (IBE / 100)
                  </code>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Consumo Base:</strong> Mediana do consumo nos primeiros 6 meses apos docagem (casco limpo)
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>IBE:</strong> Indice de Bioincrustacao Estimado em percentual
                  </p>
                </div>

                {/* Formula CO2 */}
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="ri-leaf-line text-emerald-600"></i>
                    <p className="text-xs font-semibold text-gray-700">Emissoes CO2 Extra (t/ano)</p>
                  </div>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-800 block">
                    CO2 Extra = Consumo Extra (t/dia) × 365 dias × 3.2
                  </code>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Fator 3.2:</strong> Fator de conversao IMO (1 ton combustivel = 3.2 ton CO2)
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>365 dias:</strong> Projecao anual do excesso de emissoes
                  </p>
                </div>

                {/* Exemplo pratico */}
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <p className="text-xs font-semibold text-amber-800 mb-2">Exemplo Pratico:</p>
                  <p className="text-xs text-amber-700">
                    Um navio com <strong>consumo base de 40 t/dia</strong> e <strong>IBE de 30%</strong>:
                  </p>
                  <ul className="text-xs text-amber-700 mt-2 space-y-1">
                    <li>• Consumo Extra = 40 × 0.30 = <strong>12 t/dia</strong></li>
                    <li>• CO2 Extra/Ano = 12 × 365 × 3.2 = <strong>14.016 t CO2/ano</strong></li>
                    <li>• Custo Extra = 12 × R$ 5.500/t = <strong>R$ 66.000/dia</strong></li>
                  </ul>
                </div>

                {/* Nota sobre ordenacao */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs font-semibold text-blue-800 mb-1">Sobre a ordenacao:</p>
                  <p className="text-xs text-blue-700">
                    Como o consumo extra e o CO2 sao calculados proporcionalmente ao IBE,
                    a ordenacao por esses criterios geralmente produz a mesma sequencia.
                    A diferenca aparece quando navios tem consumos base diferentes.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setExpandido(!expandido)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors cursor-pointer"
        >
          {expandido ? 'Menos' : 'Saiba mais'}
          <i className={`ri-arrow-${expandido ? 'up' : 'down'}-s-line`}></i>
        </button>
      </div>
    </div>
  );
};
