# Design Document

## Overview

スピーカー計算WEBアプリケーションは、クライアントサイドで動作するシングルページアプリケーション（SPA）として実装する。React + TypeScriptをベースとし、数値計算の正確性を重視した設計とする。全ての計算はブラウザ内で実行され、サーバーサイド処理は不要である。

## Architecture

### Technology Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API + useReducer
- **Routing**: React Router v6
- **Testing**: Vitest + React Testing Library
- **Property-Based Testing**: fast-check

### Application Structure

```
src/
├── components/
│   ├── common/          # 共通UIコンポーネント
│   ├── calculators/     # 各計算機コンポーネント
│   └── layout/          # レイアウトコンポーネント
├── lib/
│   ├── calculations/    # 計算ロジック
│   ├── validation/      # 入力検証
│   └── types/          # TypeScript型定義
├── hooks/              # カスタムフック
└── App.tsx             # アプリケーションルート
```

## Components and Interfaces

### Calculator Modules

各計算機は独立したモジュールとして実装する：

1. **TSParameterCalculator** - TSパラメータ計算
2. **SPLCalculator** - 音圧レベル計算
3. **CrossoverNetworkCalculator** - クロスオーバーネットワーク計算

### Common Components

- **InputField**: 単位付き数値入力フィールド
- **ResultDisplay**: 計算結果表示
- **FormulaDisplay**: 数式表示
- **NavigationMenu**: 計算機選択メニュー
- **HelpTooltip**: ヘルプ情報表示

## Data Models

### Input Parameter Types

```typescript
interface TSParameters {
  mms: number;        // g
  kms: number;        // N/mm
  bl: number;         // N/A
  re: number;         // Ohm
  sd: number;         // cm²
  rms?: number;       // kg/s
}

interface SPLInputs {
  airDensity: number;      // kg/m³
  effectiveRadius: number; // mm
  mms: number;            // g
  f0: number;             // Hz
  re: number;             // Ohm
  micDistance: number;    // m
  inputVoltage: number;   // V
  rms: number;            // kg/s
  bl: number;             // N/A
  frequency: number;      // Hz
}

interface SpiderData {
  materialName: string;
  youngsModulus: number;  // MPa
  poissonRatio: number;
  loadValues: number[];   // mN
  displacements: number[]; // mm
}

interface CrossoverInputs {
  wooferImpedance: number;  // Ohm
  tweeterImpedance: number; // Ohm
  cutoffFrequency: number;  // Hz
  wooferSPL: number;       // dB
  tweeterSPL: number;      // dB
}
```

### Calculation Result Types

```typescript
interface TSResults {
  f0: number;              // Hz
  vas: number;             // L
  qes: number;
  qts: number;
  airLoadMassFree: number; // g
  airLoadMassBaffle: number; // g
  inputVoltage: number;    // V
}

interface SPLResult {
  frequency: number;  // Hz
  pressure: number;   // Pa
  spl: number;       // dB
}

interface SpiderResult {
  step: number;
  upLoad: number;      // mN
  upDisplacement: number; // mm
  downLoad: number;    // mN
  downDisplacement: number; // mm
  upKms: number;       // N/mm
  downKms: number;     // N/mm
  kmsDifference: number;
  deviation133: number;
}

interface CrossoverComponent {
  capacitors: number[];  // μF
  inductors: number[];   // mH
}

interface CrossoverResults {
  [filterType: string]: {
    [order: string]: {
      woofer: CrossoverComponent;
      tweeter: CrossoverComponent;
    }
  }
}
```

## 
## Cal
culation Formulas

### TS Parameter Calculations

#### F0 (Resonance Frequency)
```
F0 = sqrt(Kms / Mms) / (2 * π)
```
Where:
- Kms: mechanical stiffness (N/m, converted from N/mm)
- Mms: moving mass (kg, converted from g)

#### Vas (Equivalent Compliance Volume)
```
Vas = ρ * c² * (π * a²)² / Kms * 1000
```
Where:
- ρ: air density (kg/m³)
- c: speed of sound (m/s)
- a: effective radius (m, converted from mm)
- Kms: mechanical stiffness (N/m)

