import React, { useState, useEffect } from 'react';
import { InputField } from '../common/InputField';
import { FormulaDisplay } from '../common/FormulaDisplay';
import { HelpTooltip } from '../common/HelpTooltip';
import { calculateCrossoverNetwork } from '../../lib/calculations/crossover';
import type { CrossoverInputs, CrossoverResults } from '../../lib/types/crossover';
import { useCalculatorState } from '../../contexts/CalculatorStateContext';

export const CrossoverNetworkCalculator: React.FC = () => {
  const { states, updateCrossoverState } = useCalculatorState();
  const crossoverState = states.crossover;

  // Use context state
  const wooferImpedance = crossoverState.wooferImpedance || '8';
  const tweeterImpedance = crossoverState.tweeterImpedance || '8';
  const cutoffFrequency = crossoverState.cutoffFrequency;
  const wooferSPL = crossoverState.wooferSPL;
  const tweeterSPL = crossoverState.tweeterSPL;

  // Setter functions that update context
  const setWooferImpedance = (value: string) => updateCrossoverState({ wooferImpedance: value });
  const setTweeterImpedance = (value: string) => updateCrossoverState({ tweeterImpedance: value });
  const setCutoffFrequency = (value: string) => updateCrossoverState({ cutoffFrequency: value });
  const setWooferSPL = (value: string) => updateCrossoverState({ wooferSPL: value });
  const setTweeterSPL = (value: string) => updateCrossoverState({ tweeterSPL: value });

  // State for calculation results
  const [results, setResults] = useState<CrossoverResults | null>(null);

  // Helper function to parse numeric input
  const parseNumeric = (value: string): number | null => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || value.trim() === '' ? null : parsed;
  };

  // Check if all required inputs are available
  const hasRequiredInputs = (): boolean => {
    const wooferImpedanceNum = parseNumeric(wooferImpedance);
    const tweeterImpedanceNum = parseNumeric(tweeterImpedance);
    const cutoffFrequencyNum = parseNumeric(cutoffFrequency);

    return (
      wooferImpedanceNum !== null && wooferImpedanceNum > 0 &&
      tweeterImpedanceNum !== null && tweeterImpedanceNum > 0 &&
      cutoffFrequencyNum !== null && cutoffFrequencyNum > 0
    );
  };

  // Reactive calculation logic - recalculate when inputs change
  useEffect(() => {
    if (hasRequiredInputs()) {
      const inputs: CrossoverInputs = {
        wooferImpedance: parseNumeric(wooferImpedance)!,
        tweeterImpedance: parseNumeric(tweeterImpedance)!,
        cutoffFrequency: parseNumeric(cutoffFrequency)!,
        wooferSPL: parseNumeric(wooferSPL) || 0,
        tweeterSPL: parseNumeric(tweeterSPL) || 0,
      };

      setResults(calculateCrossoverNetwork(inputs));
    } else {
      setResults(null);
    }
  }, [wooferImpedance, tweeterImpedance, cutoffFrequency, wooferSPL, tweeterSPL]);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6" id="calculator-title">
        クロスオーバーネットワーク計算機
      </h2>

      <section className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6" aria-labelledby="input-section-title">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="input-section-title">入力パラメータ</h3>
        
        <div className="flex items-center gap-2">
          <InputField
            label="ウーファーインピーダンス"
            value={wooferImpedance}
            onChange={setWooferImpedance}
            unit="Ω"
            id="woofer-impedance-input"
          />
          <HelpTooltip content="ウーファー（低音用スピーカー）のインピーダンス値です。一般的には4Ω、6Ω、8Ωなどです。" />
        </div>

        <div className="flex items-center gap-2">
          <InputField
            label="ツイーターインピーダンス"
            value={tweeterImpedance}
            onChange={setTweeterImpedance}
            unit="Ω"
            id="tweeter-impedance-input"
          />
          <HelpTooltip content="ツイーター（高音用スピーカー）のインピーダンス値です。一般的には4Ω、6Ω、8Ωなどです。" />
        </div>

        <div className="flex items-center gap-2">
          <InputField
            label="カットオフ周波数"
            value={cutoffFrequency}
            onChange={setCutoffFrequency}
            unit="Hz"
            id="cutoff-frequency-input"
          />
          <HelpTooltip content="ウーファーとツイーターを分割する周波数です。一般的には2000Hz～4000Hz程度です。" />
        </div>

        <div className="flex items-center gap-2">
          <InputField
            label="ウーファーSPL（オプション）"
            value={wooferSPL}
            onChange={setWooferSPL}
            unit="dB"
            id="woofer-spl-input"
          />
          <HelpTooltip content="ウーファーの音圧レベル。レベル調整が必要な場合に入力します。" />
        </div>

        <div className="flex items-center gap-2">
          <InputField
            label="ツイーターSPL（オプション）"
            value={tweeterSPL}
            onChange={setTweeterSPL}
            unit="dB"
            id="tweeter-spl-input"
          />
          <HelpTooltip content="ツイーターの音圧レベル。レベル調整が必要な場合に入力します。" />
        </div>
      </section>

      <FormulaDisplay
        formula="C = K / (Z × fc) × 10⁶ [μF], L = K × Z / fc × 10³ [mH]"
        variables={[
          { symbol: 'C', description: 'コンデンサ容量', unit: 'μF' },
          { symbol: 'L', description: 'インダクタンス', unit: 'mH' },
          { symbol: 'K', description: 'フィルター係数（タイプと次数により異なる）' },
          { symbol: 'Z', description: 'インピーダンス', unit: 'Ω' },
          { symbol: 'fc', description: 'カットオフ周波数', unit: 'Hz' },
        ]}
      />

      {results && (
        <div className="space-y-6" role="region" aria-label="計算結果" aria-live="polite">
          {Object.entries(results).map(([filterType, orders]) => (
            <section key={filterType} className="bg-white rounded-lg shadow p-4 sm:p-6" aria-labelledby={`filter-${filterType}`}>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4" id={`filter-${filterType}`}>
                {filterType}
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                {Object.entries(orders).map(([order, components]) => (
                  <div key={order} className="border-l-4 border-blue-500 pl-3 sm:pl-4">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                      {order} Order
                    </h4>
                    
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                      {/* Woofer Components */}
                      <div className="bg-gray-50 rounded-md p-3 sm:p-4">
                        <h5 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">
                          ウーファー
                        </h5>
                        
                        {components.woofer.capacitors.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                              コンデンサ:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                              {components.woofer.capacitors.map((value, index) => (
                                <li key={index} className="text-xs sm:text-sm text-gray-900">
                                  C{index + 1}: <span className="font-semibold">{value.toFixed(4)}</span> μF
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {components.woofer.inductors.length > 0 && (
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                              インダクタ:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                              {components.woofer.inductors.map((value, index) => (
                                <li key={index} className="text-xs sm:text-sm text-gray-900">
                                  L{index + 1}: <span className="font-semibold">{value.toFixed(4)}</span> mH
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Tweeter Components */}
                      <div className="bg-gray-50 rounded-md p-3 sm:p-4">
                        <h5 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">
                          ツイーター
                        </h5>
                        
                        {components.tweeter.capacitors.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                              コンデンサ:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                              {components.tweeter.capacitors.map((value, index) => (
                                <li key={index} className="text-xs sm:text-sm text-gray-900">
                                  C{index + 1}: <span className="font-semibold">{value.toFixed(4)}</span> μF
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {components.tweeter.inductors.length > 0 && (
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                              インダクタ:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                              {components.tweeter.inductors.map((value, index) => (
                                <li key={index} className="text-xs sm:text-sm text-gray-900">
                                  L{index + 1}: <span className="font-semibold">{value.toFixed(4)}</span> mH
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
