/**
 * Type definitions for TS (Thiele-Small) Parameters
 */

/**
 * Input parameters for TS calculations
 */
export interface TSParameters {
  mms: number;        // Moving mass in grams (g)
  kms: number;        // Mechanical stiffness in N/mm
  bl: number;         // Force factor in N/A
  re: number;         // DC resistance in Ohms
  sd: number;         // Effective area in cm²
  rms?: number;       // Mechanical resistance in kg/s (optional)
}

/**
 * Results from TS parameter calculations
 */
export interface TSResults {
  f0: number;              // Resonance frequency in Hz
  vas: number;             // Equivalent compliance volume in liters
  qes: number;             // Electrical Q factor
  qts: number;             // Total Q factor
  airLoadMassFree: number; // Air load mass in free space in grams
  airLoadMassBaffle: number; // Air load mass in infinite baffle in grams
  inputVoltage: number;    // Input voltage in volts
}