#### Qes (Electrical Q Factor)
```
Qes = 2 * π * F0 * Re * Mms / Bl²
```
Where:
- F0: resonance frequency (Hz)
- Re: DC resistance (Ohm)
- Mms: moving mass (kg)
- Bl: force factor (N/A)

#### Qts (Total Q Factor)
```
Qts = 2 * π * F0 * Mms / (Bl² / Re + Rms)
```
Where:
- Rms: mechanical resistance (kg/s)

#### Air Load Mass
Free space:
```
MairFree = (8/3) * ρ * a³ * 1000
```

Infinite baffle:
```
MairBaffle = (16/3) * ρ * a³ * 1000
```

#### Input Voltage
```
V = sqrt(Re * P)
```
Where:
- P: power (W)

### SPL Calculation

#### Sound Pressure
```
x = f / f0
P = P0 * x / sqrt(1/Qts² + (x - 1/x)²)
```
Where:
```
P0 = ρ * Sd² * V * Bl / (2 * r * Mms * Re)
```
- f: frequency (Hz)
- f0: resonance frequency (Hz)
- Qts: total Q factor
- ρ: air density (kg/m³)
- Sd: effective area (m²)
- V: input voltage (V)
- Bl: force factor (N/A)
- r: microphone distance (m)
- Mms: moving mass (kg)
- Re: DC resistance (Ohm)

#### SPL in dB
```
SPL = 20 * log10(P / Pref)
```
Where:
- Pref = 2 × 10⁻⁵ Pa (reference pressure)

### Spider Analysis

#### Kms Calculation
```
Kms = Load / Displacement
```
Where:
- Load: force in N (converted from mN)
- Displacement: displacement in m (converted from mm)

#### Linearity Metrics
```
Deviation133 = |Kms_initial * 1.33 - Kms_current|
KmsDifference = Kms_up - Kms_down
```

### Crossover Network Calculations

General formula for capacitor:
```
C = K / (Z * fc) * 10⁶  [μF]
```

General formula for inductor:
```
L = K * Z / fc * 10³  [mH]
```

Where:
- K: coefficient depending on filter type and order
- Z: impedance (Ohm)
- fc: cutoff frequency (Hz)

#### Filter Coefficients

**First Order Butterworth:**
- Woofer: C1 = 1/(2πZfc)
- Tweeter: L1 = Z/(2πfc)

**Second Order Linkwitz-Riley:**
- Woofer: C1 = 0.0796/(Zfc), L1 = 0.3183Z/fc
- Tweeter: C2 = 0.0796/(Zfc), L2 = 0.3183Z/fc

**Second Order Butterworth:**
- Woofer: C1 = 0.1125/(Zfc), L1 = 0.2251Z/fc
- Tweeter: C2 = 0.1125/(Zfc), L2 = 0.2251Z/fc

**Second Order Bessel:**
- Woofer: C1 = 0.0912/(Zfc), L1 = 0.2756Z/fc
- Tweeter: C2 = 0.0912/(Zfc), L2 = 0.2756Z/fc

**Second Order Chebychev:**
- Woofer: C1 = 0.1592/(Zfc), L1 = 0.1592Z/fc
- Tweeter: C2 = 0.1592/(Zfc), L2 = 0.1592Z/fc

**Third Order Butterworth:**
- Woofer: C1 = 0.1061/(Zfc), C2 = 0.3183/(Zfc), L1 = 0.1194Z/fc
- Tweeter: C3 = 0.2122/(Zfc), L2 = 0.2387Z/fc, L3 = 0.0796Z/fc

**Fourth Order Linkwitz-Riley:**
- Woofer: C1 = 0.0844/(Zfc), C2 = 0.1688/(Zfc), L1 = 0.1Z/fc, L2 = 0.4501Z/fc
- Tweeter: C3 = 0.2533/(Zfc), C4 = 0.0563/(Zfc), L3 = 0.3Z/fc, L4 = 0.15Z/fc

