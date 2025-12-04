import React, { useState, useEffect } from 'react';
import { InputField } from '../../common/InputField';
import { ResultDisplay } from '../../common/ResultDisplay';
import { FormulaDisplay } from '../../common/FormulaDisplay';
import { HelpTooltip } from '../../common/HelpTooltip';
import { calculateVas } from '../../../lib/calculations/ts-parameters';
import { useCalculatorState } from '../../../contexts/CalculatorStateContext';

export const VasCalculationPage: React.FC = () => {
  const { states, updateTSParameterState } = useCalculatorState();
  const tsState = states.tsParameters;

  const airDensity = tsState.airDensity;
  const soundSpeed = tsState.soundSpeed;
  const effectiveRadius = tsState.effectiveRadius;
  const kms = tsState.kms;

  const setAirDensity = (value: string) => updateTSParameterState({ airDensity: value });
  const setSoundSpeed = (value: string) => updateTSParameterState({ soundSpeed: value });
  const setEffectiveRadius = (value: string) => updateTSParameterState({ effectiveRadius: value });
  const setKms = (value: string) => updateTSParameterState({ kms: value });

  const [vas, setVas] = useState<number | null>(null);

  const parseNumeric = (value: string): number | null => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || value.trim() === '' ? null : parsed;
  };

  useEffect(() => {
    const airDensityNum = parseNumeric(airDensity);
    const effectiveRadiusNum = parseNumeric(effectiveRadius);
    const kmsNum = parseNumeric(kms);

    if (airDensityNum !== null && effectiveRadiusNum !== null && kmsNum !== null &&
        airDensityNum > 0 && effectiveRadiusNum > 0 && kmsNum > 0) {
      setVas(calculateVas(airDensityNum, effectiveRadiusNum, kmsNum));
    } else {
      setVas(null);
    }
  }, [airDensity, effectiveRadius, kms]);

  return (
    <div className="max-w-6xl mx-auto space-y-6" role="main">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        Vas計算
      </h1>

      <section className="bg-white rounded-lg shadow p-4 sm:p-6" aria-labelledby="vas-section-title" aria-live="polite" role="region">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="vas-section-title">Vasの計算</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">入力値</h4>
            <div className="flex items-center gap-2">
              <InputField
                label="空気密度 (ρ)"
                value={airDensity}
                onChange={setAirDensity}
                unit="kg/m³"
                id="vas-air-density-input"
              />
              <HelpTooltip content="空気の密度。標準状態（海面、20℃）では約1.29 kg/m³です。" />
            </div>
            <div className="flex items-center gap-2">
              <InputField
                label="音速 (c)"
                value={soundSpeed}
                onChange={setSoundSpeed}
                unit="m/s"
                id="sound-speed-input"
              />
              <HelpTooltip content="空気中の音速。標準状態では約346.1 m/sです。" />
            </div>
            <div className="flex items-center gap-2">
              <InputField
                label="有効振動半径 (a)"
                value={effectiveRadius}
                onChange={setEffectiveRadius}
                unit="mm"
                id="vas-effective-radius-input"
              />
              <HelpTooltip content="振動板の有効半径。音を放射する実効的な半径です。" />
            </div>
            <div className="flex items-center gap-2">
              <InputField
                label="機械的スティフネス (Kms)"
                value={kms}
                onChange={setKms}
                unit="N/mm"
                id="vas-kms-input"
              />
              <HelpTooltip content="機械的スティフネス。スピーカーのサスペンション（スパイダーとエッジ）の硬さを表します。" />
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">計算結果</h4>
            <ResultDisplay
              label="Vas (等価コンプライアンス容積)"
              value={vas}
              unit="L"
              precision={4}
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <FormulaDisplay
            formula="Vas = ρ × c² × (π × a²)² / Kms × 1000"
            variables={[
              { symbol: 'Vas', description: '等価コンプライアンス容積', unit: 'L' },
              { symbol: 'ρ', description: '空気密度', unit: 'kg/m³' },
              { symbol: 'c', description: '音速', unit: 'm/s' },
              { symbol: 'a', description: '有効半径', unit: 'm' },
              { symbol: 'Kms', description: '機械的スティフネス', unit: 'N/m' },
            ]}
          />
        </div>
      </section>
    </div>
  );
};
