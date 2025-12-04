import React, { useState, useEffect } from 'react';
import { InputField } from '../../common/InputField';
import { ResultDisplay } from '../../common/ResultDisplay';
import { FormulaDisplay } from '../../common/FormulaDisplay';
import { HelpTooltip } from '../../common/HelpTooltip';
import { calculateXmax } from '../../../lib/calculations/xmax';
import { useCalculatorState } from '../../../contexts/CalculatorStateContext';
import { validateParameter, validateXmaxInputs } from '../../../lib/validation/validation';

/**
 * Xmax計算セクションコンポーネント（ドイツ方式）
 * 
 * スピーカーの最大線形振幅（Xmax）をドイツ方式で計算します。
 * ボイスコイル巻き幅とプレート厚さから計算されます。
 * 
 * @component
 * @example
 * ```tsx
 * <XmaxCalculationSection />
 * ```
 * 
 * @remarks
 * - 計算式: Xmax = (VC巻き幅 - plate厚さ) / 2
 * - 寸法はmmで入力し、結果もmmで表示されます
 * - VC巻き幅はplate厚さより大きい必要があります
 * - Xmaxは2桁の小数点精度で表示されます
 * 
 * @returns Xmax計算セクションのReactコンポーネント
 */
export const XmaxCalculationSection: React.FC = () => {
  const { states, updateTSParameterState } = useCalculatorState();
  const tsState = states.tsParameters;

  // Get values from context
  const vcWindingWidth = tsState.vcWindingWidth;
  const plateThickness = tsState.plateThickness;

  // Setter functions
  const setVcWindingWidth = (value: string) => updateTSParameterState({ vcWindingWidth: value });
  const setPlateThickness = (value: string) => updateTSParameterState({ plateThickness: value });

  // State for calculation results
  const [xmax, setXmax] = useState<number | null>(null);
  const [vcWindingWidthError, setVcWindingWidthError] = useState<string | null>(null);
  const [plateThicknessError, setPlateThicknessError] = useState<string | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  // Helper function to parse numeric input
  const parseNumeric = (value: string): number | null => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || value.trim() === '' ? null : parsed;
  };

  // Reactive calculation logic
  useEffect(() => {
    const vcWindingWidthNum = parseNumeric(vcWindingWidth);
    const plateThicknessNum = parseNumeric(plateThickness);

    // Validate inputs
    const vcValidationError = validateParameter(vcWindingWidth, 'vcWindingWidth');
    const plateValidationError = validateParameter(plateThickness, 'plateThickness');
    setVcWindingWidthError(vcValidationError);
    setPlateThicknessError(plateValidationError);

    // Validate Xmax calculation inputs
    const xmaxValidationError = validateXmaxInputs(vcWindingWidthNum, plateThicknessNum);
    setCalculationError(xmaxValidationError);

    if (
      vcWindingWidthNum !== null &&
      plateThicknessNum !== null &&
      vcWindingWidthNum > 0 &&
      plateThicknessNum >= 0 &&
      vcWindingWidthNum > plateThicknessNum &&
      !vcValidationError &&
      !plateValidationError &&
      !xmaxValidationError
    ) {
      try {
        const result = calculateXmax(vcWindingWidthNum, plateThicknessNum);
        setXmax(result.xmax);
      } catch (error) {
        setCalculationError('計算中にエラーが発生しました');
        setXmax(null);
      }
    } else {
      setXmax(null);
    }
  }, [vcWindingWidth, plateThickness]);

  return (
    <section className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6" aria-labelledby="xmax-section-title" role="region" aria-live="polite">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="xmax-section-title">
        ドイツのXmax計算
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">入力値</h4>
          
          <div className="flex items-center gap-2">
            <InputField
              label="VC巻き幅"
              value={vcWindingWidth}
              onChange={setVcWindingWidth}
              unit="mm"
              id="vc-winding-width-input"
              error={vcWindingWidthError || undefined}
            />
            <HelpTooltip content="ボイスコイルの巻き幅です。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="plate厚さ"
              value={plateThickness}
              onChange={setPlateThickness}
              unit="mm"
              id="plate-thickness-input"
              error={plateThicknessError || undefined}
            />
            <HelpTooltip content="磁気回路のプレート厚さです。" />
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
            label="Xmax"
            value={xmax}
            unit="mm"
            precision={2}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <FormulaDisplay
          formula="Xmax = (VC巻き幅 - plate厚さ) / 2"
          variables={[
            { symbol: 'Xmax', description: '最大振幅', unit: 'mm' },
            { symbol: 'VC巻き幅', description: 'ボイスコイルの巻き幅', unit: 'mm' },
            { symbol: 'plate厚さ', description: 'プレート厚さ', unit: 'mm' },
          ]}
        />
      </div>
    </section>
  );
};
