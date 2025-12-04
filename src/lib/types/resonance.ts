/**
 * Type definitions for open tube resonance calculations
 */

/**
 * Parameters for open tube resonance calculation
 */
export interface OpenTubeResonanceParams {
  soundSpeed: number;   // Speed of sound in m/s
  tubeLength: number;   // Tube length in meters
}

/**
 * Result from open tube resonance calculation
 */
export interface OpenTubeResonanceResult {
  fundamental: number;    // Fundamental frequency (n=1) in Hz
  secondHarmonic: number; // Second harmonic (n=2) in Hz
  thirdHarmonic: number;  // Third harmonic (n=3) in Hz
}
