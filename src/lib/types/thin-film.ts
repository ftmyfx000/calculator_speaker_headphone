/**
 * Type definitions for thin film resistance calculations
 */

/**
 * Parameters for thin film resistance calculation
 */
export interface ThinFilmResistanceParams {
  volumeResistivity: number;  // Volume resistivity in Ω·m
  lineWidth: number;          // Line width in meters
  lineThickness: number;      // Line thickness in meters
  lineLength: number;         // Line length in meters
}

/**
 * Result from thin film resistance calculation
 */
export interface ThinFilmResistanceResult {
  resistance: number;  // Resistance in Ohms
}
