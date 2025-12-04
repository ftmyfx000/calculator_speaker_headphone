import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { HelpTooltip } from '../../common/HelpTooltip';
import { calculateFrequencyResponse } from '../../../lib/calculations/spl-advanced';
import { calculateF0 } from '../../../lib/calculations/ts-parameters';
import { useCalculatorState } from '../../../contexts/CalculatorStateContext';

// Lazy load the FrequencyResponseChart component
const FrequencyResponseChart = lazy(() => 
  import('../../common/FrequencyResponseChart').then(module => ({
    default: module.FrequencyResponseChart
  }))
);

/**
 * 周波数応答セクションコンポーネント
 * 
 * スピーカーの周波数応答（10Hz～20kHz）を計算し、
 * テーブルとグラフで表示します。
 * 
 * @component
 * @example
 * ```tsx
 * <FrequencyResponseSection />
 * ```
 * 
 * @remarks
 * - 標準周波数ポイント（32ポイント）で計算されます
 * - テーブルには周波数、x=f/f0、音圧、SPL（dB）が表示されます
 * - グラフは対数スケールのX軸（周波数）と線形スケールのY軸（SPL）で表示されます
 * - グラフコンポーネントは遅延ロードされます
 * 
 * @returns 周波数応答セクションのReactコンポーネント
 */
export const FrequencyResponseSection: React.FC = () => {
  const { states } = useCalculatorState();
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

  // State for calculation results
  const [frequencyResponseData, setFrequencyResponseData] = useState<any[]>([]);
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

  // Memoize F0 calculation
  const f0Calculated = useMemo(() => {
    if (mmsNum !== null && kmsNum !== null && mmsNum > 0 && kmsNum > 0) {
      return calculateF0(mmsNum, kmsNum);
    }
    return null;
  }, [mmsNum, kmsNum]);

  // Memoize frequency response calculation
  const frequencyResponseCalculated = useMemo(() => {
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
      airDensityNum > 0 &&
      effectiveRadiusNum > 0 &&
      reNum > 0 &&
      micDistanceNum > 0 &&
      blNum > 0
    ) {
      // Convert units for calculation
      const effectiveRadiusM = effectiveRadiusNum / 1000; // mm to m
      const mmsKg = mmsNum / 1000; // g to kg

      try {
        return calculateFrequencyResponse({
          airDensity: airDensityNum,
          effectiveRadius: effectiveRadiusM,
          mms: mmsKg,
          f0: f0Calculated,
          re: reNum,
          micDistance: micDistanceNum,
          inputVoltage: inputVoltageNum,
          rms: rmsNum,
          bl: blNum,
        });
      } catch (error) {
        return [];
      }
    }
    return [];
  }, [f0Calculated, airDensityNum, effectiveRadiusNum, mmsNum, reNum, 
      micDistanceNum, inputVoltageNum, rmsNum, blNum]);

  // Reactive calculation logic
  useEffect(() => {
    setF0(f0Calculated);
    setFrequencyResponseData(frequencyResponseCalculated);
  }, [f0Calculated, frequencyResponseCalculated]);

  // Memoize chart data
  const chartData = useMemo(() => {
    return frequencyResponseData.map(point => ({
      frequency: point.frequency,
      spl: point.spl,
      xRatio: point.xRatio,
      pressure: point.pressure,
    }));
  }, [frequencyResponseData]);

  return (
    <section className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6" aria-labelledby="frequency-response-section-title" role="region">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800" id="frequency-response-section-title">
          低音域音圧計算とグラフ表示
        </h3>
        <HelpTooltip content="スピーカーの周波数応答特性を表示します。音圧計算セクションのパラメータを使用して、10Hz～20kHzの範囲で計算します。" />
      </div>

      {frequencyResponseData.length > 0 ? (
        <>
          {/* Graph */}
          <div className="mb-6">
            <Suspense fallback={
              <div className="w-full h-80 sm:h-96 bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
                  <p className="text-sm text-gray-600">グラフを読み込んでいます...</p>
                </div>
              </div>
            }>
              <FrequencyResponseChart data={chartData} />
            </Suspense>
          </div>

          {/* Table */}
          <div className="overflow-x-auto" role="region" aria-label="周波数応答データテーブル">
            <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm" aria-label="周波数応答の詳細データ">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left font-medium text-gray-700">
                    FREQ (Hz)
                  </th>
                  <th scope="col" className="px-3 py-2 text-left font-medium text-gray-700">
                    x = f/f0
                  </th>
                  <th scope="col" className="px-3 py-2 text-left font-medium text-gray-700">
                    P音圧 (Pa)
                  </th>
                  <th scope="col" className="px-3 py-2 text-left font-medium text-gray-700">
                    P dB
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {frequencyResponseData.map((point: any, index: number) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <th scope="row" className="px-3 py-2 whitespace-nowrap text-gray-900 font-normal">
                      {point.frequency.toFixed(1)}
                    </th>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-900">
                      {point.xRatio.toFixed(4)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-900">
                      {point.pressure.toExponential(4)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-900">
                      {point.spl.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>音圧計算セクションで必要なパラメータを入力してください。</p>
        </div>
      )}
    </section>
  );
};
