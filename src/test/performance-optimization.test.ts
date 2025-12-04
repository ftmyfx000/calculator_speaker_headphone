import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMemo } from 'react';

describe('Performance Optimization - Memoization', () => {
  it('should memoize calculation results', () => {
    let calculationCount = 0;
    
    const { result, rerender } = renderHook(
      ({ value }) => {
        return useMemo(() => {
          calculationCount++;
          return value * 2;
        }, [value]);
      },
      { initialProps: { value: 5 } }
    );

    expect(result.current).toBe(10);
    expect(calculationCount).toBe(1);

    // Rerender with same value - should not recalculate
    rerender({ value: 5 });
    expect(result.current).toBe(10);
    expect(calculationCount).toBe(1);

    // Rerender with different value - should recalculate
    rerender({ value: 10 });
    expect(result.current).toBe(20);
    expect(calculationCount).toBe(2);
  });

  it('should memoize parsed numeric values', () => {
    let parseCount = 0;
    
    const parseNumeric = (value: string): number | null => {
      parseCount++;
      const parsed = parseFloat(value);
      return isNaN(parsed) || value.trim() === '' ? null : parsed;
    };

    const { result, rerender } = renderHook(
      ({ value }) => {
        return useMemo(() => parseNumeric(value), [value]);
      },
      { initialProps: { value: '123.45' } }
    );

    expect(result.current).toBe(123.45);
    expect(parseCount).toBe(1);

    // Rerender with same value - should not reparse
    rerender({ value: '123.45' });
    expect(result.current).toBe(123.45);
    expect(parseCount).toBe(1);

    // Rerender with different value - should reparse
    rerender({ value: '678.90' });
    expect(result.current).toBe(678.90);
    expect(parseCount).toBe(2);
  });
});
