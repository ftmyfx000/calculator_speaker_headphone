/**
 * Property-based tests for Crossover Network calculations
 */

import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateCrossoverNetwork, FILTER_COEFFICIENTS } from './crossover';

describe('Crossover Network Calculations - Property Tests', () => {
  /**
   * Feature: speaker-calculator-webapp, Property 14: Crossover network completeness
   * Validates: Requirements 5.1, 5.2
   * 
   * For any valid woofer impedance, tweeter impedance, and cutoff frequency,
   * the system should calculate component values for all combinations of filter orders
   * (1st through 4th) and filter types (Butterworth, Linkwitz-Riley, Bessel, Chebychev,
   * Legendre, Gaussian, Linear-Phase) where applicable
   */
  test('Property 14: Crossover network completeness', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 4, max: 16, noNaN: true }),      // Woofer impedance in Ohms
        fc.float({ min: 4, max: 16, noNaN: true }),      // Tweeter impedance in Ohms
        fc.float({ min: 100, max: 10000, noNaN: true }), // Cutoff frequency in Hz
        fc.float({ min: 80, max: 100, noNaN: true }),    // Woofer SPL in dB
        fc.float({ min: 80, max: 100, noNaN: true }),    // Tweeter SPL in dB
        (wooferImpedance: number, tweeterImpedance: number, cutoffFrequency: number, wooferSPL: number, tweeterSPL: number) => {
          const inputs = {
            wooferImpedance,
            tweeterImpedance,
            cutoffFrequency,
            wooferSPL,
            tweeterSPL
          };

          const results = calculateCrossoverNetwork(inputs);

          // Verify all filter types are present in results
          for (const filterType of Object.keys(FILTER_COEFFICIENTS)) {
            if (!results[filterType]) {
              return false;
            }

            // Verify all orders for this filter type are present
            for (const order of Object.keys(FILTER_COEFFICIENTS[filterType])) {
              if (!results[filterType][order]) {
                return false;
              }

              // Verify woofer and tweeter components exist
              const filterResult = results[filterType][order];
              if (!filterResult.woofer || !filterResult.tweeter) {
                return false;
              }

              // Verify component arrays exist and have correct lengths
              const coeffs = FILTER_COEFFICIENTS[filterType][order];
              
              if (filterResult.woofer.capacitors.length !== coeffs.woofer.capacitors.length) {
                return false;
              }
              if (filterResult.woofer.inductors.length !== coeffs.woofer.inductors.length) {
                return false;
              }
              if (filterResult.tweeter.capacitors.length !== coeffs.tweeter.capacitors.length) {
                return false;
              }
              if (filterResult.tweeter.inductors.length !== coeffs.tweeter.inductors.length) {
                return false;
              }

              // Verify all component values are finite numbers
              for (const cap of filterResult.woofer.capacitors) {
                if (!isFinite(cap) || cap <= 0) {
                  return false;
                }
              }
              for (const ind of filterResult.woofer.inductors) {
                if (!isFinite(ind) || ind <= 0) {
                  return false;
                }
              }
              for (const cap of filterResult.tweeter.capacitors) {
                if (!isFinite(cap) || cap <= 0) {
                  return false;
                }
              }
              for (const ind of filterResult.tweeter.inductors) {
                if (!isFinite(ind) || ind <= 0) {
                  return false;
                }
              }
            }
          }

          return true;
        }
      ),
      { numRuns: 100, verbose: true }
    );
  });
});
