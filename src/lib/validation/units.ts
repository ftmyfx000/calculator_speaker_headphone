/**
 * Unit conversion utilities
 */

/**
 * Convert grams to kilograms
 * @param g - Mass in grams
 * @returns Mass in kilograms
 */
export function gramsToKilograms(g: number): number {
  return g / 1000;
}

/**
 * Convert kilograms to grams
 * @param kg - Mass in kilograms
 * @returns Mass in grams
 */
export function kilogramsToGrams(kg: number): number {
  return kg * 1000;
}

/**
 * Convert millimeters to meters
 * @param mm - Length in millimeters
 * @returns Length in meters
 */
export function millimetersToMeters(mm: number): number {
  return mm / 1000;
}

/**
 * Convert meters to millimeters
 * @param m - Length in meters
 * @returns Length in millimeters
 */
export function metersToMillimeters(m: number): number {
  return m * 1000;
}
