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
import {
  QmsCalculationSection,
  QtsCalculationSection,
  AmplitudeCalculationSection,
  SPLCalculationSection,
  FrequencyResponseSection,
  ThinFilmResistanceSection,
  XmaxCalculationSection,
  OpenTubeResonanceSection,
} from './sections';

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
    <div className="max-w-6xl mx-auto space-y-6" role="main">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#calculator-title"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        メインコンテンツへスキップ
      </a>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6" id="calculator-title">
        TSパラメータ計算機
      </h1>

      {/* F0計算セクション */}
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

      {/* 空気負荷質量の計算セクション */}
      <section className="bg-white rounded-lg shadow p-4 sm:p-6" aria-labelledby="air-load-section-title" aria-live="polite" role="region">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="air-load-section-title">空気負荷質量の計算</h3>
        
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
      </section>

      {/* 入力電圧計算セクション */}
      <section className="bg-white rounded-lg shadow p-4 sm:p-6" aria-labelledby="voltage-section-title" aria-live="polite" role="region">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="voltage-section-title">入力電圧計算</h3>
        
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

      {/* Vas計算セクション */}
      <section className="bg-white rounded-lg shadow p-4 sm:p-6" aria-labelledby="vas-section-title" aria-live="polite" role="region">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="vas-section-title">Vasの計算</h3>
        
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
      </section>

      {/* Qes計算セクション */}
      <section className="bg-white rounded-lg shadow p-4 sm:p-6" aria-labelledby="qes-section-title" aria-live="polite" role="region">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="qes-section-title">Qesの計算</h3>
        
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
      </section>

      {/* その他のパラメータ */}
      <section className="bg-white rounded-lg shadow p-4 sm:p-6" aria-labelledby="other-params-title" role="region">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="other-params-title">その他のパラメータ</h3>
        
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

      {/* Qms計算セクション */}
      <QmsCalculationSection />

      {/* Qts計算セクション */}
      <QtsCalculationSection />

      {/* 振幅の計算セクション */}
      <AmplitudeCalculationSection />

      {/* 音圧の計算セクション */}
      <SPLCalculationSection />

      {/* 低音域音圧計算とグラフ表示セクション */}
      <FrequencyResponseSection />

      {/* 薄膜パターンの抵抗値計算セクション */}
      <ThinFilmResistanceSection />

      {/* ドイツのXmax計算セクション */}
      <XmaxCalculationSection />

      {/* 開管の気中共鳴周波数計算セクション */}
      <OpenTubeResonanceSection />
    </div>
  );
};
