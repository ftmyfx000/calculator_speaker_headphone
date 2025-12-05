import React from 'react';
import { MATERIAL_PRESETS } from '../../lib/data/material-presets';
import type { MaterialPresetMode } from '../../lib/types/thin-film';

interface VolumeResistivityInputProps {
  value: string;
  onChange: (value: string) => void;
  isOutput: boolean;
  disabled?: boolean;
  presetMode: MaterialPresetMode;
  onPresetModeChange: (mode: MaterialPresetMode) => void;
  selectedMaterial: string | null;
  onMaterialChange: (material: string | null) => void;
}

export const VolumeResistivityInput: React.FC<VolumeResistivityInputProps> = ({
  value,
  onChange,
  isOutput,
  disabled = false,
  presetMode,
  onPresetModeChange,
  selectedMaterial,
  onMaterialChange,
}) => {
  const handleMaterialSelect = (materialName: string) => {
    if (materialName === 'custom') {
      onPresetModeChange('custom');
      onMaterialChange(null);
    } else {
      onPresetModeChange('preset');
      onMaterialChange(materialName);
      const material = MATERIAL_PRESETS.find(m => m.name === materialName);
      if (material) {
        onChange(material.resistivity.toString());
      }
    }
  };

  if (isOutput) {
    return (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          体積抵抗率 (出力)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-green-50 font-semibold text-gray-900"
            aria-label="体積抵抗率 (計算結果)"
          />
          <span className="text-sm text-gray-600 whitespace-nowrap">×10⁻⁸ Ω·m</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        体積抵抗率
      </label>
      
      <div className="mb-2">
        <select
          value={presetMode === 'preset' && selectedMaterial ? selectedMaterial : 'custom'}
          onChange={(e) => handleMaterialSelect(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          aria-label="材料プリセット選択"
        >
          <option value="custom">カスタム入力</option>
          <optgroup label="材料プリセット">
            {MATERIAL_PRESETS.map((material) => (
              <option key={material.name} value={material.name}>
                {material.nameJa} ({material.name}) - {material.resistivity}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="例: 1.7"
          aria-label="体積抵抗率の値"
        />
        <span className="text-sm text-gray-600 whitespace-nowrap">×10⁻⁸ Ω·m</span>
      </div>
    </div>
  );
};
