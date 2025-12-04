/**
 * Type definitions for Crossover Network calculations
 */

/**
 * Input parameters for crossover network calculations
 */
export interface CrossoverInputs {
  wooferImpedance: number;  // Woofer impedance in Ohms
  tweeterImpedance: number; // Tweeter impedance in Ohms
  cutoffFrequency: number;  // Cutoff frequency in Hz
  wooferSPL: number;       // Woofer SPL in dB
  tweeterSPL: number;      // Tweeter SPL in dB
}

/**
 * Crossover component values for a single driver
 */
export interface CrossoverComponent {
  capacitors: number[];  // Capacitor values in microfarads (μF)
  inductors: number[];   // Inductor values in millihenries (mH)
}

/**
 * Crossover network results organized by filter type and order
 */
export interface CrossoverResults {
  [filterType: string]: {
    [order: string]: {
      woofer: CrossoverComponent;
      tweeter: CrossoverComponent;
    }
  }
}
