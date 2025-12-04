import React, { useState, useEffect } from 'react';
import { InputField } from '../../common/InputField';
import { ResultDisplay } from '../../common/ResultDisplay';
import { FormulaDisplay } from '../../common/FormulaDisplay';
import { HelpTooltip } from '../../common/HelpTooltip';
import { calculateF0 } from '../../../lib/calculations/ts-parameters';
import { useCalculatorState } from '../../../contexts/CalculatorStateContext';

export const F0CalculationPage: React.FC = () => {
  const { states, updateTSParameterState } = useCalculatorState();
  const tsState = states.tsParameters;

  const mms = tsState.mms;
  const kms = tsState.kms;

  const setMms = (value: string) => updateTSParameterState({ mms: value });
  const setKms = (value: string) => updateTSParameterState({ kms: value });

  const [f0, setF0] = useState<number | null>(null);

  const parseNumeric = (value: string): number | null => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || value.trim() === '' ? null : parsed;
  };

  useEffect(() => {
    const mmsNum = parseNumeric(mms);
    const kmsNum = parseNumeric(kms);

    if (mmsNum !== null && kmsNum !== null && mmsNum > 0 && kmsNum > 0) {
      setF0(calculateF0(mmsNum, kmsNum));
    } else {
      setF0(null);
    }
  }, [mms, kms]);

  return (
    <div className="max-w-6xl mx-auto space-y-6" role="main">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        F0計算
      </h1>

      <section className="bg-white rounded-lg shadow p-4 sm:p-6" aria-labelledby="f0-section-title" role="region">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="f0-section-title">F0計算</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">入力値</h4>
            <div className="flex items-center gap-2">
              <InputField
                label="Mms"
                value={mms}
                onChange={setMms}
                unit="g"
                id="mms-input"
              />
              <HelpTooltip content="振動系の質量。スピーカーの振動板、ボイスコイル、およびその他の可動部品の合計質量です。" />
            </div>
            <div className="flex items-center gap-2">
              <InputField
                label="Kms"
                value={kms}
                onChange={setKms}
                unit="N/mm"
                id="kms-input"
              />
              <HelpTooltip content="機械的スティフネス。スピーカーのサスペンション（スパイダーとエッジ）の硬さを表します。" />
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
            <ResultDisplay
              label="Kms"
              value={parseNumeric(kms) !== null ? parseNumeric(kms)! * 1000 : null}
              unit="N/m"
              precision={2}
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <FormulaDisplay
            formula="F0 = sqrt(Kms / Mms) / (2π)"
            variables={[
              { symbol: 'F0', description: '共振周波数', unit: 'Hz' },
              { symbol: 'Kms', description: '機械的スティフネス', unit: 'N/m' },
              { symbol: 'Mms', description: '振動系の質量', unit: 'kg' },
            ]}
          />
          <ResultDisplay
            label="F0"
            value={f0}
            unit="Hz"
            precision={4}
          />
        </div>
      </section>
    </div>
  );
};
