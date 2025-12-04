/**
 * Thin Film Resistance Calculations
 */

import type { ThinFilmResistanceParams, ThinFilmResistanceResult } from '../types/thin-film';

/**
 * Calculate thin film resistance
 * Formula: R = ρ × L / (W × T)
 * 
 * @param volumeResistivity - Volume resistivity in Ω·m
 * @param lineWidth - Line width in mm
 * @param lineThickness - Line thickness in mm
 * @param lineLength - Line length in mm
 * @returns Resistance result in Ohms
 */
export function calculateThinFilmResistance(
  volumeResistivity: number,
  lineWidth: number,
  lineThickness: number,
  lineLength: number
): ThinFilmResistanceResult {
  // Convert units: mm → m
  const widthM = lineWidth / 1000;
  const thicknessM = lineThickness / 1000;
  const lengthM = lineLength / 1000;
  
  // Calculate resistance: R = ρ × L / (W × T)
  const resistance = (volumeResistivity * lengthM) / (widthM * thicknessM);
  
  return {
    resistance
  };
}
