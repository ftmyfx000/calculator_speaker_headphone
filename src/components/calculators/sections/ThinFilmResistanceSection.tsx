import React, { useEffect } from 'react';
import { InputField } from '../../common/InputField';
import { ResultDisplay } from '../../common/ResultDisplay';
import { FormulaDisplay } from '../../common/FormulaDisplay';
import { HelpTooltip } from '../../common/HelpTooltip';
import {
  calculateResistance,
  calculateLineWidth,
  calculateLineThickness,
  calculateLineLength,
  calculateVolumeResistivity,
} from '../../../lib/calculations/thin-film';
import { useCalculatorState } from '../../../contexts/CalculatorStateContext';
import { CalculationModeSelector } from '../CalculationModeSelector';
import { VolumeResistivityInput } from '../VolumeResistivityInput';

/**
 * 薄膜パターン抵抗値計算セクションコンポーネント（拡張版）
 * 
 * 薄膜抵抗パターンの任意のパラメータを計算します。
 * 計算モードを選択することで、抵抗値、線幅、線厚、線長、体積抵抗率のいずれかを計算できます。
 * 
 * @component
 * @example
 * ```tsx
 * <ThinFilmResistanceSection />
 * ```
 * 
 * @remarks
 * - 計算式: R = ρ × L / (W × T)
 * - 体積抵抗率は10⁻⁸ Ω·m単位で入力します
 * - 線の寸法（幅、厚さ、長さ）はmm単位で入力します
 * - 材料プリセットから体積抵抗率を選択できます
 * 
 * @returns 薄膜パターン抵抗値計算セクションのReactコンポーネント
 */
