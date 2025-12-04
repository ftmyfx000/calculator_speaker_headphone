/**
 * Crossover Network Calculations
 */

import type { CrossoverInputs, CrossoverResults, CrossoverComponent } from '../types/crossover';

/**
 * Calculate capacitor value
 * Formula: C = K / (Z * fc) * 10⁶ [μF]
 * 
 * @param k - Filter coefficient
 * @param z - Impedance in Ohms
 * @param fc - Cutoff frequency in Hz
 * @returns Capacitor value in microfarads (μF)
 */
export function calculateCapacitor(k: number, z: number, fc: number): number {
  return (k / (z * fc)) * 1e6;
}

/**
 * Calculate inductor value
 * Formula: L = K * Z / fc * 10³ [mH]
 * 
 * @param k - Filter coefficient
 * @param z - Impedance in Ohms
 * @param fc - Cutoff frequency in Hz
 * @returns Inductor value in millihenries (mH)
 */
export function calculateInductor(k: number, z: number, fc: number): number {
  return (k * z / fc) * 1e3;
}

/**
 * Filter coefficient data structure
 */
interface FilterCoefficients {
  woofer: {
    capacitors: number[];
    inductors: number[];
  };
  tweeter: {
    capacitors: number[];
    inductors: number[];
  };
}

/**
 * Filter coefficient lookup table
 * Organized by filter type and order
 */
export const FILTER_COEFFICIENTS: {
  [filterType: string]: {
    [order: string]: FilterCoefficients;
  }
} = {
  'Butterworth': {
    '1st': {
      woofer: {
        capacitors: [1 / (2 * Math.PI)],
        inductors: []
      },
      tweeter: {
        capacitors: [],
        inductors: [1 / (2 * Math.PI)]
      }
    },
    '2nd': {
      woofer: {
        capacitors: [0.1125],
        inductors: [0.2251]
      },
      tweeter: {
        capacitors: [0.1125],
        inductors: [0.2251]
      }
    },
    '3rd': {
      woofer: {
        capacitors: [0.1061, 0.3183],
        inductors: [0.1194]
      },
      tweeter: {
        capacitors: [0.2122],
        inductors: [0.2387, 0.0796]
      }
    },
    '4th': {
      woofer: {
        capacitors: [0.104, 0.147],
        inductors: [0.1009, 0.4159]
      },
      tweeter: {
        capacitors: [0.2509, 0.0609],
        inductors: [0.2437, 0.1723]
      }
    }
  },
  'Linkwitz-Riley': {
    '2nd': {
      woofer: {
        capacitors: [0.0796],
        inductors: [0.3183]
      },
      tweeter: {
        capacitors: [0.0796],
        inductors: [0.3183]
      }
    },
    '4th': {
      woofer: {
        capacitors: [0.0844, 0.1688],
        inductors: [0.1, 0.4501]
      },
      tweeter: {
        capacitors: [0.2533, 0.0563],
        inductors: [0.3, 0.15]
      }
    }
  },
  'Bessel': {
    '2nd': {
      woofer: {
        capacitors: [0.0912],
        inductors: [0.2756]
      },
      tweeter: {
        capacitors: [0.0912],
        inductors: [0.2756]
      }
    },
    '4th': {
      woofer: {
        capacitors: [0.0702, 0.0719],
        inductors: [0.862, 0.4983]
      },
      tweeter: {
        capacitors: [0.2336, 0.0504],
        inductors: [0.3583, 0.1463]
      }
    }
  },
  'Chebychev': {
    '2nd': {
      woofer: {
        capacitors: [0.1592],
        inductors: [0.1592]
      },
      tweeter: {
        capacitors: [0.1592],
        inductors: [0.1592]
      }
    }
  },
  'Legendre': {
    '4th': {
      woofer: {
        capacitors: [0.1104, 0.1246],
        inductors: [0.1073, 0.2783]
      },
      tweeter: {
        capacitors: [0.2365, 0.091],
        inductors: [0.2294, 0.2034]
      }
    }
  },
  'Gaussian': {
    '4th': {
      woofer: {
        capacitors: [0.0767, 0.1491],
        inductors: [0.1116, 0.3251]
      },
      tweeter: {
        capacitors: [0.2235, 0.0768],
        inductors: [0.3253, 0.1674]
      }
    }
  },
  'Linear-Phase': {
    '4th': {
      woofer: {
        capacitors: [0.0741, 0.1524],
        inductors: [0.1079, 0.3853]
      },
      tweeter: {
        capacitors: [0.2255, 0.0632],
        inductors: [0.3285, 0.1674]
      }
    }
  }
};

/**
 * Calculate crossover network component values for all filter types and orders
 * 
 * @param inputs - Crossover input parameters
 * @returns Crossover results organized by filter type and order
 */
export function calculateCrossoverNetwork(inputs: CrossoverInputs): CrossoverResults {
  const { wooferImpedance, tweeterImpedance, cutoffFrequency } = inputs;
  const results: CrossoverResults = {};

  // Iterate through all filter types and orders
  for (const [filterType, orders] of Object.entries(FILTER_COEFFICIENTS)) {
    results[filterType] = {};

    for (const [order, coefficients] of Object.entries(orders)) {
      // Calculate woofer components
      const wooferCapacitors = coefficients.woofer.capacitors.map(k =>
        calculateCapacitor(k, wooferImpedance, cutoffFrequency)
      );
      const wooferInductors = coefficients.woofer.inductors.map(k =>
        calculateInductor(k, wooferImpedance, cutoffFrequency)
      );

      // Calculate tweeter components
      const tweeterCapacitors = coefficients.tweeter.capacitors.map(k =>
        calculateCapacitor(k, tweeterImpedance, cutoffFrequency)
      );
      const tweeterInductors = coefficients.tweeter.inductors.map(k =>
        calculateInductor(k, tweeterImpedance, cutoffFrequency)
      );

      results[filterType][order] = {
        woofer: {
          capacitors: wooferCapacitors,
          inductors: wooferInductors
        },
        tweeter: {
          capacitors: tweeterCapacitors,
          inductors: tweeterInductors
        }
      };
    }
  }

  return results;
}
