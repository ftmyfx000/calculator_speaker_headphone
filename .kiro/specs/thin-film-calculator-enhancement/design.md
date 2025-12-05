# Design Document

## Overview

This design document outlines the enhancement of the thin film resistance calculator to support multi-directional calculations. The system will allow users to solve for any parameter in the resistance formula R = ρ × L / (W × T) by selecting which parameter to calculate and providing the remaining parameters as inputs. Additionally, the volume resistivity input will be enhanced with material presets based on a reference table, with a default unit of 10⁻⁸ Ω·m for improved usability.

## Architecture

The enhanced calculator follows a component-based architecture with clear separation of concerns:

### Component Hierarchy

```
ThinFilmResistancePage
└── ThinFilmResistanceSection (Enhanced)
    ├── CalculationModeSelector (New)
    ├── VolumeResistivityInput (New)
    ├── InputField (Existing, conditionally rendered)
    ├── ResultDisplay (Existing, conditionally rendered)
    └── FormulaDisplay (Enhanced)
```

### Data Flow

1. User selects calculation mode → State updates → UI reconfigures input/output fields
2. User selects material preset or enters custom value → Volume resistivity updates
3. User enters input values → Validation occurs → Calculation triggers → Result displays
4. Calculation mode changes → Previous values preserved → Field roles swap

## Components and Interfaces

### 1. CalculationModeSelector Component

A new component for selecting which parameter to calculate.

```typescript
interface CalculationModeSelectorProps {
  selectedMode: CalculationMode;
  onChange: (mode: CalculationMode) => void;
}

type CalculationMode = 
  | 'resistance'
  | 'lineWidth'
  | 'lineThickness'
  | 'lineLength'
  | 'volumeResistivity';
```

### 2. VolumeResistivityInput Component

A new component combining dropdown material selection with custom input.

```typescript
interface VolumeResistivityInputProps {
  value: string;
  onChange: (value: string) => void;
  isOutput: boolean;
  disabled?: boolean;
}

interface MaterialPreset {
  name: string;
  resistivity: number; // in 10⁻⁸ Ω·m
  nameJa: string;
}
```

### 3. Enhanced ThinFilmResistanceSection

The main section component will be enhanced to support multiple calculation modes.

```typescript
interface ThinFilmState {
  calculationMode: CalculationMode;
  volumeResistivity: string;
  lineWidth: string;
  lineThickness: string;
  lineLength: string;
  resistance: string;
  materialPresetMode: 'preset' | 'custom';
  selectedMaterial: string | null;
}
```

## Data Models

### Material Presets

Based on resistivityJ.pdf, the system will include all materials from the reference table (values at 20°C in 10⁻⁸ Ω·m):

```typescript
const MATERIAL_PRESETS: MaterialPreset[] = [
  { name: 'Silver', nameJa: '銀', resistivity: 1.6 },
  { name: 'Copper', nameJa: '銅', resistivity: 1.7 },
  { name: 'Gold', nameJa: '金', resistivity: 2.4 },
  { name: 'Aluminium', nameJa: 'アルミニウム', resistivity: 2.8 },
  { name: 'Magnesium', nameJa: 'マグネシウム', resistivity: 4.5 },
  { name: 'Molybdenum', nameJa: 'モリブデン', resistivity: 5.3 },
  { name: 'Tungsten', nameJa: 'タングステン', resistivity: 5.6 },
  { name: 'Beryllium', nameJa: 'ベリリウム', resistivity: 6.1 },
  { name: 'Brass 70-30', nameJa: 'ブラス 70-30', resistivity: 6.3 },
  { name: 'Nickel', nameJa: 'ニッケル', resistivity: 6.9 },
  { name: 'Mercury', nameJa: '水銀', resistivity: 9.7 },
  { name: 'Platinum', nameJa: 'プラチナ', resistivity: 9.9 },
  { name: 'Iron', nameJa: '鉄', resistivity: 10.2 },
  { name: 'Tin', nameJa: 'すず', resistivity: 11.4 },
  { name: 'Chromium', nameJa: 'クロム', resistivity: 12.7 },
  { name: 'Steel, Low C', nameJa: 'スチール 低C', resistivity: 12.7 },
  { name: 'Steel, 1.0 C', nameJa: 'スチール 1.0C', resistivity: 18.8 },
  { name: 'Lead', nameJa: '鉛', resistivity: 20.8 },
  { name: 'Uranium', nameJa: 'ウラン', resistivity: 32.0 },
  { name: 'Antimony', nameJa: 'アンチモニー', resistivity: 39.4 },
  { name: 'Zirconium', nameJa: 'ジルコニウム', resistivity: 40.6 },
  { name: 'Monel', nameJa: 'モネル', resistivity: 44.2 },
  { name: 'Titanium', nameJa: 'チタン', resistivity: 53.3 },
  { name: 'Stainless Steel 410', nameJa: 'SUS 410', resistivity: 62.2 },
  { name: 'Stainless Steel Nonmagnetic', nameJa: 'ステンレス 非磁性', resistivity: 73.7 },
  { name: 'Nichrome', nameJa: 'ニクロム', resistivity: 108.0 },
  { name: 'Manganese', nameJa: 'マンガン', resistivity: 185.4 },
  { name: 'Carbon', nameJa: 'カーボン', resistivity: 3352.8 },
  // Note: Values are reference values from resistivityJ.pdf at 20°C
  // Precision is not guaranteed and may vary with temperature and material purity
];
```

