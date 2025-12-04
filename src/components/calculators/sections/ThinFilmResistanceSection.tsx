import React, { useState, useEffect } from 'react';
import { InputField } from '../../common/InputField';
import { ResultDisplay } from '../../common/ResultDisplay';
import { FormulaDisplay } from '../../common/FormulaDisplay';
import { HelpTooltip } from '../../common/HelpTooltip';
import { calculateThinFilmResistance } from '../../../lib/calculations/thin-film';
import { useCalculatorState } from '../../../contexts/CalculatorStateContext';

/**
 * 薄膜パターン抵抗値計算セクションコンポーネント
 * 
 * 薄膜抵抗パターンの抵抗値を計算します。
 * 体積抵抗率、線幅、線厚、線長から計算されます。
 * 
 * @component
 * @example
 * ```tsx
 * <ThinFilmResistanceSection />
 * ```
 * 
 * @remarks
 * - 計算式: R = ρ × L / (W × T)
 * - 体積抵抗率は科学的記数法（例: 1.5e-6）で入力できます
 * - 線の寸法（幅、厚さ、長さ）はmmからmに自動変換されます
 * - 結果はΩ（オーム）で表示されます
 * 
 * @returns 薄膜パターン抵抗値計算セクションのReactコンポーネント
 */
export const ThinFilmResistanceSection: React.FC = () => {
  const { states, updateTSParameterState } = useCalculatorState();
  const tsState = states.tsParameters;

  // Get values from context
  const volumeResistivity = tsState.volumeResistivity;
  const lineWidth = tsState.lineWidth;
  const lineThickness = tsState.lineThickness;
  const lineLength = tsState.lineLength;

  // Setter functions
  const setVolumeResistivity = (value: string) => updateTSParameterState({ volumeResistivity: value });
  const setLineWidth = (value: string) => updateTSParameterState({ lineWidth: value });
  const setLineThickness = (value: string) => updateTSParameterState({ lineThickness: value });
  const setLineLength = (value: string) => updateTSParameterState({ lineLength: value });

  // State for calculation results
  const [resistance, setResistance] = useState<number | null>(null);

  // Helper function to parse numeric input (supports scientific notation)
  const parseNumeric = (value: string): number | null => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || value.trim() === '' ? null : parsed;
  };

  // Reactive calculation logic
  useEffect(() => {
    const volumeResistivityNum = parseNumeric(volumeResistivity);
    const lineWidthNum = parseNumeric(lineWidth);
    const lineThicknessNum = parseNumeric(lineThickness);
    const lineLengthNum = parseNumeric(lineLength);

    if (
      volumeResistivityNum !== null &&
      lineWidthNum !== null &&
      lineThicknessNum !== null &&
      lineLengthNum !== null &&
      volumeResistivityNum > 0 &&
      lineWidthNum > 0 &&
      lineThicknessNum > 0 &&
      lineLengthNum > 0
    ) {
      const result = calculateThinFilmResistance(
        volumeResistivityNum,
        lineWidthNum,
        lineThicknessNum,
        lineLengthNum
      );
      setResistance(result.resistance);
    } else {
      setResistance(null);
    }
  }, [volumeResistivity, lineWidth, lineThickness, lineLength]);

  return (
    <section className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6" aria-labelledby="thin-film-section-title" role="region" aria-live="polite">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="thin-film-section-title">
        薄膜パターンの抵抗値計算
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">入力値</h4>
          
          <div className="flex items-center gap-2">
            <InputField
              label="体積抵抗率"
              value={volumeResistivity}
              onChange={setVolumeResistivity}
              unit="Ω·m"
              id="volume-resistivity-input"
            />
            <HelpTooltip content="材料の体積抵抗率。科学的記数法（例: 1.5e-6）での入力も可能です。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="線幅"
              value={lineWidth}
              onChange={setLineWidth}
              unit="mm"
              id="line-width-input"
            />
            <HelpTooltip content="薄膜パターンの線幅です。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="線厚"
              value={lineThickness}
              onChange={setLineThickness}
              unit="mm"
              id="line-thickness-input"
            />
            <HelpTooltip content="薄膜パターンの厚さです。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="線長"
              value={lineLength}
              onChange={setLineLength}
              unit="mm"
              id="line-length-input"
            />
            <HelpTooltip content="薄膜パターンの長さです。" />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">単位変換</h4>
          <ResultDisplay
            label="線幅"
            value={parseNumeric(lineWidth) !== null ? parseNumeric(lineWidth)! / 1000 : null}
            unit="m"
            precision={6}
          />
          <ResultDisplay
            label="線厚"
            value={parseNumeric(lineThickness) !== null ? parseNumeric(lineThickness)! / 1000 : null}
            unit="m"
            precision={6}
          />
          <ResultDisplay
            label="線長"
            value={parseNumeric(lineLength) !== null ? parseNumeric(lineLength)! / 1000 : null}
            unit="m"
            precision={6}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <FormulaDisplay
          formula="R = ρ × L / (W × T)"
          variables={[
            { symbol: 'R', description: '抵抗値', unit: 'Ω' },
            { symbol: 'ρ', description: '体積抵抗率', unit: 'Ω·m' },
            { symbol: 'L', description: '線長', unit: 'm' },
            { symbol: 'W', description: '線幅', unit: 'm' },
            { symbol: 'T', description: '線厚', unit: 'm' },
          ]}
        />
        <ResultDisplay
          label="抵抗値"
          value={resistance}
          unit="Ω"
          precision={6}
        />
      </div>
    </section>
  );
};
