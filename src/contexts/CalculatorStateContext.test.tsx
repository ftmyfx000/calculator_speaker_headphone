import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { CalculatorStateProvider, useCalculatorState } from './CalculatorStateContext';
import * as fc from 'fast-check';

/**
 * Feature: speaker-calculator-webapp, Property 17: Calculator state persistence across navigation
 * 
 * For any sequence of calculator selections and input entries, when navigating away from 
 * a calculator and returning to it, all previously entered values should be preserved.
 * 
 * Validates: Requirements 8.3
 */

describe('CalculatorStateContext', () => {
  describe('Property 17: Calculator state persistence across navigation', () => {
    it('should preserve TS Parameter state across updates', () => {
      fc.assert(
        fc.property(
          fc.record({
            mms: fc.float({ min: 0, max: 100 }).map(String),
            kms: fc.float({ min: 0, max: 10 }).map(String),
            bl: fc.float({ min: 0, max: 20 }).map(String),
            re: fc.float({ min: 0, max: 100 }).map(String),
            effectiveRadius: fc.float({ min: 0, max: 200 }).map(String),
            airDensity: fc.float({ min: 0.5, max: 2 }).map(String),
            power: fc.float({ min: 0, max: 1000 }).map(String),
            rms: fc.float({ min: 0, max: 10 }).map(String),
          }),
          (tsState) => {
            const { result } = renderHook(() => useCalculatorState(), {
              wrapper: CalculatorStateProvider,
            });

            // Update TS Parameter state
            act(() => {
              result.current.updateTSParameterState(tsState);
            });

            // Verify state is preserved
            expect(result.current.states.tsParameters).toMatchObject(tsState);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve new TS Parameter fields (振幅・音圧計算用)', () => {
      fc.assert(
        fc.property(
          fc.record({
            spl: fc.float({ min: 0, max: 150 }).map(String),
            frequency: fc.float({ min: 10, max: 20000 }).map(String),
            micDistance: fc.float({ min: 0.1, max: 10 }).map(String),
            inputVoltage: fc.float({ min: 0, max: 100 }).map(String),
          }),
          (tsState) => {
            const { result } = renderHook(() => useCalculatorState(), {
              wrapper: CalculatorStateProvider,
            });

            // Update TS Parameter state with new fields
            act(() => {
              result.current.updateTSParameterState(tsState);
            });

            // Verify new fields are preserved
            expect(result.current.states.tsParameters).toMatchObject(tsState);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve new TS Parameter fields (薄膜パターン用)', () => {
      fc.assert(
        fc.property(
          fc.record({
            volumeResistivity: fc.float({ min: 1e-8, max: 1e-2 }).map(String),
            lineWidth: fc.float({ min: 0.01, max: 10 }).map(String),
            lineThickness: fc.float({ min: 0.001, max: 1 }).map(String),
            lineLength: fc.float({ min: 1, max: 1000 }).map(String),
          }),
          (tsState) => {
            const { result } = renderHook(() => useCalculatorState(), {
              wrapper: CalculatorStateProvider,
            });

            // Update TS Parameter state with thin film fields
            act(() => {
              result.current.updateTSParameterState(tsState);
            });

            // Verify thin film fields are preserved
            expect(result.current.states.tsParameters).toMatchObject(tsState);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve new TS Parameter fields (Xmax計算用)', () => {
      fc.assert(
        fc.property(
          fc.record({
            vcWindingWidth: fc.float({ min: 1, max: 50 }).map(String),
            plateThickness: fc.float({ min: 0.1, max: 10 }).map(String),
          }),
          (tsState) => {
            const { result } = renderHook(() => useCalculatorState(), {
              wrapper: CalculatorStateProvider,
            });

            // Update TS Parameter state with Xmax fields
            act(() => {
              result.current.updateTSParameterState(tsState);
            });

            // Verify Xmax fields are preserved
            expect(result.current.states.tsParameters).toMatchObject(tsState);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve new TS Parameter fields (開管共鳴用)', () => {
      fc.assert(
        fc.property(
          fc.record({
            soundSpeed: fc.float({ min: 300, max: 400 }).map(String),
            tubeLength: fc.float({ min: 10, max: 10000 }).map(String),
          }),
          (tsState) => {
            const { result } = renderHook(() => useCalculatorState(), {
              wrapper: CalculatorStateProvider,
            });

            // Update TS Parameter state with resonance fields
            act(() => {
              result.current.updateTSParameterState(tsState);
            });

            // Verify resonance fields are preserved
            expect(result.current.states.tsParameters).toMatchObject(tsState);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve SPL state across updates', () => {
      fc.assert(
        fc.property(
          fc.record({
            airDensity: fc.float({ min: 0.5, max: 2 }).map(String),
            effectiveRadius: fc.float({ min: 0, max: 200 }).map(String),
            mms: fc.float({ min: 0, max: 100 }).map(String),
            f0: fc.float({ min: 10, max: 10000 }).map(String),
            re: fc.float({ min: 0, max: 100 }).map(String),
            micDistance: fc.float({ min: 0.1, max: 10 }).map(String),
            inputVoltage: fc.float({ min: 0, max: 100 }).map(String),
            rms: fc.float({ min: 0, max: 10 }).map(String),
            bl: fc.float({ min: 0, max: 20 }).map(String),
            frequency: fc.float({ min: 10, max: 20000 }).map(String),
          }),
          (splState) => {
            const { result } = renderHook(() => useCalculatorState(), {
              wrapper: CalculatorStateProvider,
            });

            // Update SPL state
            act(() => {
              result.current.updateSPLState(splState);
            });

            // Verify state is preserved
            expect(result.current.states.spl).toMatchObject(splState);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve Crossover state across updates', () => {
      fc.assert(
        fc.property(
          fc.record({
            wooferImpedance: fc.float({ min: 1, max: 32 }).map(String),
            tweeterImpedance: fc.float({ min: 1, max: 32 }).map(String),
            cutoffFrequency: fc.float({ min: 100, max: 10000 }).map(String),
            wooferSPL: fc.float({ min: 70, max: 110 }).map(String),
            tweeterSPL: fc.float({ min: 70, max: 110 }).map(String),
          }),
          (crossoverState) => {
            const { result } = renderHook(() => useCalculatorState(), {
              wrapper: CalculatorStateProvider,
            });

            // Update Crossover state
            act(() => {
              result.current.updateCrossoverState(crossoverState);
            });

            // Verify state is preserved
            expect(result.current.states.crossover).toMatchObject(crossoverState);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve all calculator states independently', () => {
      fc.assert(
        fc.property(
          fc.record({
            mms: fc.float({ min: 0, max: 100 }).map(String),
            kms: fc.float({ min: 0, max: 10 }).map(String),
          }),
          fc.record({
            airDensity: fc.float({ min: 0.5, max: 2 }).map(String),
            frequency: fc.float({ min: 10, max: 20000 }).map(String),
          }),
          fc.record({
            wooferImpedance: fc.float({ min: 1, max: 32 }).map(String),
            cutoffFrequency: fc.float({ min: 100, max: 10000 }).map(String),
          }),
          (tsPartial, splPartial, crossoverPartial) => {
            const { result } = renderHook(() => useCalculatorState(), {
              wrapper: CalculatorStateProvider,
            });

            // Update all three calculator states
            act(() => {
              result.current.updateTSParameterState(tsPartial);
              result.current.updateSPLState(splPartial);
              result.current.updateCrossoverState(crossoverPartial);
            });

            // Verify all states are preserved independently
            expect(result.current.states.tsParameters).toMatchObject(tsPartial);
            expect(result.current.states.spl).toMatchObject(splPartial);
            expect(result.current.states.crossover).toMatchObject(crossoverPartial);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve state through multiple sequential updates', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              mms: fc.float({ min: 0, max: 100 }).map(String),
              kms: fc.float({ min: 0, max: 10 }).map(String),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (updates) => {
            const { result } = renderHook(() => useCalculatorState(), {
              wrapper: CalculatorStateProvider,
            });

            // Apply all updates sequentially
            let expectedState = { ...result.current.states.tsParameters };
            for (const update of updates) {
              act(() => {
                result.current.updateTSParameterState(update);
              });
              expectedState = { ...expectedState, ...update };
            }

            // Verify final state matches all accumulated updates
            expect(result.current.states.tsParameters).toMatchObject(expectedState);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve all new fields together in a single update', () => {
      fc.assert(
        fc.property(
          fc.record({
            // 基本パラメータ
            mms: fc.float({ min: 0, max: 100 }).map(String),
            rms: fc.float({ min: 0, max: 10 }).map(String),
            // 振幅・音圧計算用
            spl: fc.float({ min: 0, max: 150 }).map(String),
            frequency: fc.float({ min: 10, max: 20000 }).map(String),
            micDistance: fc.float({ min: 0.1, max: 10 }).map(String),
            inputVoltage: fc.float({ min: 0, max: 100 }).map(String),
            // 薄膜パターン用
            volumeResistivity: fc.float({ min: 1e-8, max: 1e-2 }).map(String),
            lineWidth: fc.float({ min: 0.01, max: 10 }).map(String),
            lineThickness: fc.float({ min: 0.001, max: 1 }).map(String),
            lineLength: fc.float({ min: 1, max: 1000 }).map(String),
            // Xmax計算用
            vcWindingWidth: fc.float({ min: 1, max: 50 }).map(String),
            plateThickness: fc.float({ min: 0.1, max: 10 }).map(String),
            // 開管共鳴用
            soundSpeed: fc.float({ min: 300, max: 400 }).map(String),
            tubeLength: fc.float({ min: 10, max: 10000 }).map(String),
          }),
          (allFields) => {
            const { result } = renderHook(() => useCalculatorState(), {
              wrapper: CalculatorStateProvider,
            });

            // Update all fields at once
            act(() => {
              result.current.updateTSParameterState(allFields);
            });

            // Verify all fields are preserved
            expect(result.current.states.tsParameters).toMatchObject(allFields);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Reactive calculation support', () => {
    it('should support partial updates without losing existing state', () => {
      const { result } = renderHook(() => useCalculatorState(), {
        wrapper: CalculatorStateProvider,
      });

      // Set initial state
      act(() => {
        result.current.updateTSParameterState({
          mms: '10',
          kms: '5',
          rms: '2',
        });
      });

      // Update only one field
      act(() => {
        result.current.updateTSParameterState({
          rms: '3',
        });
      });

      // Verify other fields are preserved
      expect(result.current.states.tsParameters.mms).toBe('10');
      expect(result.current.states.tsParameters.kms).toBe('5');
      expect(result.current.states.tsParameters.rms).toBe('3');
    });

    it('should maintain default values for unset fields', () => {
      const { result } = renderHook(() => useCalculatorState(), {
        wrapper: CalculatorStateProvider,
      });

      // Verify default values are set
      expect(result.current.states.tsParameters.airDensity).toBe('1.29');
      expect(result.current.states.tsParameters.soundSpeed).toBe('346.1');
      expect(result.current.states.tsParameters.micDistance).toBe('1');
    });

    it('should allow updating fields that trigger reactive calculations', () => {
      fc.assert(
        fc.property(
          fc.record({
            mms: fc.float({ min: 1, max: 100 }).map(String),
            kms: fc.float({ min: 0.1, max: 10 }).map(String),
            rms: fc.float({ min: 0.1, max: 10 }).map(String),
          }),
          (params) => {
            const { result } = renderHook(() => useCalculatorState(), {
              wrapper: CalculatorStateProvider,
            });

            // Update parameters that would trigger F0 and Qms calculations
            act(() => {
              result.current.updateTSParameterState(params);
            });

            // Verify state is updated correctly
            expect(result.current.states.tsParameters).toMatchObject(params);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
