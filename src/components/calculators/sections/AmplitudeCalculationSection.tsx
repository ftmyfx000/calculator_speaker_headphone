import React, { useState, useEffect, useMemo } from 'react';
import { InputField } from '../../common/InputField';
import { ResultDisplay } from '../../common/ResultDisplay';
import { FormulaDisplay } from '../../common/FormulaDisplay';
import { HelpTooltip } from '../../common/HelpTooltip';
import { calculateAmplitude } from '../../../lib/calculations/amplitude';
import { useCalculatorState } from '../../../contexts/CalculatorStateContext';
import { validateParameter } from '../../../lib/validation/validation';

/**
 * 振幅計算セクションコンポーネント
 * 
 * SPL（音圧レベル）、空気密度、有効半径、周波数から
 * スピーカー振動板の振幅を計算します。
 * 
 * @component
 * @example
 * ```tsx
 * <AmplitudeCalculationSection />
 * ```
 * 
 * @remarks
 * - 計算式: amplitude = 2√2 × P0 × 10^(SPL/20) / (4π² × f² × ρ × a²)
 * - P0 = 2×10^(-5) Pa（基準音圧）
 * - 結果はメートルとミリメートルの両方で表示されます
 * - 有効半径はmmからmに自動変換されます
 * 
 * @returns 振幅計算セクションのReactコンポーネント
 */
export const AmplitudeCalculationSection: React.FC = () => {
  const { states, updateTSParameterState } = useCalculatorState();
  const tsState = states.tsParameters;

  // Get values from context
  const spl = tsState.spl;
  const airDensity = tsState.airDensity;
  const effectiveRadius = tsState.effectiveRadius;
  const frequency = tsState.frequency;

  // Setter functions
  const setSpl = (value: string) => updateTSParameterState({ spl: value });
  const setAirDensity = (value: string) => updateTSParameterState({ airDensity: value });
  const setEffectiveRadius = (value: string) => updateTSParameterState({ effectiveRadius: value });
  const setFrequency = (value: string) => updateTSParameterState({ frequency: value });

  // State for calculation results
  const [amplitudeMeters, setAmplitudeMeters] = useState<number | null>(null);
  const [amplitudeMillimeters, setAmplitudeMillimeters] = useState<number | null>(null);
  const [splError, setSplError] = useState<string | null>(null);
  const [frequencyError, setFrequencyError] = useState<string | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  // Helper function to parse numeric input
  const parseNumeric = (value: string): number | null => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || value.trim() === '' ? null : parsed;
  };

  // Memoize parsed numeric values
  const splNum = useMemo(() => parseNumeric(spl), [spl]);
  const airDensityNum = useMemo(() => parseNumeric(airDensity), [airDensity]);
  const effectiveRadiusNum = useMemo(() => parseNumeric(effectiveRadius), [effectiveRadius]);
  const frequencyNum = useMemo(() => parseNumeric(frequency), [frequency]);

  // Memoize amplitude calculation
  const amplitudeResult = useMemo(() => {
    const splValidationError = validateParameter(spl, 'spl');
    const frequencyValidationError = validateParameter(frequency, 'frequency');

    if (
      splNum !== null &&
      airDensityNum !== null &&
      effectiveRadiusNum !== null &&
      frequencyNum !== null &&
      airDensityNum > 0 &&
      effectiveRadiusNum > 0 &&
      frequencyNum > 0 &&
      !splValidationError &&
      !frequencyValidationError
    ) {
      try {
        return calculateAmplitude(splNum, airDensityNum, effectiveRadiusNum, frequencyNum);
      } catch (error) {
        return null;
      }
    }
    return null;
  }, [splNum, airDensityNum, effectiveRadiusNum, frequencyNum, spl, frequency]);

  // Reactive calculation logic
  useEffect(() => {
    // Validate inputs
    const splValidationError = validateParameter(spl, 'spl');
    const frequencyValidationError = validateParameter(frequency, 'frequency');
    setSplError(splValidationError);
    setFrequencyError(frequencyValidationError);

    if (amplitudeResult) {
      setAmplitudeMeters(amplitudeResult.amplitudeMeters);
      setAmplitudeMillimeters(amplitudeResult.amplitudeMillimeters);
      setCalculationError(null);
    } else {
      setAmplitudeMeters(null);
      setAmplitudeMillimeters(null);
      setCalculationError(null);
    }
  }, [spl, airDensity, effectiveRadius, frequency, amplitudeResult]);

  return (
    <section className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6" aria-labelledby="amplitude-section-title" role="region" aria-live="polite">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="amplitude-section-title">
        振幅の計算
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">入力値</h4>
          
          <div className="flex items-center gap-2">
            <InputField
              label="SPL"
              value={spl}
              onChange={setSpl}
              unit="dB"
              id="spl-input"
              error={splError || undefined}
            />
            <HelpTooltip content="音圧レベル。音の大きさを表す指標です。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="空気密度"
              value={airDensity}
              onChange={setAirDensity}
              unit="kg/m³"
              id="amplitude-air-density-input"
            />
            <HelpTooltip content="空気の密度。標準状態（海面、20℃）では約1.29 kg/m³です。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="有効半径"
              value={effectiveRadius}
              onChange={setEffectiveRadius}
              unit="mm"
              id="amplitude-effective-radius-input"
            />
            <HelpTooltip content="振動板の有効半径。音を放射する実効的な半径です。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="周波数"
              value={frequency}
              onChange={setFrequency}
              unit="Hz"
              id="frequency-input"
              error={frequencyError || undefined}
            />
            <HelpTooltip content="測定する周波数です。" />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">計算結果</h4>
          {calculationError && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{calculationError}</p>
            </div>
          )}
          <ResultDisplay
            label="振幅"
            value={amplitudeMeters}
            unit="m"
            precision={8}
          />
          <ResultDisplay
            label="振幅"
            value={amplitudeMillimeters}
            unit="mm"
            precision={6}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <FormulaDisplay
          formula="amplitude = 2√2 × P0 × 10^(SPL/20) / (4π² × f² × ρ × a²)"
          variables={[
            { symbol: 'amplitude', description: '振幅', unit: 'm' },
            { symbol: 'P0', description: '基準音圧 (2×10⁻⁵ Pa)' },
            { symbol: 'SPL', description: '音圧レベル', unit: 'dB' },
            { symbol: 'f', description: '周波数', unit: 'Hz' },
            { symbol: 'ρ', description: '空気密度', unit: 'kg/m³' },
            { symbol: 'a', description: '有効半径', unit: 'm' },
          ]}
        />
      </div>
    </section>
  );
};
