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
 * Check if a value is positive (greater than zero)
 * @param value - Number to check
 * @returns true if the value is positive
 */
export function isPositive(value: number): boolean {
  return value > 0;
}

/**
 * Check if a value is non-negative (greater than or equal to zero)
 * @param value - Number to check
 * @returns true if the value is non-negative
 */
export function isNonNegative(value: number): boolean {
  return value >= 0;
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

/**
 * Validation ranges for specific parameters
 */
export const VALIDATION_RANGES = {
  // Frequency parameters
  frequency: { min: 1, max: 100000, unit: 'Hz' },
  f0: { min: 1, max: 1000, unit: 'Hz' },
  
  // SPL parameters
  spl: { min: 0, max: 150, unit: 'dB' },
  
  // Air density
  airDensity: { min: 0.5, max: 2.0, unit: 'kg/m³' },
  
  // Mass parameters (must be positive)
  mms: { min: 0.001, max: 1000, unit: 'g' },
  
  // Resistance parameters (must be positive)
  re: { min: 0.001, max: 1000, unit: 'Ω' },
  rms: { min: 0.001, max: 1000, unit: 'kg/s' },
  
  // Stiffness (must be positive)
  kms: { min: 0.001, max: 100000, unit: 'N/mm' },
  
  // Force factor (must be positive)
  bl: { min: 0.001, max: 100, unit: 'N/A' },
  
  // Dimensions (must be positive)
  effectiveRadius: { min: 0.1, max: 1000, unit: 'mm' },
  micDistance: { min: 0.01, max: 100, unit: 'm' },
  
  // Voltage and power (must be non-negative)
  inputVoltage: { min: 0, max: 1000, unit: 'V' },
  power: { min: 0, max: 10000, unit: 'W' },
  
  // Thin film parameters
  volumeResistivity: { min: 1e-10, max: 1e10, unit: 'Ω·m' },
  lineWidth: { min: 0.001, max: 1000, unit: 'mm' },
  lineThickness: { min: 0.001, max: 1000, unit: 'mm' },
  lineLength: { min: 0.001, max: 100000, unit: 'mm' },
  
  // Xmax parameters
  vcWindingWidth: { min: 0.01, max: 1000, unit: 'mm' },
  plateThickness: { min: 0.01, max: 1000, unit: 'mm' },
  
  // Resonance parameters
  soundSpeed: { min: 100, max: 1000, unit: 'm/s' },
  tubeLength: { min: 0.1, max: 100000, unit: 'mm' },
} as const;

/**
 * Validate a parameter value with specific range
 * @param value - String value to validate
 * @param paramName - Parameter name (key in VALIDATION_RANGES)
 * @returns Error message string, or null if valid
 */
export function validateParameter(
  value: string,
  paramName: keyof typeof VALIDATION_RANGES
): string | null {
  if (value.trim() === '') {
    return null; // Empty is not an error, just no value
  }
  
  if (!isNumeric(value)) {
    return '有効な数値を入力してください';
  }
  
  const numValue = Number(value);
  const range = VALIDATION_RANGES[paramName];
  
  if (!isInRange(numValue, range.min, range.max)) {
    return `値は ${range.min} から ${range.max} ${range.unit} の範囲内である必要があります`;
  }
  
  return null;
}

/**
 * Check if a calculation would result in division by zero
 * @param divisor - The divisor value
 * @returns true if division by zero would occur
 */
export function isDivisionByZero(divisor: number): boolean {
  return Math.abs(divisor) < Number.EPSILON;
}

/**
 * Validate Qms calculation inputs
 * @param f0 - Resonance frequency
 * @param mms - Moving mass
 * @param rms - Mechanical resistance
 * @returns Error message or null if valid
 */
export function validateQmsInputs(
  f0: number | null,
  mms: number | null,
  rms: number | null
): string | null {
  if (f0 === null || mms === null || rms === null) {
    return null; // Missing values, not an error
  }
  
  if (!isPositive(f0)) {
    return 'F0は正の値である必要があります';
  }
  
  if (!isPositive(mms)) {
    return 'Mmsは正の値である必要があります';
  }
  
  if (isDivisionByZero(rms)) {
    return 'Rmsはゼロにできません（ゼロ除算エラー）';
  }
  
  if (!isPositive(rms)) {
    return 'Rmsは正の値である必要があります';
  }
  
  return null;
}

/**
 * Validate Qts calculation inputs
 * @param qes - Electrical Q factor
 * @param qms - Mechanical Q factor
 * @returns Error message or null if valid
 */
export function validateQtsInputs(
  qes: number | null,
  qms: number | null
): string | null {
  if (qes === null || qms === null) {
    return null; // Missing values, not an error
  }
  
  if (!isPositive(qes)) {
    return 'Qesは正の値である必要があります';
  }
  
  if (!isPositive(qms)) {
    return 'Qmsは正の値である必要があります';
  }
  
  if (isDivisionByZero(qes + qms)) {
    return 'Qes + Qmsはゼロにできません（ゼロ除算エラー）';
  }
  
  return null;
}

/**
 * Validate Xmax calculation inputs
 * @param vcWindingWidth - Voice coil winding width
 * @param plateThickness - Plate thickness
 * @returns Error message or null if valid
 */
export function validateXmaxInputs(
  vcWindingWidth: number | null,
  plateThickness: number | null
): string | null {
  if (vcWindingWidth === null || plateThickness === null) {
    return null; // Missing values, not an error
  }
  
  if (!isPositive(vcWindingWidth)) {
    return 'VC巻き幅は正の値である必要があります';
  }
  
  if (!isPositive(plateThickness)) {
    return 'plate厚さは正の値である必要があります';
  }
  
  if (vcWindingWidth <= plateThickness) {
    return 'VC巻き幅はplate厚さより大きい必要があります';
  }
  
  return null;
}
