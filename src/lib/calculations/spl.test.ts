/**
 * Property-based tests for SPL calculations
 */

import { describe, test } from 'vitest';
import * as fc from 'fast-check';
import { calculateQts, calculateSoundPressure, convertToDBSPL, calculateFrequencyResponse } from './spl';
import type { SPLInputs } from '../types/spl';

describe('SPL Calculations - Property Tests', () => {
  /**
   * Feature: speaker-calculator-webapp, Property 8: Qts calculation correctness
   * Validates: Requirements 2.4
   * 
   * For any valid F0, Mms, Bl, Re, and Rms values, when calculating Qts,
   * the result should equal 2 * π * F0 * (Mms/1000) / ((Bl² / Re) + Rms)
   * within floating-point precision tolerance
   */
  test('Property 8: Qts calculation correctness', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 20, max: 500, noNaN: true }),    // F0 in Hz
        fc.float({ min: 0.1, max: 100, noNaN: true }),   // Mms in grams
        fc.float({ min: 1, max: 20, noNaN: true }),      // Bl in N/A
        fc.float({ min: 2, max: 16, noNaN: true }),      // Re in Ohms
        fc.float({ min: 0.1, max: 10, noNaN: true }),    // Rms in kg/s
        (f0, mms, bl, re, rms) => {
          const result = calculateQts(f0, mms, bl, re, rms);
          
          const mmsKg = mms / 1000;
          const numerator = 2 * Math.PI * f0 * mmsKg;
          const denominator = (bl * bl / re) + rms;
          const expected = numerator / denominator;
          
          const tolerance = 0.001;
          return Math.abs(result - expected) < tolerance;
        }
      ),
      { numRuns: 100, verbose: true }
    );
  });

  /**
   * Feature: speaker-calculator-webapp, Property 6: Sound pressure calculation correctness
   * Validates: Requirements 2.1
   * 
   * For any valid SPL input parameters, the calculated sound pressure should follow
   * the formula: P = P0 * x / sqrt(1/Qts² + (x - 1/x)²),
   * where x = f/f0 and P0 = ρ * Sd² * V * Bl / (2 * r * Mms * Re)
   */
  test('Property 6: Sound pressure calculation correctness', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 1.0, max: 1.5, noNaN: true }),    // airDensity in kg/m³
        fc.float({ min: 10, max: 200, noNaN: true }),     // effectiveRadius in mm
        fc.float({ min: 0.1, max: 100, noNaN: true }),    // mms in grams
        fc.float({ min: 20, max: 500, noNaN: true }),     // f0 in Hz
        fc.float({ min: 2, max: 16, noNaN: true }),       // re in Ohms
        fc.float({ min: 0.1, max: 5, noNaN: true }),      // micDistance in meters
        fc.float({ min: 0.1, max: 20, noNaN: true }),     // inputVoltage in volts
        fc.float({ min: 0.1, max: 10, noNaN: true }),     // rms in kg/s
        fc.float({ min: 1, max: 20, noNaN: true }),       // bl in N/A
        fc.float({ min: 20, max: 500, noNaN: true }),     // frequency in Hz
        (airDensity, effectiveRadius, mms, f0, re, micDistance, inputVoltage, rms, bl, frequency) => {
          const inputs: SPLInputs = {
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
          };
          
          const result = calculateSoundPressure(inputs);
          
          // Calculate expected value manually
          const radiusM = effectiveRadius / 1000;
          const mmsKg = mms / 1000;
          const sd = Math.PI * radiusM * radiusM;
          
          // Calculate Qts
          const qtsNumerator = 2 * Math.PI * f0 * mmsKg;
          const qtsDenominator = (bl * bl / re) + rms;
          const qts = qtsNumerator / qtsDenominator;
          
          // Calculate P0
          const p0 = (airDensity * sd * sd * inputVoltage * bl) / (2 * micDistance * mmsKg * re);
          
          // Calculate x
          const x = frequency / f0;
          
          // Calculate P
          const qtsSquared = qts * qts;
          const xTerm = x - (1 / x);
          const denominator = Math.sqrt((1 / qtsSquared) + (xTerm * xTerm));
          const expected = p0 * x / denominator;
          
          const tolerance = 0.001;
          return Math.abs(result - expected) < tolerance || 
                 (Math.abs(result - expected) / Math.max(Math.abs(result), Math.abs(expected))) < 0.01;
        }
      ),
      { numRuns: 100, verbose: true }
    );
  });

  /**
   * Feature: speaker-calculator-webapp, Property 7: SPL dB conversion correctness
   * Validates: Requirements 2.2
   * 
   * For any positive sound pressure value P (Pa), when converting to dB SPL,
   * the result should equal 20 * log10(P / (2×10⁻⁵)) within floating-point precision tolerance
   */
  test('Property 7: SPL dB conversion correctness', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 1e-5, max: 100, noNaN: true }),  // Pressure in Pa
        (pressure) => {
          const result = convertToDBSPL(pressure);
          
          const REFERENCE_PRESSURE = 2e-5;
          const expected = 20 * Math.log10(pressure / REFERENCE_PRESSURE);
          
          const tolerance = 0.001;
          return Math.abs(result - expected) < tolerance;
        }
      ),
      { numRuns: 100, verbose: true }
    );
  });

  /**
   * Feature: speaker-calculator-webapp, Property 9: Frequency response completeness
   * Validates: Requirements 2.5
   * 
   * For any valid SPL input parameters, when calculating frequency response,
   * the output should include both pressure (Pa) and SPL (dB) values for each frequency
   */
  test('Property 9: Frequency response completeness', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 1.0, max: 1.5, noNaN: true }),    // airDensity in kg/m³
        fc.float({ min: 10, max: 200, noNaN: true }),     // effectiveRadius in mm
        fc.float({ min: 0.1, max: 100, noNaN: true }),    // mms in grams
        fc.float({ min: 20, max: 500, noNaN: true }),     // f0 in Hz
        fc.float({ min: 2, max: 16, noNaN: true }),       // re in Ohms
        fc.float({ min: 0.1, max: 5, noNaN: true }),      // micDistance in meters
        fc.float({ min: 0.1, max: 20, noNaN: true }),     // inputVoltage in volts
        fc.float({ min: 0.1, max: 10, noNaN: true }),     // rms in kg/s
        fc.float({ min: 1, max: 20, noNaN: true }),       // bl in N/A
        (airDensity, effectiveRadius, mms, f0, re, micDistance, inputVoltage, rms, bl) => {
          const inputs: SPLInputs = {
            airDensity,
            effectiveRadius,
            mms,
            f0,
            re,
            micDistance,
            inputVoltage,
            rms,
            bl,
            frequency: 100 // Will be overridden by calculateFrequencyResponse
          };
          
          const results = calculateFrequencyResponse(inputs);
          
          // Check that we have results
          if (results.length === 0) {
            return false;
          }
          
          // Check that each result has all required fields
          for (const result of results) {
            // Must have frequency field
            if (typeof result.frequency !== 'number' || !isFinite(result.frequency)) {
              return false;
            }
            
            // Must have pressure field (Pa)
            if (typeof result.pressure !== 'number' || !isFinite(result.pressure)) {
              return false;
            }
            
            // Must have spl field (dB)
            if (typeof result.spl !== 'number' || !isFinite(result.spl)) {
              return false;
            }
          }
          
          return true;
        }
      ),
      { numRuns: 100, verbose: true }
    );
  });
});
