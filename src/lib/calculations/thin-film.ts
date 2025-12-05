/**
 * Thin Film Resistance Calculations
 */

import type { ThinFilmResistanceResult } from '../types/thin-film';

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

/**
 * Calculate resistance from other parameters
 * Formula: R = ρ × L / (W × T)
 * 
 * @param volumeResistivity - Volume resistivity in Ω·m
 * @param lineLength - Line length in m
 * @param lineWidth - Line width in m
 * @param lineThickness - Line thickness in m
 * @returns Resistance in Ohms
 */
export function calculateResistance(
  volumeResistivity: number,
  lineLength: number,
  lineWidth: number,
  lineThickness: number
): number {
  return (volumeResistivity * lineLength) / (lineWidth * lineThickness);
}

/**
 * Calculate line width from other parameters
 * Formula: W = ρ × L / (R × T)
 * 
 * @param volumeResistivity - Volume resistivity in Ω·m
 * @param lineLength - Line length in m
 * @param resistance - Resistance in Ohms
 * @param lineThickness - Line thickness in m
 * @returns Line width in m
 */
export function calculateLineWidth(
  volumeResistivity: number,
  lineLength: number,
  resistance: number,
  lineThickness: number
): number {
  return (volumeResistivity * lineLength) / (resistance * lineThickness);
}

/**
 * Calculate line thickness from other parameters
 * Formula: T = ρ × L / (R × W)
 * 
 * @param volumeResistivity - Volume resistivity in Ω·m
 * @param lineLength - Line length in m
 * @param resistance - Resistance in Ohms
 * @param lineWidth - Line width in m
 * @returns Line thickness in m
 */
export function calculateLineThickness(
  volumeResistivity: number,
  lineLength: number,
  resistance: number,
  lineWidth: number
): number {
  return (volumeResistivity * lineLength) / (resistance * lineWidth);
}

/**
 * Calculate line length from other parameters
 * Formula: L = R × W × T / ρ
 * 
 * @param resistance - Resistance in Ohms
 * @param lineWidth - Line width in m
 * @param lineThickness - Line thickness in m
 * @param volumeResistivity - Volume resistivity in Ω·m
 * @returns Line length in m
 */
export function calculateLineLength(
  resistance: number,
  lineWidth: number,
  lineThickness: number,
  volumeResistivity: number
): number {
  return (resistance * lineWidth * lineThickness) / volumeResistivity;
}

/**
 * Calculate volume resistivity from other parameters
 * Formula: ρ = R × W × T / L
 * 
 * @param resistance - Resistance in Ohms
 * @param lineWidth - Line width in m
 * @param lineThickness - Line thickness in m
 * @param lineLength - Line length in m
 * @returns Volume resistivity in Ω·m
 */
export function calculateVolumeResistivity(
  resistance: number,
  lineWidth: number,
  lineThickness: number,
  lineLength: number
): number {
  return (resistance * lineWidth * lineThickness) / lineLength;
}
