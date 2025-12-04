import React, { useState, useEffect } from 'react';
import { InputField } from '../../common/InputField';
import { ResultDisplay } from '../../common/ResultDisplay';
import { FormulaDisplay } from '../../common/FormulaDisplay';
import { HelpTooltip } from '../../common/HelpTooltip';
import { calculateOpenTubeResonance } from '../../../lib/calculations/resonance';
import { useCalculatorState } from '../../../contexts/CalculatorStateContext';

/**
 * 開管共鳴周波数計算セクションコンポーネント
 * 
 * 開管（両端が開いた管）の気中共鳴周波数を計算します。
 * 音速と管長から基本波、2倍波、3倍波の共鳴周波数を計算します。
 * 
 * @component
 * @example
 * ```tsx
 * <OpenTubeResonanceSection />
 * ```
 * 
 * @remarks
 * - 計算式: f_n = n × c / (2 × L)（nは倍音次数）
 * - 音速のデフォルト値は346.1 m/s（20℃の空気中）
 * - 管長はmmで入力し、mに自動変換されます
 * - 基本波（n=1）、2倍波（n=2）、3倍波（n=3）が計算されます
 * - 結果はHzで2桁の小数点精度で表示されます
 * 
 * @returns 開管共鳴周波数計算セクションのReactコンポーネント
 */
export const OpenTubeResonanceSection: React.FC = () => {
  const { states, updateTSParameterState } = useCalculatorState();
  const tsState = states.tsParameters;

  // Get values from context
  const soundSpeed = tsState.soundSpeed;
  const tubeLength = tsState.tubeLength;

  // Setter functions
  const setSoundSpeed = (value: string) => updateTSParameterState({ soundSpeed: value });
  const setTubeLength = (value: string) => updateTSParameterState({ tubeLength: value });

  // State for calculation results
  const [fundamental, setFundamental] = useState<number | null>(null);
  const [secondHarmonic, setSecondHarmonic] = useState<number | null>(null);
  const [thirdHarmonic, setThirdHarmonic] = useState<number | null>(null);

  // Helper function to parse numeric input
  const parseNumeric = (value: string): number | null => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || value.trim() === '' ? null : parsed;
  };

  // Reactive calculation logic
  useEffect(() => {
    const soundSpeedNum = parseNumeric(soundSpeed);
    const tubeLengthNum = parseNumeric(tubeLength);

    if (
      soundSpeedNum !== null &&
      tubeLengthNum !== null &&
      soundSpeedNum > 0 &&
      tubeLengthNum > 0
    ) {
      const result = calculateOpenTubeResonance(soundSpeedNum, tubeLengthNum);
      setFundamental(result.fundamental);
      setSecondHarmonic(result.secondHarmonic);
      setThirdHarmonic(result.thirdHarmonic);
    } else {
      setFundamental(null);
      setSecondHarmonic(null);
      setThirdHarmonic(null);
    }
  }, [soundSpeed, tubeLength]);

  return (
    <section className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6" aria-labelledby="resonance-section-title" role="region" aria-live="polite">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="resonance-section-title">
        開管の気中共鳴周波数計算
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">入力値</h4>
          
          <div className="flex items-center gap-2">
            <InputField
              label="音速"
              value={soundSpeed}
              onChange={setSoundSpeed}
              unit="m/s"
              id="sound-speed-input"
            />
            <HelpTooltip content="空気中の音速。標準状態（20℃）では約346.1 m/sです。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="管の長さ"
              value={tubeLength}
              onChange={setTubeLength}
              unit="mm"
              id="tube-length-input"
            />
            <HelpTooltip content="開管の長さです。" />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">単位変換</h4>
          <ResultDisplay
            label="管の長さ"
            value={parseNumeric(tubeLength) !== null ? parseNumeric(tubeLength)! / 1000 : null}
            unit="m"
            precision={6}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <FormulaDisplay
          formula="f_n = n × c / (2 × L)"
          variables={[
            { symbol: 'f_n', description: 'n次の共鳴周波数', unit: 'Hz' },
            { symbol: 'n', description: '倍音次数（1, 2, 3, ...）' },
            { symbol: 'c', description: '音速', unit: 'm/s' },
            { symbol: 'L', description: '管の長さ', unit: 'm' },
          ]}
        />

        <div className="space-y-2">
          <ResultDisplay
            label="基本波（n=1）"
            value={fundamental}
            unit="Hz"
            precision={2}
          />
          <ResultDisplay
            label="2倍波（n=2）"
            value={secondHarmonic}
            unit="Hz"
            precision={2}
          />
          <ResultDisplay
            label="3倍波（n=3）"
            value={thirdHarmonic}
            unit="Hz"
            precision={2}
          />
        </div>
      </div>
    </section>
  );
};