### Calculation Functions

Enhanced calculation module supporting all five calculation modes:

```typescript
// Calculate resistance: R = ρ × L / (W × T)
function calculateResistance(
  volumeResistivity: number, // in Ω·m
  lineLength: number,         // in m
  lineWidth: number,          // in m
  lineThickness: number       // in m
): number;

// Calculate line width: W = ρ × L / (R × T)
function calculateLineWidth(
  volumeResistivity: number,
  lineLength: number,
  resistance: number,
  lineThickness: number
): number;

// Calculate line thickness: T = ρ × L / (R × W)
function calculateLineThickness(
  volumeResistivity: number,
  lineLength: number,
  resistance: number,
  lineWidth: number
): number;

// Calculate line length: L = R × W × T / ρ
function calculateLineLength(
  resistance: number,
  lineWidth: number,
  lineThickness: number,
  volumeResistivity: number
): number;

// Calculate volume resistivity: ρ = R × W × T / L
function calculateVolumeResistivity(
  resistance: number,
  lineWidth: number,
  lineThickness: number,
  lineLength: number
): number;
```

## C
orrectness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

After reviewing the acceptance criteria, several properties are redundant and can be consolidated:
- Property 4.2 is redundant with 2.2 (both test preset material selection)
- Property 6.4 is redundant with 6.2 (both test formula display)
- Property 7.3 is redundant with 1.5 (both test division by zero)

The following properties represent the unique, testable correctness guarantees:

**Property 1: Mode selection designates correct input/output roles**
*For any* calculation mode selection, exactly one parameter should be designated as output and the remaining four parameters should be designated as inputs.
**Validates: Requirements 1.2**

**Property 2: Value preservation across mode changes**
*For any* set of parameter values and any calculation mode change, all previously entered values should be preserved in the new mode.
**Validates: Requirements 1.3**

**Property 3: Calculation satisfies resistance formula**
*For any* valid set of four input parameters and any calculation mode, the calculated output parameter should satisfy the equation R = ρ × L / (W × T) within numerical precision limits.
**Validates: Requirements 1.4**

**Property 4: Preset material selection populates correct resistivity**
*For any* material in the preset list, selecting that material should populate the volume resistivity field with the exact value (in 10⁻⁸ Ω·m) defined for that material in the preset data.
**Validates: Requirements 2.2**

**Property 5: Custom resistivity values interpreted in correct units**
*For any* numeric value entered in custom mode, the system should interpret and use that value as being in units of 10⁻⁸ Ω·m for all calculations.
**Validates: Requirements 2.4**

**Property 6: Resistivity mode switching preserves values**
*For any* volume resistivity value, switching between preset and custom modes should preserve the numeric value when the conversion is possible.
**Validates: Requirements 2.5**

**Property 7: Volume resistivity display uses correct units**
*For any* displayed volume resistivity value, the unit label should indicate 10⁻⁸ Ω·m.
**Validates: Requirements 3.1**

**Property 8: Volume resistivity input conversion**
*For any* volume resistivity input value V in 10⁻⁸ Ω·m, the internal calculation should use the value V × 10⁻⁸ in Ω·m.
**Validates: Requirements 3.3**

**Property 9: Volume resistivity output conversion**
*For any* calculated volume resistivity value R in Ω·m, the displayed value should be R / 10⁻⁸ in units of 10⁻⁸ Ω·m.
**Validates: Requirements 3.4**

**Property 10: Dimensional input unit acceptance**
*For any* line width, line thickness, or line length input, the system should accept and interpret the value as millimeters.
**Validates: Requirements 5.1**

**Property 11: Dimensional input conversion for calculation**
*For any* dimensional input value D in millimeters, the calculation should use the value D / 1000 in meters.
**Validates: Requirements 5.2**

**Property 12: Dimensional output conversion for display**
*For any* calculated dimensional output value M in meters, the displayed value should be M × 1000 in millimeters.
**Validates: Requirements 5.3**

