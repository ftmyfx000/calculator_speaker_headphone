import React, { useState, useEffect } from 'react';
import { InputField } from '../../common/InputField';
import { ResultDisplay } from '../../common/ResultDisplay';
import { FormulaDisplay } from '../../common/FormulaDisplay';
import { HelpTooltip } from '../../common/HelpTooltip';
import { calculateInputVoltage } from '../../../lib/calculations/ts-parameters';
import { useCalculatorState } from '../../../contexts/CalculatorStateContext';

export const InputVoltagePage: React.FC = () => {
  const { states, updateTSParameterState } = useCalculatorState();
  const tsState = states.tsParameters;

  const re = tsState.re;
  const power = tsState.power;

  const setRe = (value: string) => updateTSParameterState({ re: value });
  const setPower = (value: string) => updateTSParameterState({ power: value });

  const [inputVoltage, setInputVoltage] = useState<number | null>(null);

  const parseNumeric = (value: string): number | null => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || value.trim() === '' ? null : parsed;
  };

  useEffect(() => {
    const reNum = parseNumeric(re);
    const powerNum = parseNumeric(power);

    if (reNum !== null && powerNum !== null && reNum > 0 && powerNum > 0) {
      setInputVoltage(calculateInputVoltage(reNum, powerNum));
    } else {
      setInputVoltage(null);
    }
  }, [re, power]);

  return (
    <div className="max-w-6xl mx-auto space-y-6" role="main">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        入力電圧計算
      </h1>

      <section className="bg-white rounded-lg shadow p-4 sm:p-6" aria-labelledby="voltage-section-title" aria-live="polite" role="region">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="voltage-section-title">入力電圧計算</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">入力値</h4>
            <div className="flex items-center gap-2">
              <InputField
                label="DC抵抗 (Re)"
                value={re}
                onChange={setRe}
                unit="Ω"
                id="re-input"
              />
              <HelpTooltip content="ボイスコイルのDC抵抗値です。" />
            </div>
            <div className="flex items-center gap-2">
              <InputField
                label="入力電力 (P)"
                value={power}
                onChange={setPower}
                unit="W"
                id="power-input"
              />
              <HelpTooltip content="スピーカーに入力する電力（ワット数）です。" />
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">計算結果</h4>
            <ResultDisplay
              label="入力電圧"
              value={inputVoltage}
              unit="V"
              precision={4}
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <FormulaDisplay
            formula="V = sqrt(Re × P)"
            variables={[
              { symbol: 'V', description: '入力電圧', unit: 'V' },
              { symbol: 'Re', description: 'DC抵抗', unit: 'Ω' },
              { symbol: 'P', description: '入力電力', unit: 'W' },
            ]}
          />
        </div>
      </section>
    </div>
  );
};
