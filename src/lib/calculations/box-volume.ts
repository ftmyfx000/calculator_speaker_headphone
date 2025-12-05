import type {
  InternalDimensionInput,
  ExternalDimensionInput,
  BoxVolumeResults,
  DimensionalRatio,
  StandingWaveFrequencies,
  AxialModeFrequencies,
  CompositeModeFrequency,
} from '../types/box-volume';

// Sound speed constant in m/s at 20°C
export const SOUND_SPEED = 343;

/**
 * Calculate dimensional ratio normalized to show proportional relationships
 * @param width - Width in cm
 * @param height - Height in cm
 * @param depth - Depth in cm
 * @returns Normalized dimensional ratio
 */
export function calculateDimensionalRatio(
  width: number,
  height: number,
  depth: number
): DimensionalRatio {
  // Find the minimum dimension to normalize against
  const minDimension = Math.min(width, height, depth);
  
  return {
    width: width / minDimension,
    height: height / minDimension,
    depth: depth / minDimension,
  };
}

/**
 * Calculate composite mode frequency for a specific mode combination
 * Formula: f = (c/2) × √[(n/W)² + (m/H)² + (l/D)²]
 * @param n - Mode order for width axis
 * @param m - Mode order for height axis
 * @param l - Mode order for depth axis
 * @param width - Width in cm
 * @param height - Height in cm
 * @param depth - Depth in cm
 * @param soundSpeed - Speed of sound in m/s (default: 343)
 * @returns Frequency in Hz
 */
export function calculateCompositeMode(
  n: number,
  m: number,
  l: number,
  width: number,
  height: number,
  depth: number,
  soundSpeed: number = SOUND_SPEED
): number {
  // Convert dimensions from cm to meters
  const widthM = width / 100;
  const heightM = height / 100;
  const depthM = depth / 100;
  
  // Calculate each term: (mode_order / dimension)²
  const widthTerm = (n / widthM) ** 2;
  const heightTerm = (m / heightM) ** 2;
  const depthTerm = (l / depthM) ** 2;
  
  // Calculate frequency: f = (c/2) × √[sum of squared terms]
  const frequency = (soundSpeed / 2) * Math.sqrt(widthTerm + heightTerm + depthTerm);
  
  return frequency;
}

/**
 * Calculate axial mode frequencies for a single axis
 * @param dimension - Dimension in cm
 * @param soundSpeed - Speed of sound in m/s (default: 343)
 * @returns Frequencies for orders 1, 2, and 3
 */
function calculateAxialModes(
  dimension: number,
  soundSpeed: number = SOUND_SPEED
): AxialModeFrequencies {
  // Convert dimension from cm to meters
  const dimensionM = dimension / 100;
  
  return {
    order1: soundSpeed / (2 * dimensionM),
    order2: soundSpeed / dimensionM,
    order3: (1.5 * soundSpeed) / dimensionM,
  };
}

/**
 * Calculate all standing wave frequencies (axial and composite modes)
 * @param width - Width in cm
 * @param height - Height in cm
 * @param depth - Depth in cm
 * @returns Complete standing wave frequency data
 */
export function calculateStandingWaveFrequencies(
  width: number,
  height: number,
  depth: number
): StandingWaveFrequencies {
  // Calculate axial modes for each axis
  const axial = {
    width: calculateAxialModes(width),
    height: calculateAxialModes(height),
    depth: calculateAxialModes(depth),
  };
  
  // Define the 29 composite mode combinations as specified in requirements
  const modeCompositions: [number, number, number][] = [
    [1, 0, 0], [0, 1, 0], [0, 0, 1],
    [1, 1, 0], [1, 0, 1], [0, 1, 1],
    [1, 1, 1],
    [2, 0, 0], [0, 2, 0], [0, 0, 2],
    [2, 1, 0], [2, 0, 1], [0, 2, 1],
    [1, 2, 0], [1, 0, 2], [0, 1, 2],
    [2, 2, 0], [2, 0, 2], [0, 2, 2],
    [2, 1, 1], [1, 2, 1], [1, 1, 2],
    [2, 2, 1], [2, 1, 2], [1, 2, 2],
    [2, 2, 2],
    [3, 0, 0], [0, 3, 0], [0, 0, 3],
  ];
  
  // Calculate frequency for each composite mode
  const composite: CompositeModeFrequency[] = modeCompositions.map(([n, m, l]) => ({
    mode: [n, m, l],
    frequency: calculateCompositeMode(n, m, l, width, height, depth),
  }));
  
  return {
    axial,
    composite,
  };
}

