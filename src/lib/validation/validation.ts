/**
 * Input validation utilities
 */

/**
 * Check if a value is numeric
 * @param value - String value to check
 * @returns true if the value is a valid number
 */
export function isNumeric(value: string): boolean {
  if (value.trim() === '') {
    return false;
  }
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
}

/**
 * Check if a number is within a specified range
 * @param value - Number to check
 * @param min - Minimum allowed value (inclusive)
 * @param max - Maximum allowed value (inclusive)
 * @returns true if the value is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Get validation error message for a field
 * @param value - Value to validate (string or number)
 * @param fieldName - Name of the field for error message
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Error message string, or null if valid
 */
export function getValidationError(
  value: string | number,
  _fieldName: string,
  min: number,
  max: number
): string | null {
  // Check if value is a string (from input field)
  if (typeof value === 'string') {
    if (value.trim() === '') {
      return null; // Empty is not an error, just no value
    }
    if (!isNumeric(value)) {
      return 'Please enter a valid number';
    }
    value = Number(value);
  }
  
  // Check range
  if (!isInRange(value, min, max)) {
    return `Value must be between ${min} and ${max}`;
  }
  
  return null;
}
