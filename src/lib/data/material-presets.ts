/**
 * Material presets for volume resistivity
 * Values from resistivityJ.pdf at 20°C in 10⁻⁸ Ω·m
 */

import type { MaterialPreset } from '../types/thin-film';

export const MATERIAL_PRESETS: MaterialPreset[] = [
  { name: 'Silver', nameJa: '銀', resistivity: 1.6 },
  { name: 'Copper', nameJa: '銅', resistivity: 1.7 },
  { name: 'Gold', nameJa: '金', resistivity: 2.4 },
  { name: 'Aluminium', nameJa: 'アルミニウム', resistivity: 2.8 },
  { name: 'Magnesium', nameJa: 'マグネシウム', resistivity: 4.5 },
  { name: 'Molybdenum', nameJa: 'モリブデン', resistivity: 5.3 },
  { name: 'Tungsten', nameJa: 'タングステン', resistivity: 5.6 },
  { name: 'Beryllium', nameJa: 'ベリリウム', resistivity: 6.1 },
  { name: 'Brass 70-30', nameJa: 'ブラス 70-30', resistivity: 6.3 },
  { name: 'Nickel', nameJa: 'ニッケル', resistivity: 6.9 },
  { name: 'Mercury', nameJa: '水銀', resistivity: 9.7 },
  { name: 'Platinum', nameJa: 'プラチナ', resistivity: 9.9 },
  { name: 'Iron', nameJa: '鉄', resistivity: 10.2 },
  { name: 'Tin', nameJa: 'すず', resistivity: 11.4 },
  { name: 'Chromium', nameJa: 'クロム', resistivity: 12.7 },
  { name: 'Steel, Low C', nameJa: 'スチール 低C', resistivity: 12.7 },
  { name: 'Steel, 1.0 C', nameJa: 'スチール 1.0C', resistivity: 18.8 },
  { name: 'Lead', nameJa: '鉛', resistivity: 20.8 },
  { name: 'Uranium', nameJa: 'ウラン', resistivity: 32.0 },
  { name: 'Antimony', nameJa: 'アンチモニー', resistivity: 39.4 },
  { name: 'Zirconium', nameJa: 'ジルコニウム', resistivity: 40.6 },
  { name: 'Monel', nameJa: 'モネル', resistivity: 44.2 },
  { name: 'Titanium', nameJa: 'チタン', resistivity: 53.3 },
  { name: 'Stainless Steel 410', nameJa: 'SUS 410', resistivity: 62.2 },
  { name: 'Stainless Steel Nonmagnetic', nameJa: 'ステンレス 非磁性', resistivity: 73.7 },
  { name: 'Nichrome', nameJa: 'ニクロム', resistivity: 108.0 },
  { name: 'Manganese', nameJa: 'マンガン', resistivity: 185.4 },
  { name: 'Carbon', nameJa: 'カーボン', resistivity: 3352.8 },
];
