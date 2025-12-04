import React, { useState, useEffect, useMemo } from 'react';
import { InputField } from '../../common/InputField';
import { ResultDisplay } from '../../common/ResultDisplay';
import { FormulaDisplay } from '../../common/FormulaDisplay';
import { HelpTooltip } from '../../common/HelpTooltip';
import { calculateQes, calculateQms, calculateQts, calculateF0 } from '../../../lib/calculations/ts-parameters';
import { useCalculatorState } from '../../../contexts/CalculatorStateContext';
import { validateQtsInputs } from '../../../lib/validation/validation';

/**
 * Qts（総合Q値）計算セクションコンポーネント
 * 
 * スピーカーの総合的なQ値を計算します。
 * Qes（電気的Q値）とQms（機械的Q値）から計算されます。
 * 
 * @component
 * @example
 * ```tsx
 * <QtsCalculationSection />
 * ```
 * 
 * @remarks
 * - Qes = 2π × F0 × Mms × Re / Bl²
 * - Qms = 2π × F0 × Mms / Rms
 * - Qts = (Qes × Qms) / (Qes + Qms)
 * - Qtsは常にQesとQmsより小さい値になります
 * 
 * @returns Qts計算セクションのReactコンポーネント
 */
export const QtsCalculationSection: React.FC = () => {
  const { states } = useCalculatorState();
  const tsState = states.tsParameters;

  // Get values from context
  const re = tsState.re;
  const bl = tsState.bl;
  const rms = tsState.rms;
  const mms = tsState.mms;
  const kms = tsState.kms;

  // State for calculation results
  const [qes, setQes] = useState<number | null>(null);
  const [qms, setQms] = useState<number | null>(null);
  const [qts, setQts] = useState<number | null>(null);
  const [f0, setF0] = useState<number | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  // Helper function to parse numeric input
  const parseNumeric = (value: string): number | null => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || value.trim() === '' ? null : parsed;
  };

  // Memoize parsed numeric values
  const reNum = useMemo(() => parseNumeric(re), [re]);
  const blNum = useMemo(() => parseNumeric(bl), [bl]);
  const rmsNum = useMemo(() => parseNumeric(rms), [rms]);
  const mmsNum = useMemo(() => parseNumeric(mms), [mms]);
  const kmsNum = useMemo(() => parseNumeric(kms), [kms]);

  // Memoize F0 calculation
  const f0Calculated = useMemo(() => {
    if (mmsNum !== null && kmsNum !== null && mmsNum > 0 && kmsNum > 0) {
      return calculateF0(mmsNum, kmsNum);
    }
    return null;
  }, [mmsNum, kmsNum]);

  // Memoize Qes calculation
  const qesCalculated = useMemo(() => {
    if (f0Calculated !== null && reNum !== null && blNum !== null && 
        mmsNum !== null && reNum > 0 && blNum > 0) {
      try {
        return calculateQes(f0Calculated, reNum, mmsNum, blNum);
      } catch (error) {
        return null;
      }
    }
    return null;
  }, [f0Calculated, reNum, blNum, mmsNum]);

  // Memoize Qms calculation
  const qmsCalculated = useMemo(() => {
    if (f0Calculated !== null && mmsNum !== null && rmsNum !== null && rmsNum > 0) {
      try {
        return calculateQms(f0Calculated, mmsNum, rmsNum);
      } catch (error) {
        return null;
      }
    }
    return null;
  }, [f0Calculated, mmsNum, rmsNum]);

  // Memoize Qts calculation
  const qtsCalculated = useMemo(() => {
    if (qesCalculated !== null && qmsCalculated !== null) {
      const qtsValidationError = validateQtsInputs(qesCalculated, qmsCalculated);
      if (!qtsValidationError) {
        try {
          return calculateQts(qesCalculated, qmsCalculated);
        } catch (error) {
          return null;
        }
      }
    }
    return null;
  }, [qesCalculated, qmsCalculated]);

  // Reactive calculation logic
  useEffect(() => {
    setF0(f0Calculated);
    setQes(qesCalculated);
    setQms(qmsCalculated);
    setQts(qtsCalculated);

    // Validate Qts calculation inputs
    if (qesCalculated !== null && qmsCalculated !== null) {
      const qtsValidationError = validateQtsInputs(qesCalculated, qmsCalculated);
      setCalculationError(qtsValidationError);
    } else {
      setCalculationError(null);
    }
  }, [f0Calculated, qesCalculated, qmsCalculated, qtsCalculated]);

  return (
    <section className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6" aria-labelledby="qts-section-title" role="region" aria-live="polite">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="qts-section-title">
        Qts計算（総合Q値）
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">入力値</h4>
          
          <div className="flex items-center gap-2">
            <InputField
              label="Re"
              value={re}
              onChange={() => {}}
              unit="Ω"
              id="qts-re-display"
            />
            <HelpTooltip content="ボイスコイルのDC抵抗値。その他のパラメータセクションから自動的に取得されます。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="Bl"
              value={bl}
              onChange={() => {}}
              unit="N/A"
              id="qts-bl-display"
            />
            <HelpTooltip content="力係数。その他のパラメータセクションから自動的に取得されます。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="Rms"
              value={rms}
              onChange={() => {}}
              unit="kg/s"
              id="qts-rms-display"
            />
            <HelpTooltip content="機械的抵抗。Qms計算セクションから自動的に取得されます。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="F0"
              value={f0 !== null ? f0.toFixed(4) : ''}
              onChange={() => {}}
              unit="Hz"
              id="qts-f0-display"
            />
            <HelpTooltip content="共振周波数。F0計算セクションから自動的に取得されます。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="Mms"
              value={mms}
              onChange={() => {}}
              unit="g"
              id="qts-mms-display"
            />
            <HelpTooltip content="振動系の質量。F0計算セクションから自動的に取得されます。" />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">中間計算結果</h4>
          <ResultDisplay
            label="Qes（電気的Q値）"
            value={qes}
            unit=""
            precision={4}
          />
          <ResultDisplay
            label="Qms（機械的Q値）"
            value={qms}
            unit=""
            precision={4}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <FormulaDisplay
          formula="Qes = 2π × F0 × Re × Mms / Bl²"
          variables={[
            { symbol: 'Qes', description: '電気的Q値（無次元）' },
            { symbol: 'F0', description: '共振周波数', unit: 'Hz' },
            { symbol: 'Re', description: 'DC抵抗', unit: 'Ω' },
            { symbol: 'Mms', description: '振動系の質量', unit: 'kg' },
            { symbol: 'Bl', description: '力係数', unit: 'N/A' },
          ]}
        />

        <FormulaDisplay
          formula="Qms = 2π × F0 × Mms / Rms"
          variables={[
            { symbol: 'Qms', description: '機械的Q値（無次元）' },
            { symbol: 'F0', description: '共振周波数', unit: 'Hz' },
            { symbol: 'Mms', description: '振動系の質量', unit: 'kg' },
            { symbol: 'Rms', description: '機械的抵抗', unit: 'kg/s' },
          ]}
        />

        <FormulaDisplay
          formula="Qts = (Qes × Qms) / (Qes + Qms)"
          variables={[
            { symbol: 'Qts', description: '総合Q値（無次元）' },
            { symbol: 'Qes', description: '電気的Q値' },
            { symbol: 'Qms', description: '機械的Q値' },
          ]}
        />
        
        {calculationError && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{calculationError}</p>
          </div>
        )}
        
        <ResultDisplay
          label="Qts"
          value={qts}
          unit=""
          precision={4}
        />
      </div>
    </section>
  );
};
