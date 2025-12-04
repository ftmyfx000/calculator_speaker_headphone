import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fc from 'fast-check';
import { TSParameterCalculator } from './TSParameterCalculator';
import { calculateF0 } from '../../lib/calculations/ts-parameters';

describe('TSParameterCalculator', () => {
  /**
   * Feature: speaker-calculator-webapp, Property 18: Reactive calculation updates
   * Validates: Requirements 9.2
   * 
   * For any input parameter change, all output fields that depend on that parameter 
   * should be recalculated and updated
   */
  it('Property 18: should reactively update F0 when Mms or Kms changes', () => {
    fc.assert(
      fc.asyncProperty(
        fc.float({ min: 0.1, max: 100, noNaN: true }),  // Mms in grams
        fc.float({ min: 0.1, max: 10, noNaN: true }),   // Kms in N/mm
        async (mms, kms) => {
      const user = userEvent.setup();
      render(<TSParameterCalculator />);

      // Find input fields
      const mmsInput = screen.getByLabelText(/Mms/i) as HTMLInputElement;
      const kmsInput = screen.getByLabelText(/Kms/i) as HTMLInputElement;

      // Clear and enter Mms value
      await user.clear(mmsInput);
      await user.type(mmsInput, mms.toString());

      // Clear and enter Kms value
      await user.clear(kmsInput);
      await user.type(kmsInput, kms.toString());

      // Calculate expected F0
      const expectedF0 = calculateF0(mms, kms);

          // Wait for the result to be displayed
          await waitFor(() => {
            const f0Display = screen.getByText(/F0.*共振周波数/i).closest('div');
            expect(f0Display).toBeInTheDocument();
            
            // Check that the calculated value is displayed
            const displayedValue = f0Display?.textContent?.match(/[\d.]+/)?.[0];
            if (displayedValue) {
              const displayedF0 = parseFloat(displayedValue);
              // Allow for small floating point differences and display precision
              expect(Math.abs(displayedF0 - expectedF0)).toBeLessThan(0.01);
            }
          }, { timeout: 1000 });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: speaker-calculator-webapp, Property 19: Partial input handling
   * Validates: Requirements 9.3
   * 
   * For any incomplete set of input parameters, the system should display only those 
   * results that can be calculated with the available inputs
   */
  it('Property 19: should only display calculable results with partial inputs', () => {
    fc.assert(
      fc.asyncProperty(
        fc.float({ min: 0.1, max: 100, noNaN: true }),  // Mms in grams
        async (mms) => {
          const user = userEvent.setup();
          render(<TSParameterCalculator />);

          // Enter only Mms (partial input)
          const mmsInput = screen.getByLabelText(/Mms/i) as HTMLInputElement;
          await user.clear(mmsInput);
          await user.type(mmsInput, mms.toString());

          // Wait a bit for any calculations to complete
          await waitFor(() => {
            // F0 requires both Mms and Kms, so it should show "—" (not calculated)
            const f0Display = screen.getByText(/F0.*共振周波数/i).closest('div');
            expect(f0Display?.textContent).toContain('—');
            
            // Qes requires Mms, Kms, Re, and Bl, so it should show "—"
            const qesDisplay = screen.getByText(/Qes.*電気的Q値/i).closest('div');
            expect(qesDisplay?.textContent).toContain('—');
          }, { timeout: 500 });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: speaker-calculator-webapp, Property 20: Complete input handling
   * Validates: Requirements 9.4
   * 
   * For any complete set of required input parameters, the system should display 
   * all calculable results
   */
  it('Property 20: should display all results when all inputs are provided', () => {
    fc.assert(
      fc.asyncProperty(
        fc.float({ min: 0.1, max: 100, noNaN: true }),  // Mms
        fc.float({ min: 0.1, max: 10, noNaN: true }),   // Kms
        fc.float({ min: 0.1, max: 20, noNaN: true }),   // Bl
        fc.float({ min: 1, max: 100, noNaN: true }),    // Re
        fc.float({ min: 10, max: 100, noNaN: true }),   // effectiveRadius
        fc.float({ min: 0.1, max: 10, noNaN: true }),   // power
        async (mms, kms, bl, re, effectiveRadius, power) => {
          const user = userEvent.setup();
          render(<TSParameterCalculator />);

          // Enter all required inputs
          await user.type(screen.getByLabelText(/Mms/i), mms.toString());
          await user.type(screen.getByLabelText(/Kms/i), kms.toString());
          await user.type(screen.getByLabelText(/Bl/i), bl.toString());
          await user.type(screen.getByLabelText(/Re.*DC抵抗/i), re.toString());
          await user.type(screen.getByLabelText(/有効半径/i), effectiveRadius.toString());
          await user.type(screen.getByLabelText(/入力電力/i), power.toString());

          // Wait for calculations to complete
          await waitFor(() => {
            // All results should be displayed (not showing "—")
            const f0Display = screen.getByText(/F0.*共振周波数/i).closest('div');
            expect(f0Display?.textContent).not.toContain('—');
            
            const vasDisplay = screen.getByText(/Vas.*等価コンプライアンス容積/i).closest('div');
            expect(vasDisplay?.textContent).not.toContain('—');
            
            const qesDisplay = screen.getByText(/Qes.*電気的Q値/i).closest('div');
            expect(qesDisplay?.textContent).not.toContain('—');
            
            const airLoadFreeDisplay = screen.getByText(/空気負荷質量.*自由空間/i).closest('div');
            expect(airLoadFreeDisplay?.textContent).not.toContain('—');
            
            const airLoadBaffleDisplay = screen.getByText(/空気負荷質量.*無限バッフル/i).closest('div');
            expect(airLoadBaffleDisplay?.textContent).not.toContain('—');
            
            const voltageDisplay = screen.getByText(/入力電圧/i).closest('div');
            expect(voltageDisplay?.textContent).not.toContain('—');
          }, { timeout: 1000 });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: speaker-calculator-webapp, Property 21: Input clearing cascades to outputs
   * Validates: Requirements 9.5
   * 
   * For any input field, when its value is cleared or removed, all output fields 
   * that depend on that input should also be cleared
   */
  it('Property 21: should clear dependent results when input is cleared', () => {
    fc.assert(
      fc.asyncProperty(
        fc.float({ min: 0.1, max: 100, noNaN: true }),  // Mms
        fc.float({ min: 0.1, max: 10, noNaN: true }),   // Kms
        async (mms, kms) => {
          const user = userEvent.setup();
          render(<TSParameterCalculator />);

          // Enter Mms and Kms to calculate F0
          const mmsInput = screen.getByLabelText(/Mms/i) as HTMLInputElement;
          const kmsInput = screen.getByLabelText(/Kms/i) as HTMLInputElement;
          
          await user.type(mmsInput, mms.toString());
          await user.type(kmsInput, kms.toString());

          // Wait for F0 to be calculated
          await waitFor(() => {
            const f0Display = screen.getByText(/F0.*共振周波数/i).closest('div');
            expect(f0Display?.textContent).not.toContain('—');
          }, { timeout: 500 });

          // Clear Mms input
          await user.clear(mmsInput);

          // Wait for F0 to be cleared (should show "—")
          await waitFor(() => {
            const f0Display = screen.getByText(/F0.*共振周波数/i).closest('div');
            expect(f0Display?.textContent).toContain('—');
          }, { timeout: 500 });
        }
      ),
      { numRuns: 100 }
    );
  });
});
