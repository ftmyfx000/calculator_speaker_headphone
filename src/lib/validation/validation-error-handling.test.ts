/**
 * Tests for error handling validation functions
 */

import { describe, it, expect } from 'vitest';
import {
  validateParameter,
  validateQmsInputs,
  validateQtsInputs,
  validateXmaxInputs,
  isDivisionByZero,
  isPositive,
  isNonNegative,
} from './validation';

describe('Error Handling Validation', () => {
  describe('validateParameter', () => {
    it('should return null for valid frequency', () => {
      expect(validateParameter('100', 'frequency')).toBeNull();
    });

    it('should return error for frequency out of range', () => {
      expect(validateParameter('0.5', 'frequency')).toContain('範囲内');
      expect(validateParameter('200000', 'frequency')).toContain('範囲内');
    });

    it('should return error for non-numeric input', () => {
      expect(validateParameter('abc', 'frequency')).toContain('有効な数値');
    });

    it('should return null for empty input', () => {
      expect(validateParameter('', 'frequency')).toBeNull();
    });

    it('should validate SPL range correctly', () => {
      expect(validateParameter('80', 'spl')).toBeNull();
      expect(validateParameter('-10', 'spl')).toContain('範囲内');
      expect(validateParameter('200', 'spl')).toContain('範囲内');
    });

    it('should validate air density range correctly', () => {
      expect(validateParameter('1.29', 'airDensity')).toBeNull();
      expect(validateParameter('0.1', 'airDensity')).toContain('範囲内');
      expect(validateParameter('5', 'airDensity')).toContain('範囲内');
    });
  });

  describe('validateQmsInputs', () => {
    it('should return null for valid inputs', () => {
      expect(validateQmsInputs(50, 10, 0.5)).toBeNull();
    });

    it('should return null for missing inputs', () => {
      expect(validateQmsInputs(null, 10, 0.5)).toBeNull();
      expect(validateQmsInputs(50, null, 0.5)).toBeNull();
      expect(validateQmsInputs(50, 10, null)).toBeNull();
    });

    it('should return error for zero Rms (division by zero)', () => {
      const error = validateQmsInputs(50, 10, 0);
      expect(error).toContain('ゼロ除算');
    });

    it('should return error for negative F0', () => {
      const error = validateQmsInputs(-50, 10, 0.5);
      expect(error).toContain('正の値');
    });

    it('should return error for negative Mms', () => {
      const error = validateQmsInputs(50, -10, 0.5);
      expect(error).toContain('正の値');
    });

    it('should return error for negative Rms', () => {
      const error = validateQmsInputs(50, 10, -0.5);
      expect(error).toContain('正の値');
    });
  });

  describe('validateQtsInputs', () => {
    it('should return null for valid inputs', () => {
      expect(validateQtsInputs(2.5, 3.0)).toBeNull();
    });

    it('should return null for missing inputs', () => {
      expect(validateQtsInputs(null, 3.0)).toBeNull();
      expect(validateQtsInputs(2.5, null)).toBeNull();
    });

    it('should return error for negative Qes', () => {
      const error = validateQtsInputs(-2.5, 3.0);
      expect(error).toContain('正の値');
    });

    it('should return error for negative Qms', () => {
      const error = validateQtsInputs(2.5, -3.0);
      expect(error).toContain('正の値');
    });
  });

  describe('validateXmaxInputs', () => {
    it('should return null for valid inputs', () => {
      expect(validateXmaxInputs(10, 5)).toBeNull();
    });

    it('should return null for missing inputs', () => {
      expect(validateXmaxInputs(null, 5)).toBeNull();
      expect(validateXmaxInputs(10, null)).toBeNull();
    });

    it('should return error when VC winding width <= plate thickness', () => {
      const error1 = validateXmaxInputs(5, 5);
      expect(error1).toContain('より大きい');
      
      const error2 = validateXmaxInputs(5, 10);
      expect(error2).toContain('より大きい');
    });

    it('should return error for negative VC winding width', () => {
      const error = validateXmaxInputs(-10, 5);
      expect(error).toContain('正の値');
    });

    it('should return error for negative plate thickness', () => {
      const error = validateXmaxInputs(10, -5);
      expect(error).toContain('正の値');
    });
  });

  describe('isDivisionByZero', () => {
    it('should return true for zero', () => {
      expect(isDivisionByZero(0)).toBe(true);
    });

    it('should return true for very small numbers', () => {
      expect(isDivisionByZero(1e-100)).toBe(true);
    });

    it('should return false for normal numbers', () => {
      expect(isDivisionByZero(0.1)).toBe(false);
      expect(isDivisionByZero(1)).toBe(false);
      expect(isDivisionByZero(-1)).toBe(false);
    });
  });

  describe('isPositive', () => {
    it('should return true for positive numbers', () => {
      expect(isPositive(1)).toBe(true);
      expect(isPositive(0.1)).toBe(true);
      expect(isPositive(1000)).toBe(true);
    });

    it('should return false for zero', () => {
      expect(isPositive(0)).toBe(false);
    });

    it('should return false for negative numbers', () => {
      expect(isPositive(-1)).toBe(false);
      expect(isPositive(-0.1)).toBe(false);
    });
  });

  describe('isNonNegative', () => {
    it('should return true for positive numbers', () => {
      expect(isNonNegative(1)).toBe(true);
      expect(isNonNegative(0.1)).toBe(true);
    });

    it('should return true for zero', () => {
      expect(isNonNegative(0)).toBe(true);
    });

    it('should return false for negative numbers', () => {
      expect(isNonNegative(-1)).toBe(false);
      expect(isNonNegative(-0.1)).toBe(false);
    });
  });
});
