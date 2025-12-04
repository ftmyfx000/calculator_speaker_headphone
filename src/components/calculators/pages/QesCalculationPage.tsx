import React, { useState, useEffect } from 'react';
import { InputField } from '../../common/InputField';
import { ResultDisplay } from '../../common/ResultDisplay';
import { FormulaDisplay } from '../../common/FormulaDisplay';
import { HelpTooltip } from '../../common/HelpTooltip';
import { calculateQes, calculateF0 } from '../../../lib/calculations/ts-parameters';
import { useCalculatorState } from '../../../contexts/CalculatorStateContext';

export const QesCalculationPage: React.FC = () => {
  const { states, updateTSParameterState } = useCalculatorState();
  const tsState = states.tsParameters;

  const re = tsState.re;
  const mms = tsState.mms;
  const bl = tsState.bl;
  const kms = tsState.kms;

  const setRe = (value: string) => updateTSParameterState({ re: value });
  const setMms = (value: string) => updateTSParameterState({ mms: value });
  const setBl = (value: string) => updateTSParameterState({ bl: value });

  const [qes, setQes] = useState<number | null>(null);
  const [f0, setF0] = useState<number | null>(null);

  const parseNumeric = (value: string): number | null => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || value.trim() === '' ? null : parsed;
  };

  useEffect(() => {
    const mmsNum = parseNumeric(mms);
    const kmsNum = parseNumeric(kms);
    const reNum = parseNumeric(re);
    const blNum = parseNumeric(bl);

    if (mmsNum !== null && kmsNum !== null && reNum !== null && blNum !== null &&
        mmsNum > 0 && kmsNum > 0 && reNum > 0 && blNum > 0) {
      const f0Value = calculateF0(mmsNum, kmsNum);
      setF0(f0Value);
      setQes(calculateQes(f0Value, reNum, mmsNum, blNum));
    } else {
      setF0(null);
      setQes(null);
    }
  }, [mms, kms, re, bl]);

  return (
    <div className="max-w-6xl mx-auto space-y-6" role="main">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        Qes計算
      </h1>

      <section className="bg-white rounded-lg shadow p-4 sm:p-6" aria-labelledby="qes-section-title" aria-live="polite" role="region">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="qes-section-title">Qesの計算</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">入力値</h4>
            <div className="flex items-center gap-2">
              <InputField
                label="DC抵抗 (Re)"
                value={re}
                onChange={setRe}
                unit="Ω"
                id="qes-re-input"
              />
              <HelpTooltip content="ボイスコイルのDC抵抗値です。" />
            </div>
            <div className="flex items-center gap-2">
              <InputField
                label="振動系の質量 (Mms)"
                value={mms}
                onChange={setMms}
                unit="g"
                id="qes-mms-input"
              />
              <HelpTooltip content="振動系の質量。スピーカーの振動板、ボイスコイル、およびその他の可動部品の合計質量です。" />
            </div>
            <div className="flex items-center gap-2">
              <InputField
                label="力係数 (Bl)"
                value={bl}
                onChange={setBl}
                unit="N/A"
                id="qes-bl-input"
              />
              <HelpTooltip content="力係数。磁束密度とボイスコイルの長さの積で、電流を力に変換する効率を表します。" />
            </div>
            <ResultDisplay
              label="F0 (共振周波数)"
              value={f0}
              unit="Hz"
              precision={4}
            />
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">計算結果</h4>
            <ResultDisplay
              label="Qes (電気的Q値)"
              value={qes}
              unit=""
              precision={4}
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <FormulaDisplay
            formula="Qes = 2π × F0 × Re × Mms / Bl²"
            variables={[
              { symbol: 'Qes', description: '電気的Q値' },
              { symbol: 'F0', description: '共振周波数', unit: 'Hz' },
              { symbol: 'Re', description: 'DC抵抗', unit: 'Ω' },
              { symbol: 'Mms', description: '振動系の質量', unit: 'kg' },
              { symbol: 'Bl', description: '力係数', unit: 'N/A' },
            ]}
          />
        </div>
      </section>
    </div>
  );
};
