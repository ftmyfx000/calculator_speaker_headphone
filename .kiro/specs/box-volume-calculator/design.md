# Design Document: Box Volume Calculator

## Overview

The box volume calculator is a new feature that enables speaker builders to calculate acoustic properties of speaker enclosures. The calculator supports two input modes: internal dimensions and external dimensions. It computes box volumes, dimensional ratios, and standing wave frequencies including complex composite modes. The feature integrates into the existing speaker calculator web application as a new calculator page.

## Architecture

The box volume calculator follows the established architecture pattern used in other calculator features:

- **Page Component**: A new page component (`BoxVolumeCalculatorPage.tsx`) that handles the UI layout and user interactions
- **Calculation Module**: Pure calculation functions in `src/lib/calculations/box-volume.ts` that perform all mathematical operations
- **Type Definitions**: TypeScript interfaces in `src/lib/types/box-volume.ts` defining input and output data structures
- **Validation**: Input validation using the existing validation framework in `src/lib/validation/`
- **State Management**: Local component state for input values and calculation mode selection

The calculator will be added to the main application navigation alongside existing calculators.

## Components and Interfaces

### Page Component: BoxVolumeCalculatorPage

**Location**: `src/components/calculators/pages/BoxVolumeCalculatorPage.tsx`

**Responsibilities**:
- Render calculation mode selector (internal vs external dimensions)
- Display input fields based on selected mode
- Validate user inputs
- Trigger calculations when inputs change
- Display calculation results including dimensions, volume, ratios, and frequencies
- Handle error states and display validation messages

**Key State**:
```typescript
- calculationMode: 'internal' | 'external'
- internalWidth: number | null
- internalHeight: number | null
- internalDepth: number | null
- externalWidth: number | null
- externalHeight: number | null
- externalDepth: number | null
- panelThickness: number | null
- results: BoxVolumeResults | null
- errors: ValidationError[]
```

### Calculation Module

**Location**: `src/lib/calculations/box-volume.ts`

**Functions**:

1. `calculateFromInternalDimensions(params: InternalDimensionInput): BoxVolumeResults`
   - Calculates external dimensions from internal dimensions and panel thickness
   - Computes volume and ratios
   - Calculates all standing wave frequencies

2. `calculateFromExternalDimensions(params: ExternalDimensionInput): BoxVolumeResults`
   - Calculates internal dimensions from external dimensions and panel thickness
   - Validates that internal dimensions are positive
   - Computes volume and ratios
   - Calculates all standing wave frequencies

3. `calculateStandingWaveFrequencies(width: number, height: number, depth: number): StandingWaveFrequencies`
   - Calculates axial mode frequencies (orders 1-3) for each axis
   - Calculates composite mode frequencies for specified mode combinations
   - Uses sound speed constant of 343 m/s

4. `calculateDimensionalRatio(width: number, height: number, depth: number): DimensionalRatio`
   - Normalizes dimensions to show proportional relationships
   - Returns ratio object with width, height, and depth proportions

5. `calculateCompositeMode(n: number, m: number, l: number, width: number, height: number, depth: number, soundSpeed: number): number`
   - Calculates frequency for a specific composite mode
   - Implements the formula: f = (c/2) × √[(n/W)² + (m/H)² + (l/D)²]

## Data Models

### Input Types

```typescript
interface InternalDimensionInput {
  internalWidth: number;    // cm
  internalHeight: number;   // cm
  internalDepth: number;    // cm
  panelThickness: number;   // cm
}

interface ExternalDimensionInput {
  externalWidth: number;    // cm
  externalHeight: number;   // cm
  externalDepth: number;    // cm
  panelThickness: number;   // cm
}
```

### Output Types

