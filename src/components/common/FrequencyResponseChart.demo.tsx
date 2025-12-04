import React from 'react';
import { FrequencyResponseChart } from './FrequencyResponseChart';

/**
 * Demo component showing FrequencyResponseChart usage
 * This demonstrates the component with sample frequency response data
 */
export const FrequencyResponseChartDemo: React.FC = () => {
  // Sample frequency response data (10 Hz to 20 kHz)
  const sampleData = [
    { frequency: 16, xRatio: 0.4, pressure: 0.0008, spl: 75 },
    { frequency: 20, xRatio: 0.5, pressure: 0.001, spl: 78 },
    { frequency: 25, xRatio: 0.625, pressure: 0.0012, spl: 80 },
    { frequency: 31.5, xRatio: 0.7875, pressure: 0.0014, spl: 82 },
    { frequency: 40, xRatio: 1.0, pressure: 0.002, spl: 88 },
    { frequency: 50, xRatio: 1.25, pressure: 0.0018, spl: 86 },
    { frequency: 63, xRatio: 1.575, pressure: 0.0016, spl: 84 },
    { frequency: 80, xRatio: 2.0, pressure: 0.0015, spl: 83 },
    { frequency: 100, xRatio: 2.5, pressure: 0.0013, spl: 81 },
    { frequency: 125, xRatio: 3.125, pressure: 0.0012, spl: 80 },
    { frequency: 160, xRatio: 4.0, pressure: 0.001, spl: 78 },
    { frequency: 200, xRatio: 5.0, pressure: 0.0009, spl: 77 },
    { frequency: 250, xRatio: 6.25, pressure: 0.0008, spl: 76 },
    { frequency: 315, xRatio: 7.875, pressure: 0.0007, spl: 75 },
    { frequency: 400, xRatio: 10.0, pressure: 0.0006, spl: 74 },
    { frequency: 500, xRatio: 12.5, pressure: 0.00055, spl: 73 },
    { frequency: 630, xRatio: 15.75, pressure: 0.0005, spl: 72 },
    { frequency: 800, xRatio: 20.0, pressure: 0.00045, spl: 71 },
    { frequency: 1000, xRatio: 25.0, pressure: 0.0004, spl: 70 },
    { frequency: 1250, xRatio: 31.25, pressure: 0.00038, spl: 69.5 },
    { frequency: 1600, xRatio: 40.0, pressure: 0.00035, spl: 69 },
    { frequency: 2000, xRatio: 50.0, pressure: 0.00033, spl: 68.5 },
    { frequency: 2500, xRatio: 62.5, pressure: 0.0003, spl: 68 },
    { frequency: 3150, xRatio: 78.75, pressure: 0.00028, spl: 67.5 },
    { frequency: 4000, xRatio: 100.0, pressure: 0.00025, spl: 67 },
    { frequency: 5000, xRatio: 125.0, pressure: 0.00023, spl: 66.5 },
    { frequency: 6300, xRatio: 157.5, pressure: 0.0002, spl: 66 },
    { frequency: 8000, xRatio: 200.0, pressure: 0.00018, spl: 65.5 },
    { frequency: 10000, xRatio: 250.0, pressure: 0.00015, spl: 65 },
    { frequency: 12500, xRatio: 312.5, pressure: 0.00013, spl: 64.5 },
    { frequency: 16000, xRatio: 400.0, pressure: 0.0001, spl: 64 },
    { frequency: 20000, xRatio: 500.0, pressure: 0.00008, spl: 63.5 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">周波数応答グラフ</h2>
      <p className="text-gray-600 mb-4">
        このグラフは、スピーカーの周波数応答特性を示しています。
        X軸は周波数（対数スケール）、Y軸は音圧レベル（dB）を表します。
      </p>
      <FrequencyResponseChart data={sampleData} />
    </div>
  );
};
