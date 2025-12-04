import React, { useState, useEffect } from 'react';
import { InputField } from '../../common/InputField';
import { ResultDisplay } from '../../common/ResultDisplay';
import { FormulaDisplay } from '../../common/FormulaDisplay';
import { HelpTooltip } from '../../common/HelpTooltip';
import { calculateAirLoadMass } from '../../../lib/calculations/ts-parameters';
import { useCalculatorState } from '../../../contexts/CalculatorStateContext';

export const AirLoadMassPage: React.FC = () => {
  const { states, updateTSParameterState } = useCalculatorState();
  const tsState = states.tsParameters;

  const airDensity = tsState.airDensity;
  const effectiveRadius = tsState.effectiveRadius;

  const setAirDensity = (value: string) => updateTSParameterState({ airDensity: value });
  const setEffectiveRadius = (value: string) => updateTSParameterState({ effectiveRadius: value });

  const [airLoadMassFree, setAirLoadMassFree] = useState<number | null>(null);
  const [airLoadMassBaffle, setAirLoadMassBaffle] = useState<number | null>(null);

  const parseNumeric = (value: string): number | null => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || value.trim() === '' ? null : parsed;
  };

  useEffect(() => {
    const effectiveRadiusNum = parseNumeric(effectiveRadius);
    const airDensityNum = parseNumeric(airDensity);

    if (effectiveRadiusNum !== null && airDensityNum !== null &&
        effectiveRadiusNum > 0 && airDensityNum > 0) {
      const { airLoadMassFree: free, airLoadMassBaffle: baffle } = 
        calculateAirLoadMass(effectiveRadiusNum, airDensityNum);
      setAirLoadMassFree(free);
      setAirLoadMassBaffle(baffle);
    } else {
      setAirLoadMassFree(null);
      setAirLoadMassBaffle(null);
    }
  }, [effectiveRadius, airDensity]);

  return (
    <div className="max-w-6xl mx-auto space-y-6" role="main">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        空気負荷質量の計算
      </h1>

      <section className="bg-white rounded-lg shadow p-4 sm:p-6" aria-labelledby="air-load-section-title" aria-live="polite" role="region">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="air-load-section-title">空気負荷質量の計算</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">入力値</h4>
            <div className="flex items-center gap-2">
              <InputField
                label="空気密度 (ρ)"
                value={airDensity}
                onChange={setAirDensity}
                unit="kg/m³"
                id="air-density-input"
              />
              <HelpTooltip content="空気の密度。標準状態（海面、20℃）では約1.29 kg/m³です。" />
            </div>
            <div className="flex items-center gap-2">
              <InputField
                label="有効振動半径 (a)"
                value={effectiveRadius}
                onChange={setEffectiveRadius}
                unit="mm"
                id="effective-radius-input"
              />
              <HelpTooltip content="振動板の有効半径。音を放射する実効的な半径です。" />
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">計算結果</h4>
            <ResultDisplay
              label="空気負荷質量 (自由空間)"
              value={airLoadMassFree}
              unit="g"
              precision={4}
            />
            <ResultDisplay
              label="空気負荷質量 (無限バッフル)"
              value={airLoadMassBaffle}
              unit="g"
              precision={4}
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <FormulaDisplay
            formula="Mair_free = (8/3) × ρ × a³ × 1000, Mair_baffle = (16/3) × ρ × a³ × 1000"
            variables={[
              { symbol: 'Mair', description: '空気負荷質量', unit: 'g' },
              { symbol: 'ρ', description: '空気密度', unit: 'kg/m³' },
              { symbol: 'a', description: '有効半径', unit: 'm' },
            ]}
          />
        </div>
      </section>
    </div>
  );
};