**Fourth Order Bessel:**
- Woofer: C1 = 0.0702/(Zfc), C2 = 0.0719/(Zfc), L1 = 0.862Z/fc, L2 = 0.4983Z/fc
- Tweeter: C3 = 0.2336/(Zfc), C4 = 0.0504/(Zfc), L3 = 0.3583Z/fc, L4 = 0.1463Z/fc

**Fourth Order Butterworth:**
- Woofer: C1 = 0.104/(Zfc), C2 = 0.147/(Zfc), L1 = 0.1009Z/fc, L2 = 0.4159Z/fc
- Tweeter: C3 = 0.2509/(Zfc), C4 = 0.0609/(Zfc), L3 = 0.2437Z/fc, L4 = 0.1723Z/fc

**Fourth Order Legendre:**
- Woofer: C1 = 0.1104/(Zfc), C2 = 0.1246/(Zfc), L1 = 0.1073Z/fc, L2 = 0.2783Z/fc
- Tweeter: C3 = 0.2365/(Zfc), C4 = 0.091/(Zfc), L3 = 0.2294Z/fc, L4 = 0.2034Z/fc

**Fourth Order Gaussian:**
- Woofer: C1 = 0.0767/(Zfc), C2 = 0.1491/(Zfc), L1 = 0.1116Z/fc, L2 = 0.3251Z/fc
- Tweeter: C3 = 0.2235/(Zfc), C4 = 0.0768/(Zfc), L3 = 0.3253Z/fc, L4 = 0.1674Z/fc

**Fourth Order Linear-Phase:**
- Woofer: C1 = 0.0741/(Zfc), C2 = 0.1524/(Zfc), L1 = 0.1079Z/fc, L2 = 0.3853Z/fc
- Tweeter: C3 = 0.2255/(Zfc), C4 = 0.0632/(Zfc), L3 = 0.3285Z/fc, L4 = 0.1674Z/fc


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Calculation Accuracy Properties

Property 1: F0 calculation correctness
*For any* valid Mms (in grams) and Kms (in N/mm), when calculating F0, the result should equal sqrt((Kms*1000)/(Mms/1000))/(2*π) within floating-point precision tolerance
**Validates: Requirements 1.1**

Property 2: Vas calculation correctness
*For any* valid air density (kg/m³), effective radius (mm), and Kms (N/mm), when calculating Vas, the result should follow the formula: ρ * c² * (π * (radius/1000)²)² / (Kms*1000) * 1000, where c = 346.1 m/s
**Validates: Requirements 1.2**

Property 3: Qes calculation correctness
*For any* valid F0 (Hz), DC resistance (Ohm), Mms (g), and Bl (N/A), when calculating Qes, the result should equal 2 * π * F0 * Re * (Mms/1000) / (Bl²) within floating-point precision tolerance
**Validates: Requirements 1.3**

Property 4: Air load mass calculation correctness
*For any* valid effective radius (mm) and air density (kg/m³), the system should calculate both free space air load mass as (8/3) * ρ * (radius/1000)³ * 1000 and infinite baffle air load mass as (16/3) * ρ * (radius/1000)³ * 1000
**Validates: Requirements 1.4**

Property 5: Input voltage calculation correctness
*For any* valid DC resistance (Ohm) and power (W), when calculating input voltage, the result should equal sqrt(Re * P) within floating-point precision tolerance
**Validates: Requirements 1.5**

Property 6: Sound pressure calculation correctness
*For any* valid SPL input parameters (air density, effective radius, Mms, F0, DC resistance, microphone distance, input voltage, Rms, Bl, frequency), the calculated sound pressure should follow the formula: P = P0 * x / sqrt(1/Qts² + (x - 1/x)²), where x = f/f0 and P0 = ρ * Sd² * V * Bl / (2 * r * Mms * Re)
**Validates: Requirements 2.1**

Property 7: SPL dB conversion correctness
*For any* positive sound pressure value P (Pa), when converting to dB SPL, the result should equal 20 * log10(P / (2×10⁻⁵)) within floating-point precision tolerance
**Validates: Requirements 2.2**

