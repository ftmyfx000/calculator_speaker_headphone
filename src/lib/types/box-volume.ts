/**
 * Type definitions for box volume calculator
 * Supports calculation of speaker enclosure dimensions, volumes, and acoustic properties
 */

/**
 * Input type for calculations starting from internal dimensions
 */
export interface InternalDimensionInput {
  internalWidth: number;    // cm
  internalHeight: number;   // cm
  internalDepth: number;    // cm
  panelThickness: number;   // cm
}

/**
 * Input type for calculations starting from external dimensions
 */
export interface ExternalDimensionInput {
  externalWidth: number;    // cm
  externalHeight: number;   // cm
  externalDepth: number;    // cm
  panelThickness: number;   // cm
}

/**
 * Complete box dimensions (internal and external)
 */
export interface BoxDimensions {
  internal: {
    width: number;   // cm
    height: number;  // cm
    depth: number;   // cm
  };
  external: {
    width: number;   // cm
    height: number;  // cm
    depth: number;   // cm
  };
}

/**
 * Volume data in multiple units
 */
export interface VolumeData {
  cubicCentimeters: number;
  liters: number;
}

/**
 * Dimensional ratio showing proportional relationships
 */
export interface DimensionalRatio {
  width: number;
  height: number;
  depth: number;
}

/**
 * Standing wave frequencies for a single axis at different orders
 */
export interface AxialModeFrequencies {
  order1: number;  // Hz
  order2: number;  // Hz
  order3: number;  // Hz
}

/**
 * A single composite mode frequency with its mode numbers
 */
export interface CompositeModeFrequency {
  mode: [number, number, number];  // [n, m, l]
  frequency: number;                // Hz
}

/**
 * Complete standing wave frequency data
 */
export interface StandingWaveFrequencies {
  axial: {
    width: AxialModeFrequencies;
    height: AxialModeFrequencies;
    depth: AxialModeFrequencies;
  };
  composite: CompositeModeFrequency[];
}

/**
 * Complete calculation results for box volume calculator
 */
export interface BoxVolumeResults {
  dimensions: BoxDimensions;
  volume: VolumeData;
  ratios: {
    internal: DimensionalRatio;
    external: DimensionalRatio;
  };
  standingWaves: StandingWaveFrequencies;
}
