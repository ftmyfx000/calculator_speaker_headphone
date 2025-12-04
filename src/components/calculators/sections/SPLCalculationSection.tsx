import React, { useState, useEffect, useMemo } from 'react';
import { InputField } from '../../common/InputField';
import { ResultDisplay } from '../../common/ResultDisplay';
import { FormulaDisplay } from '../../common/FormulaDisplay';
import { HelpTooltip } from '../../common/HelpTooltip';
import { calculateAdvancedSPL } from '../../../lib/calculations/spl-advanced';
import { calculateF0 } from '../../../lib/calculations/ts-parameters';
import { useCalculatorState } from '../../../contexts/CalculatorStateContext';

/**
 * 音圧計算セクションコンポーネント
 * 
 * スピーカーパラメータから音圧レベル（SPL）を計算します。
 * 
 * @component
 * @example
 * ```tsx
 * <SPLCalculationSection />
 * ```
 * 
 * @remarks
 * - Qts、sec2、sec3の中間計算結果も表示されます
 * - Qts = 2π × F0 × Mms / (Bl² / Re + Rms)
 * - sec2 = ρ × a² × V × Bl / (2 × distance × Mms × Re)
 * - sec3 = (f / F0) × (√(1/Qts² + (f/F0 - F0/f)²))^(-1)
 * - SPL = 20 × log10(sec2 × sec3 / P0)
 * 
 * @returns 音圧計算セクションのReactコンポーネント
 */
