/**
 * Componente: Explicacao do IBE
 * Banner informativo explicando o que e o IBE para o usuario
 */

import React, { useState } from 'react';

export const ExplicacaoIBE: React.FC = () => {
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="ri-information-line text-cyan-600 text-xl"></i>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              O que e o IBE (Indice de Bioincrustacao Estimado)?
            </h3>
            <p className="text-sm text-gray-700">
              O IBE mede o <strong>aumento percentual do consumo de combustivel</strong> causado pela bioincrustacao (sujeira biologica) no casco do navio.
            </p>

            {expandido && (
              <div className="mt-4 space-y-4">
                {/* Formula */}
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Formula:</p>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">
                    IBE (%) = ((Consumo Atual - Baseline) / Baseline) x 100
                  </code>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Baseline:</strong> Mediana do consumo nos primeiros 6 meses apos docagem (casco limpo)
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Atual:</strong> Mediana do consumo nos ultimos 3 meses
                  </p>
                </div>

                {/* Classificacao */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Classificacao de Risco:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-200">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                      <div>
                        <p className="text-xs font-medium text-emerald-800">Normal</p>
                        <p className="text-xs text-emerald-600">IBE &le; 5%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-yellow-50 rounded-lg px-3 py-2 border border-yellow-200">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="text-xs font-medium text-yellow-800">Atencao</p>
                        <p className="text-xs text-yellow-600">5% - 15%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-3 py-2 border border-orange-200">
                      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                      <div>
                        <p className="text-xs font-medium text-orange-800">Alerta</p>
                        <p className="text-xs text-orange-600">15% - 30%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-red-50 rounded-lg px-3 py-2 border border-red-200">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <div>
                        <p className="text-xs font-medium text-red-800">Critico</p>
                        <p className="text-xs text-red-600">IBE &gt; 30%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Como consumo e emissoes sao calculados */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="ri-gas-station-line text-amber-600"></i>
                      <p className="text-xs font-semibold text-gray-700">Consumo Extra</p>
                    </div>
                    <p className="text-xs text-gray-600">
                      Combustivel adicional gasto por causa do casco sujo.
                    </p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 block mt-2">
                      Consumo Extra = Consumo Base x (IBE / 100)
                    </code>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="ri-leaf-line text-green-600"></i>
                      <p className="text-xs font-semibold text-gray-700">Emissoes CO2</p>
                    </div>
                    <p className="text-xs text-gray-600">
                      CO2 extra emitido pelo consumo adicional de combustivel.
                    </p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 block mt-2">
                      CO2 = Consumo Extra x 3.2 (fator IMO)
                    </code>
                  </div>
                </div>

                {/* Exemplo pratico */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs font-semibold text-blue-800 mb-2">Exemplo Pratico:</p>
                  <p className="text-xs text-blue-700">
                    Um navio com <strong>IBE de 30%</strong> esta gastando 30% mais combustivel do que deveria.
                    Se o consumo normal e 40 ton/dia, ele esta gastando 52 ton/dia (+12 ton/dia extra).
                    Isso representa ~R$ 66.000/dia de prejuizo e ~38 ton CO2/dia a mais.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setExpandido(!expandido)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-cyan-700 bg-cyan-100 hover:bg-cyan-200 rounded-lg transition-colors cursor-pointer"
        >
          {expandido ? 'Menos' : 'Saiba mais'}
          <i className={`ri-arrow-${expandido ? 'up' : 'down'}-s-line`}></i>
        </button>
      </div>
    </div>
  );
};