export const ThinFilmResistanceSection: React.FC = () => {
  const { states, updateTSParameterState } = useCalculatorState();
  const tsState = states.tsParameters;

  // Get values from context
  const calculationMode = tsState.calculationMode;
  const volumeResistivity = tsState.volumeResistivity;
  const lineWidth = tsState.lineWidth;
  const lineThickness = tsState.lineThickness;
  const lineLength = tsState.lineLength;
  const resistance = tsState.resistance;
  const materialPresetMode = tsState.materialPresetMode;
  const selectedMaterial = tsState.selectedMaterial;

  // Helper function to parse numeric input
  const parseNumeric = (value: string): number | null => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || value.trim() === '' ? null : parsed;
  };

  // Get validation errors
  const getValidationError = (value: string, fieldName: string): string | null => {
    if (value.trim() === '') return null;
    const num = parseNumeric(value);
    if (num === null) return `${fieldName}は数値を入力してください`;
    if (num <= 0) return `${fieldName}は正の値を入力してください`;
    return null;
  };

  // Reactive calculation logic
  useEffect(() => {
    try {
      // Convert volume resistivity from 10⁻⁸ Ω·m to Ω·m
      const volumeResistivityNum = parseNumeric(volumeResistivity);
      const volumeResistivityOhmM = volumeResistivityNum !== null ? volumeResistivityNum * 1e-8 : null;
      
      // Convert dimensions from mm to m
      const lineWidthNum = parseNumeric(lineWidth);
      const lineWidthM = lineWidthNum !== null ? lineWidthNum / 1000 : null;
      
      const lineThicknessNum = parseNumeric(lineThickness);
      const lineThicknessM = lineThicknessNum !== null ? lineThicknessNum / 1000 : null;
      
      const lineLengthNum = parseNumeric(lineLength);
      const lineLengthM = lineLengthNum !== null ? lineLengthNum / 1000 : null;
      
      const resistanceNum = parseNumeric(resistance);

      // Perform calculation based on mode
      switch (calculationMode) {
        case 'resistance':
          if (volumeResistivityOhmM !== null && volumeResistivityOhmM > 0 &&
              lineLengthM !== null && lineLengthM > 0 &&
              lineWidthM !== null && lineWidthM > 0 &&
              lineThicknessM !== null && lineThicknessM > 0) {
            const result = calculateResistance(volumeResistivityOhmM, lineLengthM, lineWidthM, lineThicknessM);
            updateTSParameterState({ resistance: result.toFixed(6) });
          } else {
            updateTSParameterState({ resistance: '' });
          }
          break;

        case 'lineWidth':
          if (volumeResistivityOhmM !== null && volumeResistivityOhmM > 0 &&
              lineLengthM !== null && lineLengthM > 0 &&
              resistanceNum !== null && resistanceNum > 0 &&
              lineThicknessM !== null && lineThicknessM > 0) {
            const resultM = calculateLineWidth(volumeResistivityOhmM, lineLengthM, resistanceNum, lineThicknessM);
            const resultMm = resultM * 1000;
            updateTSParameterState({ lineWidth: resultMm.toFixed(6) });
          } else {
            updateTSParameterState({ lineWidth: '' });
          }
          break;

        case 'lineThickness':
          if (volumeResistivityOhmM !== null && volumeResistivityOhmM > 0 &&
              lineLengthM !== null && lineLengthM > 0 &&
              resistanceNum !== null && resistanceNum > 0 &&
              lineWidthM !== null && lineWidthM > 0) {
            const resultM = calculateLineThickness(volumeResistivityOhmM, lineLengthM, resistanceNum, lineWidthM);
            const resultMm = resultM * 1000;
            updateTSParameterState({ lineThickness: resultMm.toFixed(6) });
          } else {
            updateTSParameterState({ lineThickness: '' });
          }
          break;

        case 'lineLength':
          if (resistanceNum !== null && resistanceNum > 0 &&
              lineWidthM !== null && lineWidthM > 0 &&
              lineThicknessM !== null && lineThicknessM > 0 &&
              volumeResistivityOhmM !== null && volumeResistivityOhmM > 0) {
            const resultM = calculateLineLength(resistanceNum, lineWidthM, lineThicknessM, volumeResistivityOhmM);
            const resultMm = resultM * 1000;
            updateTSParameterState({ lineLength: resultMm.toFixed(6) });
          } else {
            updateTSParameterState({ lineLength: '' });
          }
          break;

        case 'volumeResistivity':
          if (resistanceNum !== null && resistanceNum > 0 &&
              lineWidthM !== null && lineWidthM > 0 &&
              lineThicknessM !== null && lineThicknessM > 0 &&
              lineLengthM !== null && lineLengthM > 0) {
            const resultOhmM = calculateVolumeResistivity(resistanceNum, lineWidthM, lineThicknessM, lineLengthM);
            const result1e8 = resultOhmM / 1e-8;
            updateTSParameterState({ volumeResistivity: result1e8.toFixed(6) });
          } else {
            updateTSParameterState({ volumeResistivity: '' });
          }
          break;
      }
    } catch (error) {
      // Handle calculation errors silently
      console.error('Calculation error:', error);
    }
  }, [calculationMode, volumeResistivity, lineWidth, lineThickness, lineLength, resistance]);

  // Get highlight symbol for formula
  const getHighlightSymbol = (): string => {
    switch (calculationMode) {
      case 'resistance': return 'R';
      case 'lineWidth': return 'W';
      case 'lineThickness': return 'T';
      case 'lineLength': return 'L';
      case 'volumeResistivity': return 'ρ';
      default: return '';
    }
  };

  return (
    <section className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6" aria-labelledby="thin-film-section-title" role="region" aria-live="polite">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="thin-film-section-title">
        薄膜パターンの抵抗値計算（拡張版）
      </h3>

      <CalculationModeSelector
        selectedMode={calculationMode}
        onChange={(mode) => updateTSParameterState({ calculationMode: mode })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {calculationMode === 'resistance' ? '入力値' : '入力値（計算に使用）'}
          </h4>
          
          {/* Volume Resistivity */}
          {calculationMode !== 'volumeResistivity' ? (
            <div className="flex items-center gap-2">
              <VolumeResistivityInput
                value={volumeResistivity}
                onChange={(value) => updateTSParameterState({ volumeResistivity: value })}
                isOutput={false}
                presetMode={materialPresetMode}
                onPresetModeChange={(mode) => updateTSParameterState({ materialPresetMode: mode })}
                selectedMaterial={selectedMaterial as string | null}
                onMaterialChange={(material) => updateTSParameterState({ selectedMaterial: material })}
              />
              <HelpTooltip content="材料の体積抵抗率。プリセットから選択するか、カスタム値を入力できます。" />
            </div>
          ) : null}

          {/* Line Width */}
          {calculationMode !== 'lineWidth' ? (
            <div className="flex items-center gap-2">
              <InputField
                label="線幅"
                value={lineWidth}
                onChange={(value) => updateTSParameterState({ lineWidth: value })}
                unit="mm"
                id="line-width-input"
                error={getValidationError(lineWidth, '線幅')}
              />
              <HelpTooltip content="薄膜パターンの線幅です。" />
            </div>
          ) : null}

          {/* Line Thickness */}
          {calculationMode !== 'lineThickness' ? (
            <div className="flex items-center gap-2">
              <InputField
                label="線厚"
                value={lineThickness}
                onChange={(value) => updateTSParameterState({ lineThickness: value })}
                unit="mm"
                id="line-thickness-input"
                error={getValidationError(lineThickness, '線厚')}
              />
              <HelpTooltip content="薄膜パターンの厚さです。" />
            </div>
          ) : null}

          {/* Line Length */}
          {calculationMode !== 'lineLength' ? (
            <div className="flex items-center gap-2">
              <InputField
                label="線長"
                value={lineLength}
                onChange={(value) => updateTSParameterState({ lineLength: value })}
                unit="mm"
                id="line-length-input"
                error={getValidationError(lineLength, '線長')}
              />
              <HelpTooltip content="薄膜パターンの長さです。" />
            </div>
          ) : null}

          {/* Resistance */}
          {calculationMode !== 'resistance' ? (
            <div className="flex items-center gap-2">
              <InputField
                label="抵抗値"
                value={resistance}
                onChange={(value) => updateTSParameterState({ resistance: value })}
                unit="Ω"
                id="resistance-input"
                error={getValidationError(resistance, '抵抗値')}
              />
              <HelpTooltip content="薄膜パターンの抵抗値です。" />
            </div>
          ) : null}
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">計算結果</h4>
          
          {/* Output based on calculation mode */}
          {calculationMode === 'resistance' && (
            <ResultDisplay
              label="抵抗値"
              value={parseNumeric(resistance)}
              unit="Ω"
              precision={6}
            />
          )}
          
          {calculationMode === 'lineWidth' && (
            <ResultDisplay
              label="線幅"
              value={parseNumeric(lineWidth)}
              unit="mm"
              precision={6}
            />
          )}
          
          {calculationMode === 'lineThickness' && (
            <ResultDisplay
              label="線厚"
              value={parseNumeric(lineThickness)}
              unit="mm"
              precision={6}
            />
          )}
          
          {calculationMode === 'lineLength' && (
            <ResultDisplay
              label="線長"
              value={parseNumeric(lineLength)}
              unit="mm"
              precision={6}
            />
          )}
          
          {calculationMode === 'volumeResistivity' && (
            <VolumeResistivityInput
              value={volumeResistivity}
              onChange={(value) => updateTSParameterState({ volumeResistivity: value })}
              isOutput={true}
              presetMode={materialPresetMode}
              onPresetModeChange={(mode) => updateTSParameterState({ materialPresetMode: mode })}
              selectedMaterial={selectedMaterial as string | null}
              onMaterialChange={(material) => updateTSParameterState({ selectedMaterial: material })}
            />
          )}
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
          highlightSymbol={getHighlightSymbol()}
        />
      </div>
    </section>
  );
};
