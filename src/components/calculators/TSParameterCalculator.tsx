import React, { useState, useEffect } from 'react';
import { InputField } from '../common/InputField';
import { ResultDisplay } from '../common/ResultDisplay';
import { FormulaDisplay } from '../common/FormulaDisplay';
import { HelpTooltip } from '../common/HelpTooltip';
import {
  calculateF0,
  calculateVas,
  calculateQes,
  calculateAirLoadMass,
  calculateInputVoltage,
} from '../../lib/calculations/ts-parameters';
import { useCalculatorState } from '../../contexts/CalculatorStateContext';

export const TSParameterCalculator: React.FC = () => {
  const { states, updateTSParameterState } = useCalculatorState();
  const tsState = states.tsParameters;

  // Use context state
  const mms = tsState.mms;
  const kms = tsState.kms;
  const bl = tsState.bl;
  const re = tsState.re;
  const effectiveRadius = tsState.effectiveRadius;
  const airDensity = tsState.airDensity;
  const power = tsState.power;

  // Setter functions that update context
  const setMms = (value: string) => updateTSParameterState({ mms: value });
  const setKms = (value: string) => updateTSParameterState({ kms: value });
  const setBl = (value: string) => updateTSParameterState({ bl: value });
  const setRe = (value: string) => updateTSParameterState({ re: value });
  const setEffectiveRadius = (value: string) => updateTSParameterState({ effectiveRadius: value });
  const setAirDensity = (value: string) => updateTSParameterState({ airDensity: value });
  const setPower = (value: string) => updateTSParameterState({ power: value });

  // State for calculation results
  const [f0, setF0] = useState<number | null>(null);
  const [vas, setVas] = useState<number | null>(null);
  const [qes, setQes] = useState<number | null>(null);
  const [airLoadMassFree, setAirLoadMassFree] = useState<number | null>(null);
  const [airLoadMassBaffle, setAirLoadMassBaffle] = useState<number | null>(null);
  const [inputVoltage, setInputVoltage] = useState<number | null>(null);

  // Helper function to parse numeric input
  const parseNumeric = (value: string): number | null => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || value.trim() === '' ? null : parsed;
  };

  // Reactive calculation logic - recalculate when inputs change
  useEffect(() => {
    const mmsNum = parseNumeric(mms);
    const kmsNum = parseNumeric(kms);
    const blNum = parseNumeric(bl);
    const reNum = parseNumeric(re);
    const effectiveRadiusNum = parseNumeric(effectiveRadius);
    const airDensityNum = parseNumeric(airDensity);
    const powerNum = parseNumeric(power);

    // Calculate F0 if Mms and Kms are available
    if (mmsNum !== null && kmsNum !== null && mmsNum > 0 && kmsNum > 0) {
      setF0(calculateF0(mmsNum, kmsNum));
    } else {
      setF0(null);
    }

    // Calculate Vas if air density, effective radius, and Kms are available
    if (airDensityNum !== null && effectiveRadiusNum !== null && kmsNum !== null &&
        airDensityNum > 0 && effectiveRadiusNum > 0 && kmsNum > 0) {
      setVas(calculateVas(airDensityNum, effectiveRadiusNum, kmsNum));
    } else {
      setVas(null);
    }

    // Calculate Qes if F0, Re, Mms, and Bl are available
    if (mmsNum !== null && kmsNum !== null && reNum !== null && blNum !== null &&
        mmsNum > 0 && kmsNum > 0 && reNum > 0 && blNum > 0) {
      const f0Value = calculateF0(mmsNum, kmsNum);
      setQes(calculateQes(f0Value, reNum, mmsNum, blNum));
    } else {
      setQes(null);
    }

    // Calculate air load mass if effective radius and air density are available
    if (effectiveRadiusNum !== null && airDensityNum !== null &&
        effectiveRadiusNum > 0 && airDensityNum > 0) {
      const { airLoadMassFree: free, airLoadMassBaffle: baffle } = 
        calculateAirLoadMass(effectiveRadiusNum, airDensityNum);
      setAirLoadMassFree(free);
      setAirLoadMassBaffle(baffle);
    } else {
      setAirLoadMassFree(null);
      setAirLoadMassBaffle(null);
    }

    // Calculate input voltage if Re and power are available
    if (reNum !== null && powerNum !== null && reNum > 0 && powerNum > 0) {
      setInputVoltage(calculateInputVoltage(reNum, powerNum));
    } else {
      setInputVoltage(null);
    }
  }, [mms, kms, bl, re, effectiveRadius, airDensity, power]);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6" id="calculator-title">
        TSパラメータ計算機
      </h2>

      <section className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6" aria-labelledby="input-section-title">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="input-section-title">入力パラメータ</h3>
        
        <div className="flex items-center gap-2">
          <InputField
            label="Mms (振動系の質量)"
            value={mms}
            onChange={setMms}
            unit="g"
            id="mms-input"
          />
          <HelpTooltip content="振動系の質量。スピーカーの振動板、ボイスコイル、およびその他の可動部品の合計質量です。" />
        </div>

        <div className="flex items-center gap-2">
          <InputField
            label="Kms (機械的スティフネス)"
            value={kms}
            onChange={setKms}
            unit="N/mm"
            id="kms-input"
          />
          <HelpTooltip content="機械的スティフネス。スピーカーのサスペンション（スパイダーとエッジ）の硬さを表します。" />
        </div>

        <div className="flex items-center gap-2">
          <InputField
            label="Bl (力係数)"
            value={bl}
            onChange={setBl}
            unit="N/A"
            id="bl-input"
          />
          <HelpTooltip content="力係数。磁束密度とボイスコイルの長さの積で、電流を力に変換する効率を表します。" />
        </div>

        <div className="flex items-center gap-2">
          <InputField
            label="Re (DC抵抗)"
            value={re}
            onChange={setRe}
            unit="Ω"
            id="re-input"
          />
          <HelpTooltip content="ボイスコイルのDC抵抗値です。" />
        </div>

        <div className="flex items-center gap-2">
          <InputField
            label="有効半径"
            value={effectiveRadius}
            onChange={setEffectiveRadius}
            unit="mm"
            id="effective-radius-input"
          />
          <HelpTooltip content="振動板の有効半径。音を放射する実効的な半径です。" />
        </div>

        <div className="flex items-center gap-2">
          <InputField
            label="空気密度"
            value={airDensity}
            onChange={setAirDensity}
            unit="kg/m³"
            id="air-density-input"
          />
          <HelpTooltip content="空気の密度。標準状態（海面、20℃）では約1.225 kg/m³です。" />
        </div>

        <div className="flex items-center gap-2">
          <InputField
            label="入力電力"
            value={power}
            onChange={setPower}
            unit="W"
            id="power-input"
          />
          <HelpTooltip content="スピーカーに入力する電力（ワット数）です。" />
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-4 sm:p-6" aria-labelledby="results-section-title" aria-live="polite">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="results-section-title">計算結果</h3>
        
        <FormulaDisplay
          formula="F0 = sqrt(Kms / Mms) / (2π)"
          variables={[
            { symbol: 'F0', description: '共振周波数', unit: 'Hz' },
            { symbol: 'Kms', description: '機械的スティフネス', unit: 'N/m' },
            { symbol: 'Mms', description: '振動系の質量', unit: 'kg' },
          ]}
        />
        <ResultDisplay
          label="F0 (共振周波数)"
          value={f0}
          unit="Hz"
          precision={2}
        />

        <FormulaDisplay
          formula="Vas = ρ × c² × (π × a²)² / Kms × 1000"
          variables={[
            { symbol: 'Vas', description: '等価コンプライアンス容積', unit: 'L' },
            { symbol: 'ρ', description: '空気密度', unit: 'kg/m³' },
            { symbol: 'c', description: '音速 (346.1 m/s)' },
            { symbol: 'a', description: '有効半径', unit: 'm' },
            { symbol: 'Kms', description: '機械的スティフネス', unit: 'N/m' },
          ]}
        />
        <ResultDisplay
          label="Vas (等価コンプライアンス容積)"
          value={vas}
          unit="L"
          precision={4}
        />

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
        <ResultDisplay
          label="Qes (電気的Q値)"
          value={qes}
          unit=""
          precision={4}
        />

        <FormulaDisplay
          formula="Mair_free = (8/3) × ρ × a³ × 1000, Mair_baffle = (16/3) × ρ × a³ × 1000"
          variables={[
            { symbol: 'Mair', description: '空気負荷質量', unit: 'g' },
            { symbol: 'ρ', description: '空気密度', unit: 'kg/m³' },
            { symbol: 'a', description: '有効半径', unit: 'm' },
          ]}
        />
        <ResultDisplay
          label="空気負荷質量 (自由空間)"
          value={airLoadMassFree}
          unit="g"
          precision={4}
        />
        <ResultDisplay
          label="空気負荷質量 (無限バッフル)"
          value={airLoadMassBaffle}
          unit="g"
          precision={4}
        />

        <FormulaDisplay
          formula="V = sqrt(Re × P)"
          variables={[
            { symbol: 'V', description: '入力電圧', unit: 'V' },
            { symbol: 'Re', description: 'DC抵抗', unit: 'Ω' },
            { symbol: 'P', description: '入力電力', unit: 'W' },
          ]}
        />
        <ResultDisplay
          label="入力電圧"
          value={inputVoltage}
          unit="V"
          precision={4}
        />
      </section>
    </div>
  );
};
