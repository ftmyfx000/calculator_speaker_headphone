/**
 * Type definitions for amplitude calculations
 */

/**
 * Parameters for amplitude calculation
 */
export interface AmplitudeParams {
  spl: number;              // Sound Pressure Level in dB
  airDensity: number;       // Air density in kg/m³
  effectiveRadius: number;  // Effective radius in meters
  frequency: number;        // Frequency in Hz
}

/**
 * Result from amplitude calculation
 */
export interface AmplitudeResult {
  amplitudeMeters: number;      // Amplitude in meters
  amplitudeMillimeters: number; // Amplitude in millimeters
}
