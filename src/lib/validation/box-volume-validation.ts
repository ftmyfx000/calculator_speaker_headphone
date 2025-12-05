/**
 * Box volume calculator validation utilities
 */

/**
 * Check if a dimension value is positive (greater than zero)
 * @param value - Dimension value to check
 * @returns true if the value is positive
 */
export function isPositiveDimension(value: number): boolean {
  return value > 0;
}

/**
 * Validate that all dimensions are positive
 * @param width - Width in cm
 * @param height - Height in cm
 * @param depth - Depth in cm
 * @returns Error message or null if valid
 */
export function validatePositiveDimensions(
  width: number | null,
  height: number | null,
  depth: number | null
): string | null {
  if (width === null || height === null || depth === null) {
    return null; // Missing values, not an error
  }
  
  if (!isPositiveDimension(width) || !isPositiveDimension(height) || !isPositiveDimension(depth)) {
    return 'すべての寸法は正の値である必要があります';
  }
  
  return null;
}

/**
 * Validate panel thickness against external dimensions
 * Panel thickness must be less than half of each external dimension
 * @param panelThickness - Panel thickness in cm
 * @param externalWidth - External width in cm
 * @param externalHeight - External height in cm
 * @param externalDepth - External depth in cm
 * @returns Error message or null if valid
 */
export function validatePanelThickness(
  panelThickness: number | null,
  externalWidth: number | null,
  externalHeight: number | null,
  externalDepth: number | null
): string | null {
  if (
    panelThickness === null ||
    externalWidth === null ||
    externalHeight === null ||
    externalDepth === null
  ) {
    return null; // Missing values, not an error
  }
  
  // Panel thickness must be positive
  if (!isPositiveDimension(panelThickness)) {
    return '板厚は正の値である必要があります';
  }
  
  // Panel thickness must be less than half of each external dimension
  const halfWidth = externalWidth / 2;
  const halfHeight = externalHeight / 2;
  const halfDepth = externalDepth / 2;
  
  if (
    panelThickness >= halfWidth ||
    panelThickness >= halfHeight ||
    panelThickness >= halfDepth
  ) {
    return '板厚は各外寸の半分未満である必要があります';
  }
  
  return null;
}

/**
 * Validate internal dimension inputs
 * @param internalWidth - Internal width in cm
 * @param internalHeight - Internal height in cm
 * @param internalDepth - Internal depth in cm
 * @param panelThickness - Panel thickness in cm
 * @returns Error message or null if valid
 */
export function validateInternalDimensionInputs(
  internalWidth: number | null,
  internalHeight: number | null,
  internalDepth: number | null,
  panelThickness: number | null
): string | null {
  // Validate dimensions are positive
  const dimensionError = validatePositiveDimensions(
    internalWidth,
    internalHeight,
    internalDepth
  );
  if (dimensionError) {
    return dimensionError;
  }
  
  // Validate panel thickness is positive
  if (panelThickness !== null && !isPositiveDimension(panelThickness)) {
    return '板厚は正の値である必要があります';
  }
  
  return null;
}

/**
 * Validate external dimension inputs
 * @param externalWidth - External width in cm
 * @param externalHeight - External height in cm
 * @param externalDepth - External depth in cm
 * @param panelThickness - Panel thickness in cm
 * @returns Error message or null if valid
 */
export function validateExternalDimensionInputs(
  externalWidth: number | null,
  externalHeight: number | null,
  externalDepth: number | null,
  panelThickness: number | null
): string | null {
  // Validate dimensions are positive
  const dimensionError = validatePositiveDimensions(
    externalWidth,
    externalHeight,
    externalDepth
  );
  if (dimensionError) {
    return dimensionError;
  }
  
  // Validate panel thickness against external dimensions
  const thicknessError = validatePanelThickness(
    panelThickness,
    externalWidth,
    externalHeight,
    externalDepth
  );
  if (thicknessError) {
    return thicknessError;
  }
  
  return null;
}

/**
 * Error messages for box volume validation
 */
export const BOX_VOLUME_ERROR_MESSAGES = {
  POSITIVE_DIMENSIONS: 'すべての寸法は正の値である必要があります',
  POSITIVE_PANEL_THICKNESS: '板厚は正の値である必要があります',
  PANEL_THICKNESS_TOO_LARGE: '板厚は各外寸の半分未満である必要があります',
  INVALID_NUMERIC: '有効な数値を入力してください',
  INVALID_CONFIGURATION: '無効な構成: 指定された外寸に対して板厚が大きすぎます',
} as const;
