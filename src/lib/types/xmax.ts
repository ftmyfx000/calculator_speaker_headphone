/**
 * Type definitions for Xmax calculations (German method)
 */

/**
 * Parameters for Xmax calculation
 */
export interface XmaxParams {
  vcWindingWidth: number;   // Voice coil winding width in mm
  plateThickness: number;   // Plate thickness in mm
}

/**
 * Result from Xmax calculation
 */
export interface XmaxResult {
  xmax: number;  // Maximum excursion in mm
}
