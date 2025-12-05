import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateDimensionalRatio,
  calculateCompositeMode,
  calculateStandingWaveFrequencies,
  calculateFromInternalDimensions,
  calculateFromExternalDimensions,
  SOUND_SPEED,
} from './box-volume';

describe('Box Volume Calculations', () => {
  describe('Property-Based Tests', () => {
    /**
     * Feature: box-volume-calculator, Property 4: Dimensional ratio scale invariance
     * Validates: Requirements 3.1, 3.2
     */
    it('dimensional ratio should be invariant under uniform scaling', () => {
      fc.assert(
        fc.property(
          // Generate positive dimensions (1-1000 cm)
          fc.float({ min: 1, max: 1000 }),
          fc.float({ min: 1, max: 1000 }),
          fc.float({ min: 1, max: 1000 }),
          // Generate positive scale factor (0.1-10)
          fc.float({ min: 0.1, max: 10 }),
          (width, height, depth, scaleFactor) => {
            // Calculate ratio for original dimensions
            const originalRatio = calculateDimensionalRatio(width, height, depth);
            
            // Scale all dimensions by the same factor
            const scaledWidth = width * scaleFactor;
            const scaledHeight = height * scaleFactor;
            const scaledDepth = depth * scaleFactor;
            
            // Calculate ratio for scaled dimensions
            const scaledRatio = calculateDimensionalRatio(scaledWidth, scaledHeight, scaledDepth);
            
            // Ratios should be equal within floating-point tolerance
            const tolerance = 0.001;
            expect(Math.abs(originalRatio.width - scaledRatio.width)).toBeLessThan(tolerance);
            expect(Math.abs(originalRatio.height - scaledRatio.height)).toBeLessThan(tolerance);
            expect(Math.abs(originalRatio.depth - scaledRatio.depth)).toBeLessThan(tolerance);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: box-volume-calculator, Property 5: Axial frequency ordering
     * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5
     */
    it('axial frequencies should be ordered: order1 < order2 < order3', () => {
      fc.assert(
        fc.property(
          // Generate positive dimensions (1-1000 cm)
          fc.float({ min: 1, max: 1000 }),
          fc.float({ min: 1, max: 1000 }),
          fc.float({ min: 1, max: 1000 }),
          (width, height, depth) => {
            const frequencies = calculateStandingWaveFrequencies(width, height, depth);
            
            // Check width axis ordering
            expect(frequencies.axial.width.order1).toBeLessThan(frequencies.axial.width.order2);
            expect(frequencies.axial.width.order2).toBeLessThan(frequencies.axial.width.order3);
            
            // Check height axis ordering
            expect(frequencies.axial.height.order1).toBeLessThan(frequencies.axial.height.order2);
            expect(frequencies.axial.height.order2).toBeLessThan(frequencies.axial.height.order3);
            
            // Check depth axis ordering
            expect(frequencies.axial.depth.order1).toBeLessThan(frequencies.axial.depth.order2);
            expect(frequencies.axial.depth.order2).toBeLessThan(frequencies.axial.depth.order3);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: box-volume-calculator, Property 6: Composite mode frequency calculation
     * Validates: Requirements 5.1, 5.2
     */
    it('composite modes with single axis should match axial frequencies', () => {
      fc.assert(
        fc.property(
          // Generate positive dimensions (1-1000 cm)
          fc.float({ min: 1, max: 1000 }),
          fc.float({ min: 1, max: 1000 }),
          fc.float({ min: 1, max: 1000 }),
          (width, height, depth) => {
            const frequencies = calculateStandingWaveFrequencies(width, height, depth);
            
            // Find composite modes (1,0,0), (0,1,0), (0,0,1)
            const mode100 = frequencies.composite.find(
              (m) => m.mode[0] === 1 && m.mode[1] === 0 && m.mode[2] === 0
            );
            const mode010 = frequencies.composite.find(
              (m) => m.mode[0] === 0 && m.mode[1] === 1 && m.mode[2] === 0
            );
            const mode001 = frequencies.composite.find(
              (m) => m.mode[0] === 0 && m.mode[1] === 0 && m.mode[2] === 1
            );
            
            // These should match the axial order1 frequencies
            const tolerance = 0.001;
            expect(mode100).toBeDefined();
            expect(mode010).toBeDefined();
            expect(mode001).toBeDefined();
            
            if (mode100) {
              expect(Math.abs(mode100.frequency - frequencies.axial.width.order1)).toBeLessThan(
                tolerance
              );
            }
            if (mode010) {
              expect(Math.abs(mode010.frequency - frequencies.axial.height.order1)).toBeLessThan(
                tolerance
              );
            }
            if (mode001) {
              expect(Math.abs(mode001.frequency - frequencies.axial.depth.order1)).toBeLessThan(
                tolerance
              );
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: box-volume-calculator, Property 1: External dimension calculation consistency
     * Validates: Requirements 1.1, 1.2, 1.3
     */
    it('round-trip: internal -> external -> internal should preserve dimensions', () => {
      fc.assert(
        fc.property(
          // Generate positive internal dimensions (10-1000 cm)
          fc.float({ min: 10, max: 1000 }),
          fc.float({ min: 10, max: 1000 }),
          fc.float({ min: 10, max: 1000 }),
          // Generate panel thickness (0.5-5 cm)
          fc.float({ min: 0.5, max: 5 }),
          (internalWidth, internalHeight, internalDepth, panelThickness) => {
            // Calculate from internal dimensions
            const result1 = calculateFromInternalDimensions({
              internalWidth,
              internalHeight,
              internalDepth,
              panelThickness,
            });
            
            // Use the external dimensions to calculate back
            const result2 = calculateFromExternalDimensions({
              externalWidth: result1.dimensions.external.width,
              externalHeight: result1.dimensions.external.height,
              externalDepth: result1.dimensions.external.depth,
              panelThickness,
            });
            
            // Internal dimensions should match within tolerance
            const tolerance = 0.001;
            expect(
              Math.abs(result2.dimensions.internal.width - internalWidth)
            ).toBeLessThan(tolerance);
            expect(
              Math.abs(result2.dimensions.internal.height - internalHeight)
            ).toBeLessThan(tolerance);
            expect(
              Math.abs(result2.dimensions.internal.depth - internalDepth)
            ).toBeLessThan(tolerance);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: box-volume-calculator, Property 3: Volume calculation consistency
     * Validates: Requirements 1.4, 1.5, 2.5
     */
    it('volume in liters should equal cubic centimeters divided by 1000', () => {
      fc.assert(
        fc.property(
          // Generate positive internal dimensions (1-1000 cm)
          fc.float({ min: 1, max: 1000 }),
          fc.float({ min: 1, max: 1000 }),
          fc.float({ min: 1, max: 1000 }),
          // Generate panel thickness (0.1-5 cm)
          fc.float({ min: 0.1, max: 5 }),
          (internalWidth, internalHeight, internalDepth, panelThickness) => {
            const result = calculateFromInternalDimensions({
              internalWidth,
              internalHeight,
              internalDepth,
              panelThickness,
            });
            
            // Verify volume conversion
            const expectedLiters = result.volume.cubicCentimeters / 1000;
            const tolerance = 0.001;
            expect(Math.abs(result.volume.liters - expectedLiters)).toBeLessThan(tolerance);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: box-volume-calculator, Property 2: Internal dimension calculation consistency
     * Validates: Requirements 2.1, 2.2, 2.3
     */
    it('round-trip: external -> internal -> external should preserve dimensions', () => {
      fc.assert(
        fc.property(
          // Generate positive external dimensions (20-1000 cm)
          fc.float({ min: 20, max: 1000 }),
          fc.float({ min: 20, max: 1000 }),
          fc.float({ min: 20, max: 1000 }),
          (externalWidth, externalHeight, externalDepth) => {
            // Generate panel thickness that's valid (< half of smallest dimension)
            const minDimension = Math.min(externalWidth, externalHeight, externalDepth);
            const maxPanelThickness = minDimension / 2 - 0.1; // Leave some margin
            
            // Only test if we can have a reasonable panel thickness
            fc.pre(maxPanelThickness > 0.5);
            
            const panelThickness = fc.sample(
              fc.float({ min: 0.5, max: maxPanelThickness }),
              1
            )[0];
            
            // Calculate from external dimensions
            const result1 = calculateFromExternalDimensions({
              externalWidth,
              externalHeight,
              externalDepth,
              panelThickness,
            });
            
            // Use the internal dimensions to calculate back
            const result2 = calculateFromInternalDimensions({
              internalWidth: result1.dimensions.internal.width,
              internalHeight: result1.dimensions.internal.height,
              internalDepth: result1.dimensions.internal.depth,
              panelThickness,
            });
            
            // External dimensions should match within tolerance
            const tolerance = 0.001;
            expect(
              Math.abs(result2.dimensions.external.width - externalWidth)
            ).toBeLessThan(tolerance);
            expect(
              Math.abs(result2.dimensions.external.height - externalHeight)
            ).toBeLessThan(tolerance);
            expect(
              Math.abs(result2.dimensions.external.depth - externalDepth)
            ).toBeLessThan(tolerance);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: box-volume-calculator, Property 7: Panel thickness validation
     * Validates: Requirements 2.4
     */
    it('should reject panel thickness >= half of any external dimension', () => {
      fc.assert(
        fc.property(
          // Generate positive external dimensions (10-1000 cm)
          fc.float({ min: 10, max: 1000 }),
          fc.float({ min: 10, max: 1000 }),
          fc.float({ min: 10, max: 1000 }),
          (externalWidth, externalHeight, externalDepth) => {
            // Find the smallest dimension
            const minDimension = Math.min(externalWidth, externalHeight, externalDepth);
            
            // Generate panel thickness >= half of smallest dimension
            const invalidPanelThickness = fc.sample(
              fc.float({ min: minDimension / 2, max: minDimension }),
              1
            )[0];
            
            // Should throw an error
            expect(() => {
              calculateFromExternalDimensions({
                externalWidth,
                externalHeight,
                externalDepth,
                panelThickness: invalidPanelThickness,
              });
            }).toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: box-volume-calculator, Property 8: Positive dimension validation
     * Validates: Requirements 7.1
     */
    it('should reject non-positive dimensions', () => {
      fc.assert(
        fc.property(
          // Generate dimensions where at least one is non-positive
          fc.float({ min: -100, max: 1000 }),
          fc.float({ min: -100, max: 1000 }),
          fc.float({ min: -100, max: 1000 }),
          fc.float({ min: -100, max: 1000 }),
          (dim1, dim2, dim3, dim4) => {
            // Ensure at least one dimension is non-positive
            fc.pre(dim1 <= 0 || dim2 <= 0 || dim3 <= 0 || dim4 <= 0);
            
            // Test with internal dimensions
            expect(() => {
              calculateFromInternalDimensions({
                internalWidth: dim1,
                internalHeight: dim2,
                internalDepth: dim3,
                panelThickness: dim4,
              });
            }).toThrow();
            
            // Test with external dimensions
            expect(() => {
              calculateFromExternalDimensions({
                externalWidth: dim1,
                externalHeight: dim2,
                externalDepth: dim3,
                panelThickness: dim4,
              });
            }).toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
