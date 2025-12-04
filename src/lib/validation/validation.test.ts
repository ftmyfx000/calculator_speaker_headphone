/**
 * Property-based tests for validation functions
 * Feature: speaker-calculator-webapp
 */

import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { isNumeric, isInRange, getValidationError } from './validation';

describe('Validation Functions', () => {
  /**
   * Feature: speaker-calculator-webapp, Property 15: Numeric validation and error reporting
   * Validates: Requirements 6.2, 6.5
   * 
   * For any input field, when a non-numeric value or a value outside the valid range is entered,
   * the system should reject the input and display an error message indicating the expected format and range
   */
  test('Property 15: Numeric validation and error reporting', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Non-numeric strings
          fc.string().filter((s: string) => !isNumeric(s) && s.trim() !== ''),
          // Valid numbers as strings
          fc.float({ noNaN: true }).map((n: number) => n.toString()),
          fc.integer().map((n: number) => n.toString())
        ),
        fc.string({ minLength: 1, maxLength: 20 }), // fieldName
        fc.float({ min: -1000, max: 1000, noNaN: true }), // min
        fc.float({ min: -1000, max: 1000, noNaN: true }) // max
      ),
      (valueStr: string, fieldName: string, min: number, max: number) => {
        // Ensure max > min
        if (max <= min) {
          return true; // Skip this test case
        }
        
        // Test isNumeric
        const numeric = isNumeric(valueStr);
        
        if (!numeric) {
          // Non-numeric strings should be rejected
          const error = getValidationError(valueStr, fieldName, min, max);
          expect(error).toBe('Please enter a valid number');
          return true;
        }
        
        // For numeric values, test range validation
        const numValue = Number(valueStr);
        const inRange = isInRange(numValue, min, max);
        const error = getValidationError(valueStr, fieldName, min, max);
        
        if (!inRange) {
          // Out of range values should have error message
          expect(error).toBe(`Value must be between ${min} and ${max}`);
        } else {
          // In range values should have no error
          expect(error).toBeNull();
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  // Additional unit tests for specific cases
  test('isNumeric should return false for empty strings', () => {
    expect(isNumeric('')).toBe(false);
    expect(isNumeric('   ')).toBe(false);
  });

  test('isNumeric should return true for valid numbers', () => {
    expect(isNumeric('123')).toBe(true);
    expect(isNumeric('123.456')).toBe(true);
    expect(isNumeric('-123.456')).toBe(true);
    expect(isNumeric('0')).toBe(true);
  });

  test('isNumeric should return false for non-numeric strings', () => {
    expect(isNumeric('abc')).toBe(false);
    expect(isNumeric('12abc')).toBe(false);
    expect(isNumeric('NaN')).toBe(false);
  });

  test('isInRange should correctly check boundaries', () => {
    expect(isInRange(5, 0, 10)).toBe(true);
    expect(isInRange(0, 0, 10)).toBe(true);
    expect(isInRange(10, 0, 10)).toBe(true);
    expect(isInRange(-1, 0, 10)).toBe(false);
    expect(isInRange(11, 0, 10)).toBe(false);
  });

  test('getValidationError should return null for empty strings', () => {
    expect(getValidationError('', 'test', 0, 10)).toBeNull();
    expect(getValidationError('   ', 'test', 0, 10)).toBeNull();
  });

  test('getValidationError should handle numeric input directly', () => {
    expect(getValidationError(5, 'test', 0, 10)).toBeNull();
    expect(getValidationError(15, 'test', 0, 10)).toBe('Value must be between 0 and 10');
  });
});
