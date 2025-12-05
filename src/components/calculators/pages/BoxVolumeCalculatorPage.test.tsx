import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, fireEvent } from '@testing-library/react';
import { BoxVolumeCalculatorPage } from './BoxVolumeCalculatorPage';

describe('BoxVolumeCalculatorPage', () => {
  describe('Property-Based Tests', () => {
    /**
     * Feature: box-volume-calculator, Property 9: Mode selector state preservation
     * Validates: Requirements 6.4
     */
    it('panel thickness should be preserved when switching calculation modes', () => {
      fc.assert(
        fc.property(
          // Generate random panel thickness value (0.1-10 cm)
          fc.float({ min: 0.1, max: 10 }),
          (panelThickness) => {
            // Render the component
            const { container } = render(<BoxVolumeCalculatorPage />);
            
            // Find the panel thickness input
            const panelThicknessInput = screen.getByLabelText(/板厚/i) as HTMLInputElement;
            
            // Set the panel thickness value
            fireEvent.change(panelThicknessInput, {
              target: { value: panelThickness.toString() },
            });
            
            // Verify the value was set
            expect(panelThicknessInput.value).toBe(panelThickness.toString());
            
            // Find the mode selector radio buttons
            const internalModeRadio = screen.getByLabelText(/内寸から計算/i) as HTMLInputElement;
            const externalModeRadio = screen.getByLabelText(/外寸から計算/i) as HTMLInputElement;
            
            // Initially should be in internal mode
            expect(internalModeRadio.checked).toBe(true);
            
            // Switch to external mode
            fireEvent.click(externalModeRadio);
            
            // Panel thickness should still be the same
            expect(panelThicknessInput.value).toBe(panelThickness.toString());
            
            // Switch back to internal mode
            fireEvent.click(internalModeRadio);
            
            // Panel thickness should still be the same
            expect(panelThicknessInput.value).toBe(panelThickness.toString());
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