```typescript
interface BoxDimensions {
  internal: {
    width: number;   // cm
    height: number;  // cm
    depth: number;   // cm
  };
  external: {
    width: number;   // cm
    height: number;  // cm
    depth: number;   // cm
  };
}

interface VolumeData {
  cubicCentimeters: number;
  liters: number;
}

interface DimensionalRatio {
  width: number;
  height: number;
  depth: number;
}

interface AxialModeFrequencies {
  order1: number;  // Hz
  order2: number;  // Hz
  order3: number;  // Hz
}

interface CompositeModeFrequency {
  mode: [number, number, number];  // [n, m, l]
  frequency: number;                // Hz
}

interface StandingWaveFrequencies {
  axial: {
    width: AxialModeFrequencies;
    height: AxialModeFrequencies;
    depth: AxialModeFrequencies;
  };
  composite: CompositeModeFrequency[];
}

interface BoxVolumeResults {
  dimensions: BoxDimensions;
  volume: VolumeData;
  ratios: {
    internal: DimensionalRatio;
    external: DimensionalRatio;
  };
  standingWaves: StandingWaveFrequencies;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: External dimension calculation consistency
*For any* valid internal dimensions and panel thickness, calculating external dimensions and then converting back to internal dimensions should yield the original internal dimensions.
**Validates: Requirements 1.1, 1.2, 1.3**

### Property 2: Internal dimension calculation consistency
*For any* valid external dimensions and panel thickness where panel thickness is less than half of each external dimension, calculating internal dimensions and then converting back to external dimensions should yield the original external dimensions.
**Validates: Requirements 2.1, 2.2, 2.3**

### Property 3: Volume calculation consistency
*For any* set of internal dimensions, the volume in liters should equal the volume in cubic centimeters divided by 1000.
**Validates: Requirements 1.4, 1.5, 2.5**

### Property 4: Dimensional ratio scale invariance
*For any* set of dimensions, multiplying all dimensions by the same positive constant should not change the dimensional ratio.
**Validates: Requirements 3.1, 3.2**

### Property 5: Axial frequency ordering
*For any* valid internal dimensions, the standing wave frequencies for each axis should satisfy: order1 frequency < order2 frequency < order3 frequency.
**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

### Property 6: Composite mode frequency calculation
*For any* composite mode where only one axis has non-zero order (e.g., (n,0,0)), the composite mode frequency should equal the corresponding axial mode frequency.
**Validates: Requirements 5.1, 5.2**

### Property 7: Panel thickness validation
*For any* external dimensions and panel thickness, if panel thickness is greater than or equal to half of any external dimension, the system should reject the input.
**Validates: Requirements 2.4**

### Property 8: Positive dimension validation
*For any* dimension input, if any dimension value is less than or equal to zero, the system should reject the input.
**Validates: Requirements 7.1**

### Property 9: Mode selector state preservation
*For any* panel thickness value, when switching between internal and external calculation modes, the panel thickness value should remain unchanged.
**Validates: Requirements 6.4**

## Error Handling

The calculator will use the existing validation framework to handle errors:

1. **Input Validation Errors**:
   - Non-positive dimensions: "All dimensions must be positive values"
   - Panel thickness too large: "Panel thickness must be less than half of each external dimension"
   - Non-numeric input: "Please enter valid numeric values"

2. **Calculation Errors**:
   - If internal dimensions become negative after subtracting panel thickness: "Invalid configuration: panel thickness is too large for the given external dimensions"

3. **Display**:
   - Errors will be displayed near the relevant input fields
   - Results will not be shown when validation errors exist
   - Error messages will be cleared when inputs are corrected

## Testing Strategy

### Unit Testing

Unit tests will verify:
- Dimension conversion calculations (internal to external, external to internal)
- Volume calculations and unit conversions
- Dimensional ratio calculations
- Individual standing wave frequency calculations
- Composite mode frequency calculations
- Edge cases: minimum valid dimensions, maximum reasonable dimensions
- Error conditions: negative dimensions, excessive panel thickness

### Property-Based Testing

The testing strategy uses fast-check library for property-based testing. Each property-based test will run a minimum of 100 iterations.

Property-based tests will verify the correctness properties defined above:

1. **Property 1 Test**: Round-trip conversion (internal → external → internal)
   - **Feature: box-volume-calculator, Property 1: External dimension calculation consistency**
   - Generate random valid internal dimensions and panel thickness
   - Calculate external dimensions
   - Convert back to internal dimensions
   - Verify original dimensions are recovered (within floating-point tolerance)

2. **Property 2 Test**: Round-trip conversion (external → internal → external)
   - **Feature: box-volume-calculator, Property 2: Internal dimension calculation consistency**
   - Generate random valid external dimensions and panel thickness (ensuring panel thickness < half of each dimension)
   - Calculate internal dimensions
   - Convert back to external dimensions
   - Verify original dimensions are recovered (within floating-point tolerance)

3. **Property 3 Test**: Volume unit conversion consistency
   - **Feature: box-volume-calculator, Property 3: Volume calculation consistency**
   - Generate random valid internal dimensions
   - Calculate volume in both units
   - Verify liters = cubic centimeters / 1000

4. **Property 4 Test**: Dimensional ratio scale invariance
   - **Feature: box-volume-calculator, Property 4: Dimensional ratio scale invariance**
   - Generate random valid dimensions
   - Calculate ratio
   - Scale all dimensions by a random positive constant
   - Calculate ratio again
   - Verify ratios are equal (within floating-point tolerance)

5. **Property 5 Test**: Axial frequency ordering
   - **Feature: box-volume-calculator, Property 5: Axial frequency ordering**
   - Generate random valid internal dimensions
   - Calculate axial frequencies for all axes
   - Verify order1 < order2 < order3 for each axis

6. **Property 6 Test**: Composite mode matches axial mode
   - **Feature: box-volume-calculator, Property 6: Composite mode frequency calculation**
   - Generate random valid internal dimensions
   - Calculate axial mode frequencies
   - Calculate composite modes (1,0,0), (0,1,0), (0,0,1)
   - Verify composite modes match corresponding axial order1 frequencies

7. **Property 7 Test**: Panel thickness validation
   - **Feature: box-volume-calculator, Property 7: Panel thickness validation**
   - Generate random external dimensions
   - Generate panel thickness >= half of smallest dimension
   - Verify calculation function throws error or returns error state

8. **Property 8 Test**: Positive dimension validation
   - **Feature: box-volume-calculator, Property 8: Positive dimension validation**
   - Generate random dimensions with at least one non-positive value
   - Verify calculation function throws error or returns error state

9. **Property 9 Test**: Panel thickness preservation across mode changes
   - **Feature: box-volume-calculator, Property 9: Mode selector state preservation**
   - Generate random panel thickness value
   - Simulate mode change from internal to external
   - Verify panel thickness value is preserved
   - Simulate mode change from external to internal
   - Verify panel thickness value is preserved

### Integration Testing

Integration tests will verify:
- Complete user workflow: input → calculation → display
- Mode switching behavior
- Error message display
- Result formatting (decimal places, units)
- Integration with main application navigation

## UI Design Considerations

The calculator page will follow the existing design patterns:

1. **Layout**: Two-column layout with inputs on the left and results on the right
2. **Mode Selector**: Radio buttons or tabs at the top to switch between internal and external dimension modes
3. **Input Fields**: Labeled numeric input fields with unit indicators (cm)
4. **Results Display**: Organized sections for:
   - Dimensions (internal and external)
   - Volume (cm³ and liters)
   - Dimensional ratios
   - Basic mode frequencies (table format)
   - Composite mode frequencies (scrollable table)
5. **Frequency Display**: Formatted to 1 decimal place with Hz unit
6. **Responsive Design**: Mobile-friendly layout that stacks on smaller screens

## Implementation Notes

1. **Sound Speed Constant**: Use 343 m/s as the default sound speed value (20°C air)
2. **Unit Conversions**: All calculations internally use meters for frequency calculations, but display uses centimeters for dimensions
3. **Floating Point Precision**: Use appropriate tolerance (e.g., 0.001) for equality comparisons in tests
4. **Composite Mode List**: The 29 composite modes should be calculated in a specific order as listed in requirements
5. **Performance**: All calculations are synchronous and fast; no need for async operations
6. **Accessibility**: Ensure all input fields have proper labels and ARIA attributes
