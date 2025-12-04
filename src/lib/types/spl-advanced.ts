/**
 * Type definitions for advanced SPL calculations
 */

/**
 * Parameters for advanced SPL calculation
 */
export interface AdvancedSPLParams {
  airDensity: number;       // Air density in kg/m³
  effectiveRadius: number;  // Effective radius in meters
  mms: number;              // Moving mass in kg
  f0: number;               // Resonance frequency in Hz
  re: number;               // DC resistance in Ohms
  micDistance: number;      // Microphone distance in meters
  inputVoltage: number;     // Input voltage in volts
  rms: number;              // Mechanical resistance in kg/s
  bl: number;               // Force factor in N/A
  frequency: number;        // Frequency in Hz
}

/**
 * Result from advanced SPL calculation
 */
export interface AdvancedSPLResult {
  spl: number;    // Sound Pressure Level in dB
  qts: number;    // Total Q factor
  sec2: number;   // Intermediate calculation value
  sec3: number;   // Intermediate calculation value
}

/**
 * Single point in frequency response data
 */
export interface FrequencyResponsePoint {
  frequency: number;    // Frequency in Hz
  xRatio: number;       // x = f / f0
  pressure: number;     // Sound pressure in Pa
  spl: number;          // Sound Pressure Level in dB
}

/**
 * Complete frequency response data
 */
export type FrequencyResponseData = FrequencyResponsePoint[];
