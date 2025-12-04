/**
 * Property-based tests for TS Parameter calculations
 */

import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateF0, calculateVas, calculateQes, calculateAirLoadMass, calculateInputVoltage } from './ts-parameters';

describe('TS Parameter Calculations - Property Tests', () => {
  /**
   * Feature: speaker-calculator-webapp, Property 1: F0 calculation correctness
   * Validates: Requirements 1.1
   * 
   * For any valid Mms (in grams) and Kms (in N/mm), when calculating F0,
   * the result should equal sqrt((Kms*1000)/(Mms/1000))/(2*π) within
   * floating-point precision tolerance
   */
  test('Property 1: F0 calculation correctness', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0.1, max: 100, noNaN: true }),  // Mms in grams
        fc.float({ min: 0.1, max: 10, noNaN: true }),   // Kms in N/mm
        (mms, kms) => {
          const result = calculateF0(mms, kms);
          const expected = Math.sqrt((kms * 1000) / (mms / 1000)) / (2 * Math.PI);
          const tolerance = 0.001;
          return Math.abs(result - expected) < tolerance;
        }
      ),
      { numRuns: 100, verbose: true }
    );
  });
});

  /**
   * Feature: speaker-calculator-webapp, Property 2: Vas calculation correctness
   * Validates: Requirements 1.2
   * 
   * For any valid air density (kg/m³), effective radius (mm), and Kms (N/mm),
   * when calculating Vas, the result should follow the formula:
   * ρ * c² * (π * (radius/1000)²)² / (Kms*1000) * 1000, where c = 346.1 m/s
   */
  test('Property 2: Vas calculation correctness', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 1.0, max: 1.5, noNaN: true }),    // Air density in kg/m³
        fc.float({ min: 10, max: 200, noNaN: true }),     // Effective radius in mm
        fc.float({ min: 0.1, max: 10, noNaN: true }),     // Kms in N/mm
        (airDensity, effectiveRadius, kms) => {
          const SPEED_OF_SOUND = 346.1;
          const result = calculateVas(airDensity, effectiveRadius, kms);
          
          const radiusM = effectiveRadius / 1000;
          const kmsNm = kms * 1000;
          const effectiveArea = Math.PI * radiusM * radiusM;
          const expected = (airDensity * SPEED_OF_SOUND * SPEED_OF_SOUND * effectiveArea * effectiveArea / kmsNm) * 1000;
          
          const tolerance = 0.001;
          return Math.abs(result - expected) < tolerance;
        }
      ),
      { numRuns: 100, verbose: true }
    );
  });

  /**
   * Feature: speaker-calculator-webapp, Property 3: Qes calculation correctness
   * Validates: Requirements 1.3
   * 
   * For any valid F0 (Hz), DC resistance (Ohm), Mms (g), and Bl (N/A),
   * when calculating Qes, the result should equal
   * 2 * π * F0 * Re * (Mms/1000) / (Bl²) within floating-point precision tolerance
   */
  test('Property 3: Qes calculation correctness', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 20, max: 500, noNaN: true }),    // F0 in Hz
        fc.float({ min: 2, max: 16, noNaN: true }),      // Re in Ohms
        fc.float({ min: 0.1, max: 100, noNaN: true }),   // Mms in grams
        fc.float({ min: 1, max: 20, noNaN: true }),      // Bl in N/A
        (f0, re, mms, bl) => {
          const result = calculateQes(f0, re, mms, bl);
          const expected = (2 * Math.PI * f0 * re * (mms / 1000)) / (bl * bl);
          
          const tolerance = 0.001;
          return Math.abs(result - expected) < tolerance;
        }
      ),
      { numRuns: 100, verbose: true }
    );
  });

  /**
   * Feature: speaker-calculator-webapp, Property 4: Air load mass calculation correctness
   * Validates: Requirements 1.4
   * 
   * For any valid effective radius (mm) and air density (kg/m³),
   * the system should calculate both free space air load mass as
   * (8/3) * ρ * (radius/1000)³ * 1000 and infinite baffle air load mass as
   * (16/3) * ρ * (radius/1000)³ * 1000
   */
  test('Property 4: Air load mass calculation correctness', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 10, max: 200, noNaN: true }),    // Effective radius in mm
        fc.float({ min: 1.0, max: 1.5, noNaN: true }),   // Air density in kg/m³
        (effectiveRadius, airDensity) => {
          const result = calculateAirLoadMass(effectiveRadius, airDensity);
          
          const radiusM = effectiveRadius / 1000;
          const radiusCubed = radiusM * radiusM * radiusM;
          const expectedFree = (8 / 3) * airDensity * radiusCubed * 1000;
          const expectedBaffle = (16 / 3) * airDensity * radiusCubed * 1000;
          
          const tolerance = 0.001;
          const freeMatch = Math.abs(result.airLoadMassFree - expectedFree) < tolerance;
          const baffleMatch = Math.abs(result.airLoadMassBaffle - expectedBaffle) < tolerance;
          
          return freeMatch && baffleMatch;
        }
      ),
      { numRuns: 100, verbose: true }
    );
  });

  /**
   * Feature: speaker-calculator-webapp, Property 5: Input voltage calculation correctness
   * Validates: Requirements 1.5
   * 
   * For any valid DC resistance (Ohm) and power (W),
   * when calculating input voltage, the result should equal
   * sqrt(Re * P) within floating-point precision tolerance
   */
  test('Property 5: Input voltage calculation correctness', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 2, max: 16, noNaN: true }),      // Re in Ohms
        fc.float({ min: 0.1, max: 100, noNaN: true }),   // Power in watts
        (re, power) => {
          const result = calculateInputVoltage(re, power);
          const expected = Math.sqrt(re * power);
          
          const tolerance = 0.001;
          return Math.abs(result - expected) < tolerance;
        }
      ),
      { numRuns: 100, verbose: true }
    );
  });
});
