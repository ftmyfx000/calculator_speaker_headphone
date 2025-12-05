import React from 'react';
import type { CalculationMode } from '../../lib/types/thin-film';

interface CalculationModeSelectorProps {
  selectedMode: CalculationMode;
  onChange: (mode: CalculationMode) => void;
}

const MODE_OPTIONS: { value: CalculationMode; label: string }[] = [
  { value: 'resistance', label: '抵抗値 (R)' },
  { value: 'lineWidth', label: '線幅 (W)' },
  { value: 'lineThickness', label: '線厚 (T)' },
  { value: 'lineLength', label: '線長 (L)' },
  { value: 'volumeResistivity', label: '体積抵抗率 (ρ)' },
];

export const CalculationModeSelector: React.FC<CalculationModeSelectorProps> = ({
  selectedMode,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        計算するパラメータを選択
      </label>
      <select
        value={selectedMode}
        onChange={(e) => onChange(e.target.value as CalculationMode)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        aria-label="計算モード選択"
      >
        {MODE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