**Property 13: Numerical precision maintenance**
*For any* unit conversion operation, the result should maintain at least six decimal places of precision.
**Validates: Requirements 5.5**

**Property 14: Visual indicator updates with mode changes**
*For any* calculation mode change, the visual indicators distinguishing input and output fields should update immediately to reflect the new configuration.
**Validates: Requirements 6.3**

**Property 15: Validation error disables calculation**
*For any* input state containing validation errors, the calculation should be disabled and error indicators should be displayed for the invalid fields.
**Validates: Requirements 7.4**

**Property 16: Error correction enables calculation**
*For any* input state that transitions from having validation errors to having all valid inputs, the error messages should be removed and calculation should be re-enabled.
**Validates: Requirements 7.5**

## Error Handling

### Input Validation

The system implements comprehensive input validation:

1. **Type Validation**: All numeric inputs must be valid numbers (including scientific notation)
2. **Range Validation**: All physical parameters must be positive (> 0)
3. **Division by Zero Prevention**: Parameters that would cause division by zero are rejected
4. **Unit Validation**: Inputs must be in the expected units

### Error Messages

Clear, actionable error messages guide users:

- "Please enter a valid number"
- "Value must be positive"
- "This value would cause division by zero"
- "All input fields must be filled"

### Error Recovery

The system supports graceful error recovery:

1. Errors are displayed inline with the problematic field
2. Calculation is disabled while errors exist
3. Errors clear automatically when corrected
4. Previous valid values are preserved during error states

## Testing Strategy

### Unit Testing

Unit tests will verify:

1. Each calculation function produces correct results for known inputs
2. Unit conversion functions maintain accuracy
3. Material preset data matches reference values
4. Input validation correctly identifies invalid inputs
5. UI components render with correct props
6. State management preserves values across mode changes

### Property-Based Testing

Property-based tests will be implemented using fast-check (TypeScript property testing library). Each test will run a minimum of 100 iterations with randomly generated inputs.

**Test Configuration**:
```typescript
import fc from 'fast-check';

// Configure to run 100+ iterations per property
const testConfig = { numRuns: 100 };
```

**Property Test Implementation**:

Each correctness property will be implemented as a property-based test with explicit tagging:

```typescript
// Example property test structure
it('Property 3: Calculation satisfies resistance formula', () => {
  fc.assert(
    fc.property(
      // Generators for valid inputs
      fc.double({ min: 0.01, max: 1000 }),
      fc.double({ min: 0.01, max: 1000 }),
      fc.double({ min: 0.01, max: 1000 }),
      fc.double({ min: 0.01, max: 1000 }),
      (param1, param2, param3, param4) => {
        // Test that calculation satisfies formula
        // **Feature: thin-film-calculator-enhancement, Property 3**
      }
    ),
    testConfig
  );
});
```

**Generator Strategy**:

Smart generators will be used to constrain inputs to valid ranges:

- Physical dimensions: positive values in realistic ranges (0.01 to 1000)
- Resistivity: positive values matching material ranges
- Calculation modes: all five valid modes
- Material presets: all defined materials

**Edge Case Handling**:

Property test generators will include edge cases:

- Very small values (near zero but positive)
- Very large values
- Values that might cause numerical precision issues
- Boundary values for unit conversions

### Integration Testing

Integration tests will verify:

1. Complete user workflows (select mode → enter inputs → view results)
2. Mode switching preserves state correctly
3. Material preset selection updates calculations
4. Error states propagate correctly through the UI
5. Unit conversions work end-to-end

### Test Organization

Tests will be organized by component:

```
src/lib/calculations/thin-film-multi.test.ts
src/lib/calculations/thin-film-multi.property.test.ts
src/components/calculators/CalculationModeSelector.test.tsx
src/components/calculators/VolumeResistivityInput.test.tsx
src/components/calculators/sections/ThinFilmResistanceSection.test.tsx
```

## Implementation Notes

### State Management

The calculator state will be managed through the existing CalculatorStateContext, extended with new fields for calculation mode and material selection.

### Backward Compatibility

The enhancement maintains backward compatibility:

- Default calculation mode is 'resistance' (current behavior)
- Existing API functions remain available
- New functions are additive, not breaking changes

### Performance Considerations

- Calculations are performed synchronously (fast enough for real-time updates)
- Material preset list is static (no dynamic loading required)
- Validation runs on every input change (debouncing not required for this use case)

### Accessibility

- All form controls have proper labels
- Error messages are associated with their fields using aria-describedby
- Calculation mode selector is keyboard navigable
- Screen readers announce mode changes and calculation results

### Internationalization

- All UI text is in Japanese (primary user base)
- Material names include both English and Japanese
- Number formatting follows Japanese conventions
- Unit symbols use international standards (Ω, m, mm)
