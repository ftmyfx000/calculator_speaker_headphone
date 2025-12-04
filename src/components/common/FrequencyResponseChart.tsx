import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { FrequencyResponsePoint } from '../../lib/types/spl-advanced';

/**
 * 周波数応答グラフコンポーネントのプロパティ
 */
interface FrequencyResponseChartProps {
  /** 周波数応答データの配列 */
  data: FrequencyResponsePoint[];
}

/**
 * 周波数応答グラフコンポーネント
 * 
 * スピーカーの周波数応答をインタラクティブなグラフで表示します。
 * Rechartsライブラリを使用して、対数スケールのX軸と線形スケールのY軸で描画します。
 * 
 * @component
 * @example
 * ```tsx
 * <FrequencyResponseChart data={frequencyResponseData} />
 * ```
 * 
 * @param props - コンポーネントのプロパティ
 * @param props.data - 周波数応答データの配列。各要素は周波数、SPL、x比、音圧を含みます
 * 
 * @remarks
 * - X軸は対数スケール（周波数: Hz）
 * - Y軸は線形スケール（SPL: dB）
 * - グリッド線とツールチップが表示されます
 * - レスポンシブデザインで、画面サイズに応じて調整されます
 * - データが空の場合は、メッセージを表示します
 * 
 * @returns 周波数応答グラフのReactコンポーネント
 */
export const FrequencyResponseChart: React.FC<FrequencyResponseChartProps> = ({ data }) => {
  // データが空または無効な場合のエラーハンドリング
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 sm:h-96 bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-600">グラフを表示するには、必要なパラメータを入力してください</p>
        </div>
      </div>
    );
  }

  // データに無効な値（NaN, Infinity）が含まれていないかチェック
  const hasInvalidData = data.some(
    point => !isFinite(point.spl) || !isFinite(point.frequency)
  );

  if (hasInvalidData) {
    return (
      <div className="w-full h-80 sm:h-96 bg-white p-4 rounded-lg border border-red-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-600">グラフの描画中にエラーが発生しました</p>
          <p className="text-xs text-gray-500 mt-1">入力値を確認してください</p>
        </div>
      </div>
    );
  }
  // カスタムツールチップコンポーネント
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as FrequencyResponsePoint;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-md shadow-lg">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            周波数: {point.frequency.toFixed(0)} Hz
          </p>
          <p className="text-sm text-gray-700">
            SPL: {point.spl.toFixed(2)} dB
          </p>
          <p className="text-xs text-gray-500 mt-1">
            x = {point.xRatio.toFixed(3)}
          </p>
        </div>
      );
    }
    return null;
  };

  // X軸のフォーマット（対数スケール用）
  const formatXAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toFixed(0);
  };

  // Y軸のフォーマット
  const formatYAxis = (value: number) => {
    return `${value.toFixed(0)}`;
  };

  return (
    <div className="w-full h-80 sm:h-96 bg-white p-2 sm:p-4 rounded-lg border border-gray-200">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="frequency"
            scale="log"
            domain={['dataMin', 'dataMax']}
            tickFormatter={formatXAxis}
            label={{
              value: '周波数 (Hz)',
              position: 'insideBottom',
              offset: -5,
              style: { fontSize: '12px', fill: '#6b7280' },
            }}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            stroke="#9ca3af"
          />
          <YAxis
            tickFormatter={formatYAxis}
            label={{
              value: 'SPL (dB)',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: '12px', fill: '#6b7280' },
            }}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            stroke="#9ca3af"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="spl"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="音圧レベル (dB)"
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
