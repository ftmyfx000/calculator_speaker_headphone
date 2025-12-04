/**
 * TS (Thiele-Small) Parameter Calculations
 */

/**
 * Calculate F0 (Resonance Frequency)
 * Formula: F0 = sqrt(Kms / Mms) / (2 * π)
 * 
 * @param mms - Moving mass in grams (g)
 * @param kms - Mechanical stiffness in N/mm
 * @returns Resonance frequency in Hz
 */
export function calculateF0(mms: number, kms: number): number {
  // Convert units: g → kg, N/mm → N/m
  const mmsKg = mms / 1000;
  const kmsNm = kms * 1000;
  
  // F0 = sqrt(Kms / Mms) / (2 * π)
  return Math.sqrt(kmsNm / mmsKg) / (2 * Math.PI);
}

/**
 * Calculate Vas (Equivalent Compliance Volume)
 * Formula: Vas = ρ * c² * (π * a²)² / Kms * 1000
 * 
 * @param airDensity - Air density in kg/m³
 * @param effectiveRadius - Effective radius in mm
 * @param kms - Mechanical stiffness in N/mm
 * @returns Equivalent compliance volume in liters
 */
export function calculateVas(
  airDensity: number,
  effectiveRadius: number,
  kms: number
): number {
  const SPEED_OF_SOUND = 346.1; // m/s
  
  // Convert units: mm → m, N/mm → N/m
  const radiusM = effectiveRadius / 1000;
  const kmsNm = kms * 1000;
  
  // Vas = ρ * c² * (π * a²)² / Kms * 1000
  const effectiveArea = Math.PI * radiusM * radiusM;
  const vas = (airDensity * SPEED_OF_SOUND * SPEED_OF_SOUND * effectiveArea * effectiveArea / kmsNm) * 1000;
  
  return vas;
}


/**
 * Calculate Qes (Electrical Q Factor)
 * Formula: Qes = 2 * π * F0 * Re * Mms / Bl²
 * 
 * @param f0 - Resonance frequency in Hz
 * @param re - DC resistance in Ohms
 * @param mms - Moving mass in grams (g)
 * @param bl - Force factor in N/A
 * @returns Electrical Q factor
 */
export function calculateQes(
  f0: number,
  re: number,
  mms: number,
  bl: number
): number {
  // Convert units: g → kg
  const mmsKg = mms / 1000;
  
  // Qes = 2 * π * F0 * Re * Mms / Bl²
  return (2 * Math.PI * f0 * re * mmsKg) / (bl * bl);
}


/**
 * Calculate air load mass for both free space and infinite baffle
 * Free space: MairFree = (8/3) * ρ * a³ * 1000
 * Infinite baffle: MairBaffle = (16/3) * ρ * a³ * 1000
 * 
 * @param effectiveRadius - Effective radius in mm
 * @param airDensity - Air density in kg/m³
 * @returns Object with airLoadMassFree and airLoadMassBaffle in grams
 */
export function calculateAirLoadMass(
  effectiveRadius: number,
  airDensity: number
): { airLoadMassFree: number; airLoadMassBaffle: number } {
  // Convert units: mm → m
  const radiusM = effectiveRadius / 1000;
  const radiusCubed = radiusM * radiusM * radiusM;
  
  // Free space: (8/3) * ρ * a³ * 1000
  const airLoadMassFree = (8 / 3) * airDensity * radiusCubed * 1000;
  
  // Infinite baffle: (16/3) * ρ * a³ * 1000
  const airLoadMassBaffle = (16 / 3) * airDensity * radiusCubed * 1000;
  
  return { airLoadMassFree, airLoadMassBaffle };
}


/**
 * Calculate input voltage from DC resistance and power
 * Formula: V = sqrt(Re * P)
 * 
 * @param re - DC resistance in Ohms
 * @param power - Power in watts
 * @returns Input voltage in volts
 */
export function calculateInputVoltage(re: number, power: number): number {
  // V = sqrt(Re * P)
  return Math.sqrt(re * power);
}
