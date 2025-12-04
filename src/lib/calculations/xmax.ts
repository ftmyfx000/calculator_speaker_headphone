/**
 * Xmax Calculations (German Method)
 */

import type { XmaxResult } from '../types/xmax';

/**
 * Calculate Xmax using the German method
 * Formula: Xmax = (VC巻き幅 - plate厚さ) / 2
 * 
 * @param vcWindingWidth - Voice coil winding width in mm
 * @param plateThickness - Plate thickness in mm
 * @returns Xmax result in mm
 */
export function calculateXmax(
  vcWindingWidth: number,
  plateThickness: number
): XmaxResult {
  // Calculate Xmax: Xmax = (VC巻き幅 - plate厚さ) / 2
  const xmax = (vcWindingWidth - plateThickness) / 2;
  
  return {
    xmax
  };
}
