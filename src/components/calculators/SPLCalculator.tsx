import React, { useState, useEffect } from 'react';
import { InputField } from '../common/InputField';
import { ResultDisplay } from '../common/ResultDisplay';
import { FormulaDisplay } from '../common/FormulaDisplay';
import { HelpTooltip } from '../common/HelpTooltip';
import {
  calculateSoundPressure,
  convertToDBSPL,
  calculateQts,
  calculateFrequencyResponse,
} from '../../lib/calculations/spl';
import type { SPLInputs, SPLResult } from '../../lib/types/spl';
import { useCalculatorState } from '../../contexts/CalculatorStateContext';

export const SPLCalculator: React.FC = () => {
  const { states, updateSPLState } = useCalculatorState();
  const splState = states.spl;

  // Use context state
  const airDensity = splState.airDensity;
  const effectiveRadius = splState.effectiveRadius;
  const mms = splState.mms;
  const f0 = splState.f0;
  const re = splState.re;
  const micDistance = splState.micDistance;
  const inputVoltage = splState.inputVoltage;
  const rms = splState.rms;
  const bl = splState.bl;
  const frequency = splState.frequency;

  // Setter functions that update context
  const setAirDensity = (value: string) => updateSPLState({ airDensity: value });
  const setEffectiveRadius = (value: string) => updateSPLState({ effectiveRadius: value });
  const setMms = (value: string) => updateSPLState({ mms: value });
  const setF0 = (value: string) => updateSPLState({ f0: value });
  const setRe = (value: string) => updateSPLState({ re: value });
  const setMicDistance = (value: string) => updateSPLState({ micDistance: value });
  const setInputVoltage = (value: string) => updateSPLState({ inputVoltage: value });
  const setRms = (value: string) => updateSPLState({ rms: value });
  const setBl = (value: string) => updateSPLState({ bl: value });
  const setFrequency = (value: string) => updateSPLState({ frequency: value });

  // State for calculation results
  const [qts, setQts] = useState<number | null>(null);
  const [soundPressure, setSoundPressure] = useState<number | null>(null);
  const [spl, setSpl] = useState<number | null>(null);
  const [frequencyResponse, setFrequencyResponse] = useState<SPLResult[]>([]);

  // Helper function to parse numeric input
  const parseNumeric = (value: string): number | null => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || value.trim() === '' ? null : parsed;
  };

  // Check if all required inputs are available
  const hasAllInputs = (): boolean => {
    return [
      airDensity,
      effectiveRadius,
      mms,
      f0,
      re,
      micDistance,
      inputVoltage,
      rms,
      bl,
    ].every(val => parseNumeric(val) !== null && parseNumeric(val)! > 0);
  };

  // Reactive calculation logic - recalculate when inputs change
  useEffect(() => {
    const airDensityNum = parseNumeric(airDensity);
    const effectiveRadiusNum = parseNumeric(effectiveRadius);
    const mmsNum = parseNumeric(mms);
    const f0Num = parseNumeric(f0);
    const reNum = parseNumeric(re);
    const micDistanceNum = parseNumeric(micDistance);
    const inputVoltageNum = parseNumeric(inputVoltage);
    const rmsNum = parseNumeric(rms);
    const blNum = parseNumeric(bl);
    const frequencyNum = parseNumeric(frequency);

    // Calculate Qts if required parameters are available
    if (
      f0Num !== null && mmsNum !== null && blNum !== null && 
      reNum !== null && rmsNum !== null &&
      f0Num > 0 && mmsNum > 0 && blNum > 0 && reNum > 0 && rmsNum > 0
    ) {
      setQts(calculateQts(f0Num, mmsNum, blNum, reNum, rmsNum));
    } else {
      setQts(null);
    }

    // Calculate sound pressure and SPL if all inputs and frequency are available
    if (hasAllInputs() && frequencyNum !== null && frequencyNum > 0) {
      const inputs: SPLInputs = {
        airDensity: airDensityNum!,
        effectiveRadius: effectiveRadiusNum!,
        mms: mmsNum!,
        f0: f0Num!,
        re: reNum!,
        micDistance: micDistanceNum!,
        inputVoltage: inputVoltageNum!,
        rms: rmsNum!,
        bl: blNum!,
        frequency: frequencyNum,
      };

      const pressure = calculateSoundPressure(inputs);
      setSoundPressure(pressure);
      setSpl(convertToDBSPL(pressure));
    } else {
      setSoundPressure(null);
      setSpl(null);
    }

    // Calculate frequency response if all inputs are available (except specific frequency)
    if (hasAllInputs()) {
      const inputs: SPLInputs = {
        airDensity: airDensityNum!,
        effectiveRadius: effectiveRadiusNum!,
        mms: mmsNum!,
        f0: f0Num!,
        re: reNum!,
        micDistance: micDistanceNum!,
        inputVoltage: inputVoltageNum!,
        rms: rmsNum!,
        bl: blNum!,
        frequency: 1000, // Placeholder, will be overridden
      };

      setFrequencyResponse(calculateFrequencyResponse(inputs));
    } else {
      setFrequencyResponse([]);
    }
  }, [airDensity, effectiveRadius, mms, f0, re, micDistance, inputVoltage, rms, bl, frequency]);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6" id="calculator-title">
        SPL計算機（音圧レベル）
      </h2>

      <section className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6" aria-labelledby="input-section-title">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="input-section-title">入力パラメータ</h3>
        
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
            label="F0 (共振周波数)"
            value={f0}
            onChange={setF0}
            unit="Hz"
            id="f0-input"
          />
          <HelpTooltip content="スピーカーの共振周波数です。" />
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
            label="マイク距離"
            value={micDistance}
            onChange={setMicDistance}
            unit="m"
            id="mic-distance-input"
          />
          <HelpTooltip content="測定マイクとスピーカーの距離です。" />
        </div>

        <div className="flex items-center gap-2">
          <InputField
            label="入力電圧"
            value={inputVoltage}
            onChange={setInputVoltage}
            unit="V"
            id="input-voltage-input"
          />
          <HelpTooltip content="スピーカーに入力する電圧です。" />
        </div>

        <div className="flex items-center gap-2">
          <InputField
            label="Rms (機械抵抗)"
            value={rms}
            onChange={setRms}
            unit="kg/s"
            id="rms-input"
          />
          <HelpTooltip content="機械的抵抗。振動系の減衰を表します。" />
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
            label="周波数（単一計算用）"
            value={frequency}
            onChange={setFrequency}
            unit="Hz"
            id="frequency-input"
          />
          <HelpTooltip content="特定の周波数でのSPLを計算する場合に入力します。" />
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6" aria-labelledby="results-section-title" aria-live="polite">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="results-section-title">計算結果</h3>
        
        <FormulaDisplay
          formula="Qts = 2π × F0 × Mms / (Bl² / Re + Rms)"
          variables={[
            { symbol: 'Qts', description: '総合Q値' },
            { symbol: 'F0', description: '共振周波数', unit: 'Hz' },
            { symbol: 'Mms', description: '振動系の質量', unit: 'kg' },
            { symbol: 'Bl', description: '力係数', unit: 'N/A' },
            { symbol: 'Re', description: 'DC抵抗', unit: 'Ω' },
            { symbol: 'Rms', description: '機械抵抗', unit: 'kg/s' },
          ]}
        />
        <ResultDisplay
          label="Qts (総合Q値)"
          value={qts}
          unit=""
          precision={4}
        />

        <FormulaDisplay
          formula="P = P0 × x / sqrt(1/Qts² + (x - 1/x)²), where x = f/f0"
          variables={[
            { symbol: 'P', description: '音圧', unit: 'Pa' },
            { symbol: 'P0', description: '基準音圧', unit: 'Pa' },
            { symbol: 'f', description: '周波数', unit: 'Hz' },
            { symbol: 'f0', description: '共振周波数', unit: 'Hz' },
          ]}
        />
        <ResultDisplay
          label="音圧"
          value={soundPressure}
          unit="Pa"
          precision={6}
        />

        <FormulaDisplay
          formula="SPL = 20 × log10(P / 2×10⁻⁵)"
          variables={[
            { symbol: 'SPL', description: '音圧レベル', unit: 'dB' },
            { symbol: 'P', description: '音圧', unit: 'Pa' },
          ]}
        />
        <ResultDisplay
          label="SPL (音圧レベル)"
          value={spl}
          unit="dB"
          precision={2}
        />
      </section>

      {frequencyResponse.length > 0 && (
        <section className="bg-white rounded-lg shadow p-4 sm:p-6" aria-labelledby="frequency-response-title">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="frequency-response-title">周波数応答</h3>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    周波数 (Hz)
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    音圧 (Pa)
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SPL (dB)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {frequencyResponse.map((result) => (
                  <tr key={result.frequency} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {result.frequency}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {result.pressure.toExponential(4)}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {result.spl.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
