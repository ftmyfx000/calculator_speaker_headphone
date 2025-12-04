/**
 * SPL (Sound Pressure Level) Calculations
 */

import type { SPLInputs, SPLResult } from '../types/spl';

/**
 * Calculate Qts (Total Q Factor)
 * Formula: Qts = 2 * π * F0 * Mms / (Bl² / Re + Rms)
 * 
 * @param f0 - Resonance frequency in Hz
 * @param mms - Moving mass in grams (g)
 * @param bl - Force factor in N/A
 * @param re - DC resistance in Ohms
 * @param rms - Mechanical resistance in kg/s
 * @returns Total Q factor
 */
export function calculateQts(
  f0: number,
  mms: number,
  bl: number,
  re: number,
  rms: number
): number {
  // Convert units: g → kg
  const mmsKg = mms / 1000;
  
  // Qts = 2 * π * F0 * Mms / (Bl² / Re + Rms)
  const numerator = 2 * Math.PI * f0 * mmsKg;
  const denominator = (bl * bl / re) + rms;
  
  return numerator / denominator;
}

/**
 * Calculate sound pressure at a given frequency
 * Formula: P = P0 * x / sqrt(1/Qts² + (x - 1/x)²)
 * Where: x = f / f0
 *        P0 = ρ * Sd² * V * Bl / (2 * r * Mms * Re)
 * 
 * @param inputs - SPL input parameters
 * @returns Sound pressure in Pascals (Pa)
 */
export function calculateSoundPressure(inputs: SPLInputs): number {
  const {
    airDensity,
    effectiveRadius,
    mms,
    f0,
    re,
    micDistance,
    inputVoltage,
    rms,
    bl,
    frequency
  } = inputs;
  
  // Convert units
  const radiusM = effectiveRadius / 1000;  // mm → m
  const mmsKg = mms / 1000;                // g → kg
  
  // Calculate effective area Sd = π * r²
  const sd = Math.PI * radiusM * radiusM;
  
  // Calculate Qts
  const qts = calculateQts(f0, mms, bl, re, rms);
  
  // Calculate P0 = ρ * Sd² * V * Bl / (2 * r * Mms * Re)
  const p0 = (airDensity * sd * sd * inputVoltage * bl) / (2 * micDistance * mmsKg * re);
  
  // Calculate x = f / f0
  const x = frequency / f0;
  
  // Calculate P = P0 * x / sqrt(1/Qts² + (x - 1/x)²)
  const qtsSquared = qts * qts;
  const xTerm = x - (1 / x);
  const denominator = Math.sqrt((1 / qtsSquared) + (xTerm * xTerm));
  const pressure = p0 * x / denominator;
  
  return pressure;
}

/**
 * Convert sound pressure to dB SPL
 * Formula: SPL = 20 * log10(P / Pref)
 * Where: Pref = 2 × 10⁻⁵ Pa (reference pressure)
 * 
 * @param pressure - Sound pressure in Pascals (Pa)
 * @returns Sound pressure level in dB
 */
export function convertToDBSPL(pressure: number): number {
  const REFERENCE_PRESSURE = 2e-5; // 2 × 10⁻⁵ Pa
  
  // SPL = 20 * log10(P / Pref)
  return 20 * Math.log10(pressure / REFERENCE_PRESSURE);
}

/**
 * Calculate frequency response across standard frequencies
 * Generates SPL results for frequencies from 16Hz to 10kHz
 * 
 * @param inputs - SPL input parameters (frequency field will be overridden)
 * @returns Array of SPL results for each frequency
 */
export function calculateFrequencyResponse(inputs: SPLInputs): SPLResult[] {
  // Standard frequencies from 16Hz to 10kHz
  const frequencies = [
    16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500,
    630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000
  ];
  
  const results: SPLResult[] = [];
  
  for (const frequency of frequencies) {
    // Create new inputs with current frequency
    const frequencyInputs: SPLInputs = {
      ...inputs,
      frequency
    };
    
    // Calculate pressure at this frequency
    const pressure = calculateSoundPressure(frequencyInputs);
    
    // Convert to dB SPL
    const spl = convertToDBSPL(pressure);
    
    results.push({
      frequency,
      pressure,
      spl
    });
  }
  
  return results;
}
