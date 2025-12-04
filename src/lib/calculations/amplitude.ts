/**
 * Amplitude Calculations
 */

import type { AmplitudeResult } from '../types/amplitude';

// Base pressure reference (2×10^(-5) Pa)
const P0 = 2e-5;

/**
 * Calculate speaker amplitude from SPL
 * Formula: amplitude = 2√2 × P0 × 10^(SPL/20) / (4π² × f² × ρ × a²)
 * 
 * @param spl - Sound Pressure Level in dB
 * @param airDensity - Air density in kg/m³
 * @param effectiveRadius - Effective radius in mm
 * @param frequency - Frequency in Hz
 * @returns Amplitude result with values in meters and millimeters
 */
export function calculateAmplitude(
  spl: number,
  airDensity: number,
  effectiveRadius: number,
  frequency: number
): AmplitudeResult {
  // Convert units: mm → m
  const radiusM = effectiveRadius / 1000;
  
  // Calculate amplitude in meters
  // amplitude = 2√2 × P0 × 10^(SPL/20) / (4π² × f² × ρ × a²)
  const numerator = 2 * Math.sqrt(2) * P0 * Math.pow(10, spl / 20);
  const denominator = 4 * Math.PI * Math.PI * frequency * frequency * airDensity * radiusM * radiusM;
  const amplitudeMeters = numerator / denominator;
  
  // Convert to millimeters
  const amplitudeMillimeters = amplitudeMeters * 1000;
  
  return {
    amplitudeMeters,
    amplitudeMillimeters
  };
}
