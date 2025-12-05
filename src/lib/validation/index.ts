/**
 * Validation and unit conversion utilities
 */

export { isNumeric, isInRange, getValidationError } from './validation';
export {
  gramsToKilograms,
  kilogramsToGrams,
  millimetersToMeters,
  metersToMillimeters
} from './units';
export {
  isPositiveDimension,
  validatePositiveDimensions,
  validatePanelThickness,
  validateInternalDimensionInputs,
  validateExternalDimensionInputs,
  BOX_VOLUME_ERROR_MESSAGES,
} from './box-volume-validation';
