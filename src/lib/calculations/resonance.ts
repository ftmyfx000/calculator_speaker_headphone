/**
 * Open Tube Resonance Calculations
 */

import type { OpenTubeResonanceParams, OpenTubeResonanceResult } from '../types/resonance';

/**
 * Calculate open tube resonance frequencies
 * Formula: f_n = n × c / (2 × L)
 * 
 * @param soundSpeed - Speed of sound in m/s
 * @param tubeLength - Tube length in mm
 * @returns Resonance frequencies for fundamental, 2nd harmonic, and 3rd harmonic in Hz
 */
export function calculateOpenTubeResonance(
  soundSpeed: number,
  tubeLength: number
): OpenTubeResonanceResult {
  // Convert units: mm → m
  const lengthM = tubeLength / 1000;
  
  // Calculate resonance frequencies: f_n = n × c / (2 × L)
  const fundamental = (1 * soundSpeed) / (2 * lengthM);
  const secondHarmonic = (2 * soundSpeed) / (2 * lengthM);
  const thirdHarmonic = (3 * soundSpeed) / (2 * lengthM);
  
  return {
    fundamental,
    secondHarmonic,
    thirdHarmonic
  };
}
