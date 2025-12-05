import React, { useState, useEffect } from 'react';
import { InputField } from '../../common/InputField';
import { ResultDisplay } from '../../common/ResultDisplay';
import { HelpTooltip } from '../../common/HelpTooltip';
import {
  calculateFromInternalDimensions,
  calculateFromExternalDimensions,
} from '../../../lib/calculations/box-volume';
import type { BoxVolumeResults } from '../../../lib/types/box-volume';

type CalculationMode = 'internal' | 'external';

export const BoxVolumeCalculatorPage: React.FC = () => {
  // Calculation mode state
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('internal');

  // Internal dimension inputs
  const [internalWidth, setInternalWidth] = useState<string>('');
  const [internalHeight, setInternalHeight] = useState<string>('');
  const [internalDepth, setInternalDepth] = useState<string>('');

  // External dimension inputs
  const [externalWidth, setExternalWidth] = useState<string>('');
  const [externalHeight, setExternalHeight] = useState<string>('');
  const [externalDepth, setExternalDepth] = useState<string>('');

  // Panel thickness (shared between modes)
  const [panelThickness, setPanelThickness] = useState<string>('');

  // Results and errors
  const [results, setResults] = useState<BoxVolumeResults | null>(null);
  const [error, setError] = useState<string>('');

  // Helper function to parse numeric values
  const parseNumeric = (value: string): number | null => {
    const parsed = parseFloat(value);
    return isNaN(parsed) || value.trim() === '' ? null : parsed;
  };

  // Handle mode change - preserve panel thickness, clear dimension inputs
  const handleModeChange = (newMode: CalculationMode) => {
    setCalculationMode(newMode);
    // Clear dimension inputs but preserve panel thickness
    setInternalWidth('');
    setInternalHeight('');
    setInternalDepth('');
    setExternalWidth('');
    setExternalHeight('');
    setExternalDepth('');
    setResults(null);
    setError('');
  };

  // Calculate results when inputs change
  useEffect(() => {
    const thicknessNum = parseNumeric(panelThickness);

    if (thicknessNum === null || thicknessNum <= 0) {
      setResults(null);
      setError('');
      return;
    }

    try {
      if (calculationMode === 'internal') {
        const widthNum = parseNumeric(internalWidth);
        const heightNum = parseNumeric(internalHeight);
        const depthNum = parseNumeric(internalDepth);

        if (widthNum === null || heightNum === null || depthNum === null) {
          setResults(null);
          setError('');
          return;
        }

        if (widthNum <= 0 || heightNum <= 0 || depthNum <= 0) {
          setError('すべての寸法は正の値である必要があります');
          setResults(null);
          return;
        }

        const result = calculateFromInternalDimensions({
          internalWidth: widthNum,
          internalHeight: heightNum,
          internalDepth: depthNum,
          panelThickness: thicknessNum,
        });

        setResults(result);
        setError('');
      } else {
        const widthNum = parseNumeric(externalWidth);
        const heightNum = parseNumeric(externalHeight);
        const depthNum = parseNumeric(externalDepth);

        if (widthNum === null || heightNum === null || depthNum === null) {
          setResults(null);
          setError('');
          return;
        }

        if (widthNum <= 0 || heightNum <= 0 || depthNum <= 0) {
          setError('すべての寸法は正の値である必要があります');
          setResults(null);
          return;
        }

        if (
          thicknessNum >= widthNum / 2 ||
          thicknessNum >= heightNum / 2 ||
          thicknessNum >= depthNum / 2
        ) {
          setError('板厚は各外寸の半分未満である必要があります');
          setResults(null);
          return;
        }

        const result = calculateFromExternalDimensions({
          externalWidth: widthNum,
          externalHeight: heightNum,
          externalDepth: depthNum,
          panelThickness: thicknessNum,
        });

        setResults(result);
        setError('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '計算エラーが発生しました');
      setResults(null);
    }
  }, [
    calculationMode,
    internalWidth,
    internalHeight,
    internalDepth,
    externalWidth,
    externalHeight,
    externalDepth,
    panelThickness,
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6" role="main">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        BOX容積計算
      </h1>

      {/* Calculation Mode Selector */}
      <section className="bg-white rounded-lg shadow p-4 sm:p-6" aria-labelledby="mode-selector-title">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="mode-selector-title">
          計算モード
        </h3>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="calculationMode"
              value="internal"
              checked={calculationMode === 'internal'}
              onChange={() => handleModeChange('internal')}
              className="mr-2"
            />
            <span className="text-sm sm:text-base">内寸から計算</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="calculationMode"
              value="external"
              checked={calculationMode === 'external'}
              onChange={() => handleModeChange('external')}
              className="mr-2"
            />
            <span className="text-sm sm:text-base">外寸から計算</span>
          </label>
        </div>
      </section>

      {/* Input Section */}
      <section
        className="bg-white rounded-lg shadow p-4 sm:p-6"
        aria-labelledby="input-section-title"
        aria-live="polite"
        role="region"
      >
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="input-section-title">
          入力値
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {calculationMode === 'internal' ? (
            <>
              <div className="flex items-center gap-2">
                <InputField
                  label="内寸 幅 (W)"
                  value={internalWidth}
                  onChange={setInternalWidth}
                  unit="cm"
                  id="internal-width-input"
                />
                <HelpTooltip content="BOXの内側の幅を入力してください。" />
              </div>
              <div className="flex items-center gap-2">
                <InputField
                  label="内寸 高さ (H)"
                  value={internalHeight}
                  onChange={setInternalHeight}
                  unit="cm"
                  id="internal-height-input"
                />
                <HelpTooltip content="BOXの内側の高さを入力してください。" />
              </div>
              <div className="flex items-center gap-2">
                <InputField
                  label="内寸 奥行き (D)"
                  value={internalDepth}
                  onChange={setInternalDepth}
                  unit="cm"
                  id="internal-depth-input"
                />
                <HelpTooltip content="BOXの内側の奥行きを入力してください。" />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <InputField
                  label="外寸 幅 (W)"
                  value={externalWidth}
                  onChange={setExternalWidth}
                  unit="cm"
                  id="external-width-input"
                />
                <HelpTooltip content="BOXの外側の幅を入力してください。" />
              </div>
              <div className="flex items-center gap-2">
                <InputField
                  label="外寸 高さ (H)"
                  value={externalHeight}
                  onChange={setExternalHeight}
                  unit="cm"
                  id="external-height-input"
                />
                <HelpTooltip content="BOXの外側の高さを入力してください。" />
              </div>
              <div className="flex items-center gap-2">
                <InputField
                  label="外寸 奥行き (D)"
                  value={externalDepth}
                  onChange={setExternalDepth}
                  unit="cm"
                  id="external-depth-input"
                />
                <HelpTooltip content="BOXの外側の奥行きを入力してください。" />
              </div>
            </>
          )}
          <div className="flex items-center gap-2">
            <InputField
              label="板厚 (T)"
              value={panelThickness}
              onChange={setPanelThickness}
              unit="cm"
              id="panel-thickness-input"
            />
            <HelpTooltip content="BOXの板の厚さを入力してください。" />
          </div>
        </div>
      </section>

      {/* Results Section */}
      {results && (
        <>
          {/* Dimensions Section */}
          <section className="bg-white rounded-lg shadow p-4 sm:p-6" aria-labelledby="dimensions-title">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="dimensions-title">
              寸法
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">内寸</h4>
                <ResultDisplay label="幅" value={results.dimensions.internal.width} unit="cm" precision={2} />
                <ResultDisplay label="高さ" value={results.dimensions.internal.height} unit="cm" precision={2} />
                <ResultDisplay label="奥行き" value={results.dimensions.internal.depth} unit="cm" precision={2} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">外寸</h4>
                <ResultDisplay label="幅" value={results.dimensions.external.width} unit="cm" precision={2} />
                <ResultDisplay label="高さ" value={results.dimensions.external.height} unit="cm" precision={2} />
                <ResultDisplay label="奥行き" value={results.dimensions.external.depth} unit="cm" precision={2} />
              </div>
            </div>
          </section>

          {/* Volume Section */}
          <section className="bg-white rounded-lg shadow p-4 sm:p-6" aria-labelledby="volume-title">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="volume-title">
              容積
            </h3>
            <ResultDisplay label="容積" value={results.volume.cubicCentimeters} unit="cm³" precision={2} />
            <ResultDisplay label="容積" value={results.volume.liters} unit="L" precision={3} />
          </section>

          {/* Dimensional Ratios Section */}
          <section className="bg-white rounded-lg shadow p-4 sm:p-6" aria-labelledby="ratios-title">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="ratios-title">
              寸法比率
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">内寸比率</h4>
                <ResultDisplay label="幅" value={results.ratios.internal.width} precision={3} />
                <ResultDisplay label="高さ" value={results.ratios.internal.height} precision={3} />
                <ResultDisplay label="奥行き" value={results.ratios.internal.depth} precision={3} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">外寸比率</h4>
                <ResultDisplay label="幅" value={results.ratios.external.width} precision={3} />
                <ResultDisplay label="高さ" value={results.ratios.external.height} precision={3} />
                <ResultDisplay label="奥行き" value={results.ratios.external.depth} precision={3} />
              </div>
            </div>
          </section>

          {/* Standing Wave Frequencies - Axial Modes */}
          <section className="bg-white rounded-lg shadow p-4 sm:p-6" aria-labelledby="axial-frequencies-title">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="axial-frequencies-title">
              基本モード周波数（軸方向）
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">軸</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">1次</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">2次</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">3次</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">幅</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{results.standingWaves.axial.width.order1.toFixed(1)} Hz</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{results.standingWaves.axial.width.order2.toFixed(1)} Hz</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{results.standingWaves.axial.width.order3.toFixed(1)} Hz</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">高さ</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{results.standingWaves.axial.height.order1.toFixed(1)} Hz</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{results.standingWaves.axial.height.order2.toFixed(1)} Hz</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{results.standingWaves.axial.height.order3.toFixed(1)} Hz</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">奥行き</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{results.standingWaves.axial.depth.order1.toFixed(1)} Hz</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{results.standingWaves.axial.depth.order2.toFixed(1)} Hz</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{results.standingWaves.axial.depth.order3.toFixed(1)} Hz</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Standing Wave Frequencies - Composite Modes */}
          <section className="bg-white rounded-lg shadow p-4 sm:p-6" aria-labelledby="composite-frequencies-title">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4" id="composite-frequencies-title">
              複合モード周波数
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">モード (n,m,l)</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">周波数</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.standingWaves.composite.map((mode, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">
                        ({mode.mode[0]},{mode.mode[1]},{mode.mode[2]})
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">{mode.frequency.toFixed(1)} Hz</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
