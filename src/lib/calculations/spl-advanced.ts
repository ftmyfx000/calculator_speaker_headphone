/**
 * Advanced SPL Calculations
 */

import type { AdvancedSPLParams, AdvancedSPLResult, FrequencyResponseData } from '../types/spl-advanced';

// Base pressure reference (2×10^(-5) Pa)
const P0 = 2e-5;

// Standard frequency points for frequency response calculation (Hz)
const STANDARD_FREQUENCIES = [
  16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500,
  630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000,
  10000, 12500, 16000, 20000
];

/**
 * Calculate advanced SPL with intermediate values
 * 
 * @param params - Advanced SPL calculation parameters
 * @returns SPL result with intermediate calculation values
 */
export function calculateAdvancedSPL(params: AdvancedSPLParams): AdvancedSPLResult {
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
  } = params;
  
  // Calculate Qts: Qts = 2π × F0 × Mms / (Bl² / Re + Rms)
  const qts = (2 * Math.PI * f0 * mms) / ((bl * bl / re) + rms);
  
  // Calculate sec2: sec2 = ρ × a² × V × Bl / (2 × distance × Mms × Re)
  const sec2 = (airDensity * effectiveRadius * effectiveRadius * inputVoltage * bl) / 
               (2 * micDistance * mms * re);
  
  // Calculate sec3: sec3 = (f / F0) × (√(1/Qts² + (f/F0 - F0/f)²))^(-1)
  const fRatio = frequency / f0;
  const inverseFRatio = f0 / frequency;
  const sqrtTerm = Math.sqrt((1 / (qts * qts)) + Math.pow(fRatio - inverseFRatio, 2));
  const sec3 = fRatio / sqrtTerm;
  
  // Calculate SPL: SPL = 20 × log10(sec2 × sec3 / P0)
  const spl = 20 * Math.log10((sec2 * sec3) / P0);
  
  return {
    spl,
    qts,
    sec2,
    sec3
  };
}


/**
 * Calculate frequency response across standard frequency points
 * 
 * @param params - Base parameters for SPL calculation (without frequency)
 * @returns Array of frequency response points
 */
export function calculateFrequencyResponse(
  params: Omit<AdvancedSPLParams, 'frequency'>
): FrequencyResponseData {
  const { f0 } = params;
  
  return STANDARD_FREQUENCIES.map(frequency => {
    // Calculate SPL at this frequency
    const result = calculateAdvancedSPL({ ...params, frequency });
    
    // Calculate x ratio (f / f0)
    const xRatio = frequency / f0;
    
    // Calculate pressure from SPL: P = P0 × 10^(SPL/20)
    const pressure = P0 * Math.pow(10, result.spl / 20);
    
    return {
      frequency,
      xRatio,
      pressure,
      spl: result.spl
    };
  });
}