/**
 * Calculate box properties from internal dimensions
 * @param params - Internal dimensions and panel thickness
 * @returns Complete box volume calculation results
 */
export function calculateFromInternalDimensions(
  params: InternalDimensionInput
): BoxVolumeResults {
  const { internalWidth, internalHeight, internalDepth, panelThickness } = params;
  
  // Validate that all dimensions are positive
  if (
    internalWidth <= 0 ||
    internalHeight <= 0 ||
    internalDepth <= 0 ||
    panelThickness <= 0
  ) {
    throw new Error('All dimensions must be positive values');
  }
  
  // Calculate external dimensions: external = internal + 2 × panel thickness
  const externalWidth = internalWidth + 2 * panelThickness;
  const externalHeight = internalHeight + 2 * panelThickness;
  const externalDepth = internalDepth + 2 * panelThickness;
  
  // Calculate internal volume
  const volumeCm3 = internalWidth * internalHeight * internalDepth;
  const volumeLiters = volumeCm3 / 1000;
  
  // Calculate dimensional ratios
  const internalRatio = calculateDimensionalRatio(internalWidth, internalHeight, internalDepth);
  const externalRatio = calculateDimensionalRatio(externalWidth, externalHeight, externalDepth);
  
  // Calculate standing wave frequencies
  const standingWaves = calculateStandingWaveFrequencies(
    internalWidth,
    internalHeight,
    internalDepth
  );
  
  return {
    dimensions: {
      internal: {
        width: internalWidth,
        height: internalHeight,
        depth: internalDepth,
      },
      external: {
        width: externalWidth,
        height: externalHeight,
        depth: externalDepth,
      },
    },
    volume: {
      cubicCentimeters: volumeCm3,
      liters: volumeLiters,
    },
    ratios: {
      internal: internalRatio,
      external: externalRatio,
    },
    standingWaves,
  };
}

/**
 * Calculate box properties from external dimensions
 * @param params - External dimensions and panel thickness
 * @returns Complete box volume calculation results
 * @throws Error if panel thickness is too large (>= half of any external dimension)
 */
export function calculateFromExternalDimensions(
  params: ExternalDimensionInput
): BoxVolumeResults {
  const { externalWidth, externalHeight, externalDepth, panelThickness } = params;
  
  // Validate that all dimensions are positive
  if (
    externalWidth <= 0 ||
    externalHeight <= 0 ||
    externalDepth <= 0 ||
    panelThickness <= 0
  ) {
    throw new Error('All dimensions must be positive values');
  }
  
  // Validate panel thickness
  if (
    panelThickness >= externalWidth / 2 ||
    panelThickness >= externalHeight / 2 ||
    panelThickness >= externalDepth / 2
  ) {
    throw new Error('Panel thickness must be less than half of each external dimension');
  }
  
  // Calculate internal dimensions: internal = external - 2 × panel thickness
  const internalWidth = externalWidth - 2 * panelThickness;
  const internalHeight = externalHeight - 2 * panelThickness;
  const internalDepth = externalDepth - 2 * panelThickness;
  
  // Validate that internal dimensions are positive
  if (internalWidth <= 0 || internalHeight <= 0 || internalDepth <= 0) {
    throw new Error('Invalid configuration: panel thickness is too large for the given external dimensions');
  }
  
  // Calculate internal volume
  const volumeCm3 = internalWidth * internalHeight * internalDepth;
  const volumeLiters = volumeCm3 / 1000;
  
  // Calculate dimensional ratios
  const internalRatio = calculateDimensionalRatio(internalWidth, internalHeight, internalDepth);
  const externalRatio = calculateDimensionalRatio(externalWidth, externalHeight, externalDepth);
  
  // Calculate standing wave frequencies
  const standingWaves = calculateStandingWaveFrequencies(
    internalWidth,
    internalHeight,
    internalDepth
  );
  
  return {
    dimensions: {
      internal: {
        width: internalWidth,
        height: internalHeight,
        depth: internalDepth,
      },
      external: {
        width: externalWidth,
        height: externalHeight,
        depth: externalDepth,
      },
    },
    volume: {
      cubicCentimeters: volumeCm3,
      liters: volumeLiters,
    },
    ratios: {
      internal: internalRatio,
      external: externalRatio,
    },
    standingWaves,
  };
}
