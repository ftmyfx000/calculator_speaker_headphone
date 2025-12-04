import React, { useState, useEffect, useMemo } from 'react';
import { InputField } from '../../common/InputField';
import { ResultDisplay } from '../../common/ResultDisplay';
import { FormulaDisplay } from '../../common/FormulaDisplay';
import { HelpTooltip } from '../../common/HelpTooltip';
import { calculateQms, calculateF0 } from '../../../lib/calculations/ts-parameters';
import { useCalculatorState } from '../../../contexts/CalculatorStateContext';
import { validateParameter, validateQmsInputs } from '../../../lib/validation/validation';

/**
 * Qms（機械的Q値）計算セクションコンポーネント
 * 
 * スピーカーの機械的損失を表すQms（機械的Q値）を計算します。
 * F0（共振周波数）、Mms（振動系質量）、Rms（機械的抵抗）から計算されます。
 * 
 * @component
 * @example
 * ```tsx
 * <QmsCalculationSection />
 * ```
 * 
 * @remarks
 * - F0とMmsは他のセクションから自動的に取得されます
 * - Rmsは手動で入力する必要があります
 * - 計算式: Qms = 2π × F0 × Mms / Rms
 * - Mmsはgからkgに自動変換されます
 * 
 * @returns Qms計算セクションのReactコンポーネント
 */
export const QmsCalculationSection: React.FC = () => {
  const { states, updateTSParameterState } = useCalculatorState();
  const tsState = states.tsParameters;

  // Get values from context
  const mms = tsState.mms;
  const kms = tsState.kms;
  const rms = tsState.rms;

  // Setter functions
  const setRms = (value: string) => updateTSParameterState({ rms: value });

  // State for calculation results
  const [qms, setQms] = useState<number | null>(null);
  const [f0, setF0] = useState<number | null>(null);
  const [rmsError, setRmsError] = useState<string | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  // Helper function to parse numeric input
  const parseNumeric = (value: string): number | null => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || value.trim() === '' ? null : parsed;
  };

  // Memoize parsed numeric values
  const mmsNum = useMemo(() => parseNumeric(mms), [mms]);
  const kmsNum = useMemo(() => parseNumeric(kms), [kms]);
  const rmsNum = useMemo(() => parseNumeric(rms), [rms]);

  // Memoize F0 calculation
  const f0Calculated = useMemo(() => {
    if (mmsNum !== null && kmsNum !== null && mmsNum > 0 && kmsNum > 0) {
      return calculateF0(mmsNum, kmsNum);
    }
    return null;
  }, [mmsNum, kmsNum]);

  // Memoize Qms calculation
  const qmsCalculated = useMemo(() => {
    if (f0Calculated !== null && mmsNum !== null && rmsNum !== null && rmsNum > 0) {
      const rmsValidationError = validateParameter(rms, 'rms');
      const qmsValidationError = validateQmsInputs(f0Calculated, mmsNum, rmsNum);
      
      if (!rmsValidationError && !qmsValidationError) {
        try {
          return calculateQms(f0Calculated, mmsNum, rmsNum);
        } catch (error) {
          return null;
        }
      }
    }
    return null;
  }, [f0Calculated, mmsNum, rmsNum, rms]);

  // Reactive calculation logic
  useEffect(() => {
    // Validate Rms input
    const rmsValidationError = validateParameter(rms, 'rms');
    setRmsError(rmsValidationError);

    // Update F0
    setF0(f0Calculated);

    // Validate Qms calculation inputs
    if (f0Calculated !== null && mmsNum !== null) {
      const qmsValidationError = validateQmsInputs(f0Calculated, mmsNum, rmsNum);
      setCalculationError(qmsValidationError);
    } else {
      setCalculationError(null);
    }

    // Update Qms
    setQms(qmsCalculated);
  }, [mms, kms, rms, f0Calculated, qmsCalculated, mmsNum, rmsNum]);

  return (
    <section className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6" aria-labelledby="qms-section-title" role="region" aria-live="polite">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="qms-section-title">
        Qms計算（機械的Q値）
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">入力値</h4>
          
          <div className="flex items-center gap-2">
            <InputField
              label="F0"
              value={f0 !== null ? f0.toFixed(4) : ''}
              onChange={() => {}}
              unit="Hz"
              id="qms-f0-display"
            />
            <HelpTooltip content="共振周波数。F0計算セクションから自動的に取得されます。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="Mms"
              value={mms}
              onChange={() => {}}
              unit="g"
              id="qms-mms-display"
            />
            <HelpTooltip content="振動系の質量。F0計算セクションから自動的に取得されます。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="Rms"
              value={rms}
              onChange={setRms}
              unit="kg/s"
              id="rms-input"
              error={rmsError || undefined}
            />
            <HelpTooltip content="機械的抵抗。スピーカーの振動系における機械的損失を表します。" />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">単位変換</h4>
          <ResultDisplay
            label="Mms"
            value={parseNumeric(mms) !== null ? parseNumeric(mms)! / 1000 : null}
            unit="kg"
            precision={6}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <FormulaDisplay
          formula="Qms = 2π × F0 × Mms / Rms"
          variables={[
            { symbol: 'Qms', description: '機械的Q値（無次元）' },
            { symbol: 'F0', description: '共振周波数', unit: 'Hz' },
            { symbol: 'Mms', description: '振動系の質量', unit: 'kg' },
            { symbol: 'Rms', description: '機械的抵抗', unit: 'kg/s' },
          ]}
        />
        {calculationError && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{calculationError}</p>
          </div>
        )}
        <ResultDisplay
          label="Qms"
          value={qms}
          unit=""
          precision={4}
        />
      </div>
    </section>
  );
};
