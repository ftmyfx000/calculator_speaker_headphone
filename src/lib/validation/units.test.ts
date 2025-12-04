/**
 * Property-based tests for unit conversion functions
 * Feature: speaker-calculator-webapp
 */

import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  gramsToKilograms,
  kilogramsToGrams,
  millimetersToMeters,
  metersToMillimeters
} from './units';

describe('Unit Conversion Functions', () => {
  /**
   * Feature: speaker-calculator-webapp, Property 16: Unit conversion round-trip consistency
   * Validates: Requirements 6.3
   * 
   * For any valid numeric value, converting from one unit to another and back
   * (e.g., grams → kilograms → grams, or millimeters → meters → millimeters)
   * should return a value equal to the original within floating-point precision tolerance
   */
  test('Property 16: Unit conversion round-trip consistency', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0.001, max: 10000, noNaN: true, noDefaultInfinity: true })
      ),
      (value: number) => {
        const tolerance = 1e-10;
        
        // Test grams → kilograms → grams
        const gramsRoundTrip = kilogramsToGrams(gramsToKilograms(value));
        const gramsMatch = Math.abs(gramsRoundTrip - value) < tolerance;
        
        // Test kilograms → grams → kilograms
        const kilogramsRoundTrip = gramsToKilograms(kilogramsToGrams(value));
        const kilogramsMatch = Math.abs(kilogramsRoundTrip - value) < tolerance;
        
        // Test millimeters → meters → millimeters
        const millimetersRoundTrip = metersToMillimeters(millimetersToMeters(value));
        const millimetersMatch = Math.abs(millimetersRoundTrip - value) < tolerance;
        
        // Test meters → millimeters → meters
        const metersRoundTrip = millimetersToMeters(metersToMillimeters(value));
        const metersMatch = Math.abs(metersRoundTrip - value) < tolerance;
        
        return gramsMatch && kilogramsMatch && millimetersMatch && metersMatch;
      }),
      { numRuns: 100, verbose: true }
    );
  });

  // Additional unit tests for specific conversions
  test('gramsToKilograms should convert correctly', () => {
    expect(gramsToKilograms(1000)).toBe(1);
    expect(gramsToKilograms(500)).toBe(0.5);
    expect(gramsToKilograms(1)).toBe(0.001);
  });

  test('kilogramsToGrams should convert correctly', () => {
    expect(kilogramsToGrams(1)).toBe(1000);
    expect(kilogramsToGrams(0.5)).toBe(500);
    expect(kilogramsToGrams(0.001)).toBe(1);
  });

  test('millimetersToMeters should convert correctly', () => {
    expect(millimetersToMeters(1000)).toBe(1);
    expect(millimetersToMeters(500)).toBe(0.5);
    expect(millimetersToMeters(1)).toBe(0.001);
  });

  test('metersToMillimeters should convert correctly', () => {
    expect(metersToMillimeters(1)).toBe(1000);
    expect(metersToMillimeters(0.5)).toBe(500);
    expect(metersToMillimeters(0.001)).toBe(1);
  });
});