Property 8: Qts calculation correctness
*For any* valid F0, Mms, Bl, Re, and Rms values, when calculating Qts, the result should equal 2 * π * F0 * (Mms/1000) / ((Bl² / Re) + Rms) within floating-point precision tolerance
**Validates: Requirements 2.4**

Property 9: Frequency response completeness
*For any* valid SPL input parameters, when calculating frequency response, the output should include both pressure (Pa) and SPL (dB) values for each frequency
**Validates: Requirements 2.5**

Property 10: Spider Kms calculation correctness
*For any* valid load value (mN) and displacement value (mm), when calculating Kms, the result should equal (Load/1000) / (Displacement/1000) = Load / Displacement in N/mm
**Validates: Requirements 3.2**

Property 11: Spider Kms difference calculation
*For any* two Kms values (upward and downward), the system should calculate their difference as Kms_up - Kms_down
**Validates: Requirements 3.3**

Property 12: Spider deviation calculation correctness
*For any* sequence of Kms values with an initial value Kms_initial, for each subsequent Kms_current, the deviation should equal |Kms_initial * 1.33 - Kms_current|
**Validates: Requirements 3.4**

Property 13: Magnetic circuit Bl calculation produces numeric output
*For any* valid magnetic circuit geometry parameters, the Bl calculation should produce a finite numeric value
**Validates: Requirements 4.2**

Property 14: Crossover network completeness
*For any* valid woofer impedance, tweeter impedance, and cutoff frequency, the system should calculate component values for all combinations of filter orders (1st through 4th) and filter types (Butterworth, Linkwitz-Riley, Bessel, Chebychev, Legendre, Gaussian, Linear-Phase) where applicable
**Validates: Requirements 5.1, 5.2**

### Input Validation Properties

Property 15: Numeric validation and error reporting
*For any* input field, when a non-numeric value or a value outside the valid range is entered, the system should reject the input and display an error message indicating the expected format and range
**Validates: Requirements 6.2, 6.5**

Property 16: Unit conversion round-trip consistency
*For any* valid numeric value, converting from one unit to another and back (e.g., grams → kilograms → grams, or millimeters → meters → millimeters) should return a value equal to the original within floating-point precision tolerance
**Validates: Requirements 6.3**

### State Management Properties

Property 17: Calculator state persistence across navigation
*For any* sequence of calculator selections and input entries, when navigating away from a calculator and returning to it, all previously entered values should be preserved
**Validates: Requirements 8.3**

Property 18: Reactive calculation updates
*For any* input parameter change, all output fields that depend on that parameter should be recalculated and updated
**Validates: Requirements 9.2**

Property 19: Partial input handling
*For any* incomplete set of input parameters, the system should display only those results that can be calculated with the available inputs, and should not display results that require missing parameters
**Validates: Requirements 9.3**

Property 20: Complete input handling
*For any* complete set of required input parameters, the system should display all calculable results for that calculator
**Validates: Requirements 9.4**

Property 21: Input clearing cascades to outputs
*For any* input field, when its value is cleared or removed, all output fields that depend on that input should also be cleared
**Validates: Requirements 9.5**


## Error Handling

### Input Validation Errors

- **Non-numeric Input**: Display error message "Please enter a valid number"
- **Out of Range**: Display error message "Value must be between {min} and {max}"
- **Required Field Empty**: Disable dependent calculations and clear dependent outputs
- **Division by Zero**: Prevent calculation and display "Cannot calculate: denominator is zero"

### Calculation Errors

- **Invalid Mathematical Operation**: Catch exceptions (e.g., sqrt of negative number) and display "Cannot calculate: invalid input values"
- **Overflow/Underflow**: Detect extreme values and display "Result is out of calculable range"
- **NaN/Infinity Results**: Display "Calculation error: please check input values"

### Error Recovery

- Errors should be displayed inline near the affected input field
- Errors should clear automatically when the user corrects the input
- The application should never crash due to calculation errors
- Invalid inputs should not propagate to other calculations

