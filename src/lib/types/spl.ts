/**
 * Type definitions for SPL (Sound Pressure Level) calculations
 */

/**
 * Input parameters for SPL calculations
 */
export interface SPLInputs {
  airDensity: number;      // Air density in kg/m³
  effectiveRadius: number; // Effective radius in mm
  mms: number;            // Moving mass in grams (g)
  f0: number;             // Resonance frequency in Hz
  re: number;             // DC resistance in Ohms
  micDistance: number;    // Microphone distance in meters
  inputVoltage: number;   // Input voltage in volts
  rms: number;            // Mechanical resistance in kg/s
  bl: number;             // Force factor in N/A
  frequency: number;      // Target frequency in Hz
}

/**
 * Result from SPL calculation for a single frequency
 */
export interface SPLResult {
  frequency: number;  // Frequency in Hz
  pressure: number;   // Sound pressure in Pascals (Pa)
  spl: number;       // Sound pressure level in dB
}