export const SPLCalculationSection: React.FC = () => {
  const { states, updateTSParameterState } = useCalculatorState();
  const tsState = states.tsParameters;

  // Get values from context
  const airDensity = tsState.airDensity;
  const effectiveRadius = tsState.effectiveRadius;
  const mms = tsState.mms;
  const kms = tsState.kms;
  const re = tsState.re;
  const micDistance = tsState.micDistance;
  const inputVoltage = tsState.inputVoltage;
  const rms = tsState.rms;
  const bl = tsState.bl;
  const frequency = tsState.frequency;

  // Setter functions
  const setMicDistance = (value: string) => updateTSParameterState({ micDistance: value });
  const setInputVoltage = (value: string) => updateTSParameterState({ inputVoltage: value });

  // State for calculation results
  const [spl, setSpl] = useState<number | null>(null);
  const [qts, setQts] = useState<number | null>(null);
  const [sec2, setSec2] = useState<number | null>(null);
  const [sec3, setSec3] = useState<number | null>(null);
  const [f0, setF0] = useState<number | null>(null);

  // Helper function to parse numeric input
  const parseNumeric = (value: string): number | null => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || value.trim() === '' ? null : parsed;
  };

  // Memoize parsed numeric values
  const airDensityNum = useMemo(() => parseNumeric(airDensity), [airDensity]);
  const effectiveRadiusNum = useMemo(() => parseNumeric(effectiveRadius), [effectiveRadius]);
  const mmsNum = useMemo(() => parseNumeric(mms), [mms]);
  const kmsNum = useMemo(() => parseNumeric(kms), [kms]);
  const reNum = useMemo(() => parseNumeric(re), [re]);
  const micDistanceNum = useMemo(() => parseNumeric(micDistance), [micDistance]);
  const inputVoltageNum = useMemo(() => parseNumeric(inputVoltage), [inputVoltage]);
  const rmsNum = useMemo(() => parseNumeric(rms), [rms]);
  const blNum = useMemo(() => parseNumeric(bl), [bl]);
  const frequencyNum = useMemo(() => parseNumeric(frequency), [frequency]);

  // Memoize F0 calculation
  const f0Calculated = useMemo(() => {
    if (mmsNum !== null && kmsNum !== null && mmsNum > 0 && kmsNum > 0) {
      return calculateF0(mmsNum, kmsNum);
    }
    return null;
  }, [mmsNum, kmsNum]);

  // Memoize SPL calculation
  const splResult = useMemo(() => {
    if (
      f0Calculated !== null &&
      airDensityNum !== null &&
      effectiveRadiusNum !== null &&
      mmsNum !== null &&
      reNum !== null &&
      micDistanceNum !== null &&
      inputVoltageNum !== null &&
      rmsNum !== null &&
      blNum !== null &&
      frequencyNum !== null &&
      airDensityNum > 0 &&
      effectiveRadiusNum > 0 &&
      reNum > 0 &&
      micDistanceNum > 0 &&
      blNum > 0 &&
      frequencyNum > 0
    ) {
      // Convert units for calculation
      const effectiveRadiusM = effectiveRadiusNum / 1000; // mm to m
      const mmsKg = mmsNum / 1000; // g to kg

      try {
        return calculateAdvancedSPL({
          airDensity: airDensityNum,
          effectiveRadius: effectiveRadiusM,
          mms: mmsKg,
          f0: f0Calculated,
          re: reNum,
          micDistance: micDistanceNum,
          inputVoltage: inputVoltageNum,
          rms: rmsNum,
          bl: blNum,
          frequency: frequencyNum,
        });
      } catch (error) {
        return null;
      }
    }
    return null;
  }, [f0Calculated, airDensityNum, effectiveRadiusNum, mmsNum, reNum, 
      micDistanceNum, inputVoltageNum, rmsNum, blNum, frequencyNum]);

  // Reactive calculation logic
  useEffect(() => {
    setF0(f0Calculated);

    if (splResult) {
      setSpl(splResult.spl);
      setQts(splResult.qts);
      setSec2(splResult.sec2);
      setSec3(splResult.sec3);
    } else {
      setSpl(null);
      setQts(null);
      setSec2(null);
      setSec3(null);
    }
  }, [f0Calculated, splResult]);

  return (
    <section className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6" aria-labelledby="spl-section-title" role="region" aria-live="polite">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="spl-section-title">
        音圧の計算
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">入力値</h4>
          
          <div className="flex items-center gap-2">
            <InputField
              label="空気密度"
              value={airDensity}
              onChange={() => {}}
              unit="kg/m³"
              id="spl-air-density-display"
            />
            <HelpTooltip content="空気の密度。その他のパラメータセクションから自動的に取得されます。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="有効半径"
              value={effectiveRadius}
              onChange={() => {}}
              unit="mm"
              id="spl-effective-radius-display"
            />
            <HelpTooltip content="振動板の有効半径。その他のパラメータセクションから自動的に取得されます。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="Mms"
              value={mms}
              onChange={() => {}}
              unit="g"
              id="spl-mms-display"
            />
            <HelpTooltip content="振動系の質量。F0計算セクションから自動的に取得されます。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="F0"
              value={f0 !== null ? f0.toFixed(4) : ''}
              onChange={() => {}}
              unit="Hz"
              id="spl-f0-display"
            />
            <HelpTooltip content="共振周波数。F0計算セクションから自動的に計算されます。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="Re"
              value={re}
              onChange={() => {}}
              unit="Ω"
              id="spl-re-display"
            />
            <HelpTooltip content="DC抵抗。その他のパラメータセクションから自動的に取得されます。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="マイク距離"
              value={micDistance}
              onChange={setMicDistance}
              unit="m"
              id="mic-distance-input"
            />
            <HelpTooltip content="マイクロフォンとスピーカーの距離です。" />
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
              label="Rms"
              value={rms}
              onChange={() => {}}
              unit="kg/s"
              id="spl-rms-display"
            />
            <HelpTooltip content="機械的抵抗。Qms計算セクションから自動的に取得されます。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="Bl"
              value={bl}
              onChange={() => {}}
              unit="N/A"
              id="spl-bl-display"
            />
            <HelpTooltip content="力係数。その他のパラメータセクションから自動的に取得されます。" />
          </div>

          <div className="flex items-center gap-2">
            <InputField
              label="周波数"
              value={frequency}
              onChange={() => {}}
              unit="Hz"
              id="spl-frequency-display"
            />
            <HelpTooltip content="測定する周波数。振幅計算セクションから自動的に取得されます。" />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">中間計算結果</h4>
          <ResultDisplay
            label="Qts"
            value={qts}
            unit=""
            precision={4}
          />
          <ResultDisplay
            label="sec2"
            value={sec2}
            unit=""
            precision={6}
          />
          <ResultDisplay
            label="sec3"
            value={sec3}
            unit=""
            precision={6}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <FormulaDisplay
          formula="Qts = 2π × F0 × Mms / (Bl² / Re + Rms)"
          variables={[
            { symbol: 'Qts', description: '総合Q値' },
            { symbol: 'F0', description: '共振周波数', unit: 'Hz' },
            { symbol: 'Mms', description: '振動系の質量', unit: 'kg' },
            { symbol: 'Bl', description: '力係数', unit: 'N/A' },
            { symbol: 'Re', description: 'DC抵抗', unit: 'Ω' },
            { symbol: 'Rms', description: '機械的抵抗', unit: 'kg/s' },
          ]}
        />

        <FormulaDisplay
          formula="sec2 = ρ × a² × V × Bl / (2 × distance × Mms × Re)"
          variables={[
            { symbol: 'ρ', description: '空気密度', unit: 'kg/m³' },
            { symbol: 'a', description: '有効半径', unit: 'm' },
            { symbol: 'V', description: '入力電圧', unit: 'V' },
            { symbol: 'Bl', description: '力係数', unit: 'N/A' },
            { symbol: 'distance', description: 'マイク距離', unit: 'm' },
            { symbol: 'Mms', description: '振動系の質量', unit: 'kg' },
            { symbol: 'Re', description: 'DC抵抗', unit: 'Ω' },
          ]}
        />

        <FormulaDisplay
          formula="sec3 = (f / F0) × (√(1/Qts² + (f/F0 - F0/f)²))^(-1)"
          variables={[
            { symbol: 'f', description: '周波数', unit: 'Hz' },
            { symbol: 'F0', description: '共振周波数', unit: 'Hz' },
            { symbol: 'Qts', description: '総合Q値' },
          ]}
        />

        <FormulaDisplay
          formula="SPL = 20 × log10(sec2 × sec3 / P0)"
          variables={[
            { symbol: 'SPL', description: '音圧レベル', unit: 'dB' },
            { symbol: 'P0', description: '基準音圧 (2×10⁻⁵ Pa)' },
          ]}
        />

        <ResultDisplay
          label="SPL"
          value={spl}
          unit="dB"
          precision={2}
        />
      </div>
    </section>
  );
};