## Testing Strategy

### Unit Testing

Unit tests will verify:
- Individual calculation functions with known input/output pairs
- Edge cases (zero values, very large/small numbers, boundary conditions)
- Unit conversion functions
- Input validation logic
- Error handling for invalid inputs

Example unit tests:
- F0 calculation with Mms=1.261g, Kms=1.08 N/mm should return approximately 147.2 Hz
- Vas calculation with known parameters should match expected value
- Invalid inputs (negative values, non-numbers) should be rejected
- Unit conversions (g↔kg, mm↔m) should be accurate

### Property-Based Testing

Property-based tests will use the **fast-check** library for JavaScript/TypeScript. Each test will run a minimum of 100 iterations with randomly generated inputs.

Each property-based test MUST be tagged with a comment explicitly referencing the correctness property in this design document using the format: `**Feature: speaker-calculator-webapp, Property {number}: {property_text}**`

Property tests will verify:

1. **Calculation Formula Properties** (Properties 1-14):
   - Generate random valid inputs within reasonable ranges
   - Verify calculation results match the specified formulas
   - Check for numerical stability and precision

2. **Validation Properties** (Property 15-16):
   - Generate random invalid inputs (non-numeric, out of range)
   - Verify error messages are displayed
   - Test round-trip unit conversions with random values

3. **State Management Properties** (Properties 17-21):
   - Generate random sequences of user interactions
   - Verify state persistence, reactivity, and clearing behavior

### Test Configuration

```typescript
// fast-check configuration
const fcConfig = {
  numRuns: 100,  // Minimum 100 iterations per property test
  verbose: true,
  seed: Date.now()
};

// Example property test structure
test('Property 1: F0 calculation correctness', () => {
  fc.assert(
    fc.property(
      fc.float({ min: 0.1, max: 100 }), // Mms in grams
      fc.float({ min: 0.1, max: 10 }),  // Kms in N/mm
      (mms, kms) => {
        const result = calculateF0(mms, kms);
        const expected = Math.sqrt((kms * 1000) / (mms / 1000)) / (2 * Math.PI);
        return Math.abs(result - expected) < 0.001; // tolerance
      }
    ),
    fcConfig
  );
});
```

### Integration Testing

Integration tests will verify:
- Navigation between calculators preserves state
- Input changes trigger appropriate recalculations
- UI components render correctly with calculated values
- Responsive layout adapts to different screen sizes

### Test Coverage Goals

- Unit test coverage: >90% for calculation functions
- Property test coverage: All 21 correctness properties must have corresponding property-based tests
- Integration test coverage: All user workflows (navigation, input, calculation, display)

## Performance Considerations

### Calculation Performance

- All calculations should complete in <10ms on modern hardware
- Debounce input changes by 300ms to avoid excessive recalculation
- Use memoization for expensive calculations that depend on multiple inputs

### Rendering Performance

- Use React.memo for calculator components to prevent unnecessary re-renders
- Virtualize large result tables (e.g., frequency response with many data points)
- Lazy load calculator modules to reduce initial bundle size

### Memory Management

- Clear calculation results when navigating away from a calculator (optional, based on memory constraints)
- Limit history/undo functionality to last 10 states per calculator
- Use efficient data structures for large datasets (e.g., typed arrays for frequency response data)

## Accessibility

- All input fields must have associated labels
- Error messages must be announced to screen readers
- Keyboard navigation must be fully supported
- Color contrast must meet WCAG AA standards
- Focus indicators must be clearly visible

## Deployment

The application will be deployed as a static website:
- Build output: Static HTML, CSS, and JavaScript files
- Hosting: Any static file hosting service (Netlify, Vercel, GitHub Pages, etc.)
- No server-side requirements
- No database requirements
- All calculations performed client-side

## Future Enhancements

Potential future features (not in current scope):
- Save/load calculation presets
- Export results to PDF or CSV
- Graphical visualization of frequency response curves
- Multi-language support (currently Japanese/English)
- Dark mode theme
- Comparison mode (compare multiple calculations side-by-side)
