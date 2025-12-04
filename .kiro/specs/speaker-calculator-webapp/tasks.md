# Implementation Plan

- [x] 1. Set up project structure and development environment





  - Initialize Vite + React + TypeScript project
  - Configure Tailwind CSS
  - Set up testing framework (Vitest + React Testing Library)
  - Install fast-check for property-based testing
  - Create directory structure (components, lib, hooks)
  - _Requirements: 7.1, 7.5_

- [x] 2. Implement core calculation library for TS Parameters






  - [x] 2.1 Create TypeScript type definitions for TS parameter inputs and outputs

    - Define TSParameters interface
    - Define TSResults interface
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_


  - [x] 2.2 Implement F0 calculation function

    - Write calculateF0(mms: number, kms: number) function
    - Handle unit conversions (g→kg, N/mm→N/m)
    - _Requirements: 1.1_


  - [x] 2.3 Write property test for F0 calculation

    - **Property 1: F0 calculation correctness**
    - **Validates: Requirements 1.1**

  - [x] 2.4 Implement Vas calculation function


    - Write calculateVas(airDensity, effectiveRadius, kms) function
    - Use speed of sound constant (346.1 m/s)
    - _Requirements: 1.2_


  - [x] 2.5 Write property test for Vas calculation

    - **Property 2: Vas calculation correctness**
    - **Validates: Requirements 1.2**

  - [x] 2.6 Implement Qes calculation function


    - Write calculateQes(f0, re, mms, bl) function
    - _Requirements: 1.3_


  - [x] 2.7 Write property test for Qes calculation

    - **Property 3: Qes calculation correctness**
    - **Validates: Requirements 1.3**

  - [x] 2.8 Implement air load mass calculation function


    - Write calculateAirLoadMass(effectiveRadius, airDensity) function
    - Return both free space and infinite baffle values
    - _Requirements: 1.4_

  - [x] 2.9 Write property test for air load mass calculation


    - **Property 4: Air load mass calculation correctness**
    - **Validates: Requirements 1.4**

  - [x] 2.10 Implement input voltage calculation function


    - Write calculateInputVoltage(re, power) function
    - _Requirements: 1.5_

  - [x] 2.11 Write property test for input voltage calculation


    - **Property 5: Input voltage calculation correctness**
    - **Validates: Requirements 1.5**

- [x] 3. Implement core calculation library for SPL





  - [x] 3.1 Create TypeScript type definitions for SPL inputs and outputs


    - Define SPLInputs interface
    - Define SPLResult interface
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 3.2 Implement Qts calculation function


    - Write calculateQts(f0, mms, bl, re, rms) function
    - _Requirements: 2.4_

  - [x] 3.3 Write property test for Qts calculation


    - **Property 8: Qts calculation correctness**
    - **Validates: Requirements 2.4**

  - [x] 3.4 Implement sound pressure calculation function


    - Write calculateSoundPressure(inputs: SPLInputs) function
    - Calculate P0 and x values
    - Apply SPL formula
    - _Requirements: 2.1_

  - [x] 3.5 Write property test for sound pressure calculation


    - **Property 6: Sound pressure calculation correctness**
    - **Validates: Requirements 2.1**

  - [x] 3.6 Implement dB SPL conversion function


    - Write convertToDBSPL(pressure: number) function
    - Use reference pressure 2×10⁻⁵ Pa
    - _Requirements: 2.2_

  - [x] 3.7 Write property test for dB SPL conversion


    - **Property 7: SPL dB conversion correctness**
    - **Validates: Requirements 2.2**

  - [x] 3.8 Implement frequency response calculation function


    - Write calculateFrequencyResponse(inputs: SPLInputs) function
    - Generate results for standard frequencies (16Hz to 10kHz)
    - Return both pressure and dB values for each frequency
    - _Requirements: 2.3, 2.5_

  - [x] 3.9 Write property test for frequency response completeness


    - **Property 9: Frequency response completeness**
    - **Validates: Requirements 2.5**
- [x] 4. Implement core calculation library for Crossover Network



- [ ] 4. Implement core calculation library for Crossover Network

  - [x] 4.1 Create TypeScript type definitions for crossover inputs and outputs


    - Define CrossoverInputs interface
    - Define CrossoverComponent interface
    - Define CrossoverResults interface with nested structure
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [x] 4.2 Implement crossover component calculation functions


    - Write calculateCapacitor(k, z, fc) function
    - Write calculateInductor(k, z, fc) function
    - _Requirements: 5.1, 5.3_

  - [x] 4.3 Implement filter coefficient lookup


    - Create coefficient tables for all filter types and orders
    - Butterworth, Linkwitz-Riley, Bessel, Chebychev, Legendre, Gaussian, Linear-Phase
    - 1st through 4th order
    - _Requirements: 5.2_

  - [x] 4.4 Implement crossover network calculation function


    - Write calculateCrossoverNetwork(inputs: CrossoverInputs) function
    - Calculate all filter types and orders
    - Organize results by filter type and order
    - _Requirements: 5.1, 5.2, 5.5_

  - [x] 4.5 Write property test for crossover network completeness


    - **Property 14: Crossover network completeness**
    - **Validates: Requirements 5.1, 5.2**

- [x] 5. Implement input validation and unit conversion utilities





  - [x] 5.1 Create validation functions


    - Write isNumeric(value: string) function
    - Write isInRange(value: number, min: number, max: number) function
    - Write getValidationError(value, fieldName, min, max) function
    - _Requirements: 6.2, 6.5_

  - [x] 5.2 Write property test for numeric validation


    - **Property 15: Numeric validation and error reporting**
    - **Validates: Requirements 6.2, 6.5**

  - [x] 5.3 Create unit conversion functions


    - Write gramsToKilograms(g: number) function
    - Write kilogramsToGrams(kg: number) function
    - Write millimetersToMeters(mm: number) function
    - Write metersToMillimeters(m: number) function
    - _Requirements: 6.3_

  - [x] 5.4 Write property test for unit conversion round-trip


    - **Property 16: Unit conversion round-trip consistency**
    - **Validates: Requirements 6.3**

- [x] 6. Create common UI components




  - [x] 6.1 Implement InputField component


    - Accept label, value, unit, onChange, error props
    - Display unit label next to input
    - Show error message when validation fails
    - Apply appropriate styling
    - _Requirements: 6.1, 6.4, 6.5_

  - [x] 6.2 Implement ResultDisplay component


    - Accept label, value, unit props
    - Display calculated result with unit
    - Handle undefined/null values gracefully
    - _Requirements: 6.4_

  - [x] 6.3 Implement FormulaDisplay component


    - Accept formula string and variable definitions
    - Display mathematical expression
    - Show expandable variable definitions
    - _Requirements: 10.1, 10.2_

  - [x] 6.4 Implement HelpTooltip component


    - Accept help text content
    - Display tooltip on hover/click
    - Accessible keyboard navigation
    - _Requirements: 10.3, 10.4, 10.5_

- [x] 7. Implement TS Parameter Calculator component




  - [x] 7.1 Create TSParameterCalculator component


    - Set up component state for all inputs
    - Render InputField components for Mms, Kms, Bl, Re, effective radius, air density, power
    - Display unit labels for each input
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.1_

  - [x] 7.2 Implement reactive calculation logic


    - Use useEffect to trigger recalculation on input changes
    - Call calculation functions from lib/calculations
    - Update result state
    - _Requirements: 9.1, 9.2_

  - [x] 7.3 Write property test for reactive updates


    - **Property 18: Reactive calculation updates**
    - **Validates: Requirements 9.2**

  - [x] 7.4 Implement partial input handling


    - Check which inputs are available
    - Calculate only results that have sufficient inputs
    - Hide results that cannot be calculated
    - _Requirements: 9.3_

  - [x] 7.5 Write property test for partial input handling


    - **Property 19: Partial input handling**
    - **Validates: Requirements 9.3**

  - [x] 7.6 Implement complete input handling

    - When all required inputs are provided, display all results
    - _Requirements: 9.4_

  - [x] 7.7 Write property test for complete input handling


    - **Property 20: Complete input handling**
    - **Validates: Requirements 9.4**

  - [x] 7.8 Implement input clearing behavior

    - When an input is cleared, remove dependent results
    - _Requirements: 9.5_

  - [x] 7.9 Write property test for input clearing


    - **Property 21: Input clearing cascades to outputs**
    - **Validates: Requirements 9.5**

  - [x] 7.10 Add formula display and help information


    - Add FormulaDisplay components for each calculation
    - Add HelpTooltip components for parameters
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 8. Implement SPL Calculator component





  - [x] 8.1 Create SPLCalculator component


    - Set up component state for all SPL inputs
    - Render InputField components for all parameters
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 8.2 Implement frequency response table display


    - Create table component for frequency response results
    - Display frequency, pressure, and dB columns
    - _Requirements: 2.3, 2.5_

  - [x] 8.3 Implement reactive calculation for SPL

    - Trigger recalculation on input changes
    - Update frequency response table
    - _Requirements: 9.2_

  - [x] 8.4 Add formula display and help information

    - Add FormulaDisplay for SPL calculations
    - Add HelpTooltip for parameters
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 9. Implement Crossover Network Calculator component




  - [x] 9.1 Create CrossoverNetworkCalculator component


    - Set up component state for crossover inputs
    - Render InputField components for woofer/tweeter impedance, cutoff frequency, SPL values
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 9.2 Implement crossover results display

    - Create organized display by filter type and order
    - Show capacitor and inductor values with units
    - Group woofer and tweeter components
    - _Requirements: 5.3, 5.5_

  - [x] 9.3 Implement reactive calculation for crossover

    - Trigger recalculation on input changes
    - Update all filter type/order combinations
    - _Requirements: 9.2_

  - [x] 9.4 Add formula display and help information

    - Add FormulaDisplay for crossover calculations
    - Add HelpTooltip for filter types and parameters
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 10. Implement navigation and layout





  - [x] 10.1 Create NavigationMenu component


    - Display list of all calculators
    - Highlight currently active calculator
    - Handle calculator selection
    - _Requirements: 8.1, 8.4, 8.5_

  - [x] 10.2 Create Layout component


    - Implement responsive layout with navigation sidebar
    - Render active calculator in main content area
    - Apply consistent styling
    - _Requirements: 7.2, 7.3, 8.4_

  - [x] 10.3 Implement routing with React Router


    - Set up routes for each calculator
    - Handle navigation between calculators
    - _Requirements: 8.2_

  - [x] 10.4 Implement state persistence across navigation


    - Use React Context or local storage to preserve calculator state
    - Restore state when returning to a calculator
    - _Requirements: 8.3_

  - [x] 10.5 Write property test for state persistence


    - **Property 17: Calculator state persistence across navigation**
    - **Validates: Requirements 8.3**

- [x] 11. Implement responsive design and accessibility





  - [x] 11.1 Apply responsive Tailwind CSS classes


    - Mobile-first design approach
    - Breakpoints for tablet and desktop
    - _Requirements: 7.2, 7.3_

  - [x] 11.2 Implement accessibility features


    - Add ARIA labels to all inputs
    - Ensure keyboard navigation works
    - Add focus indicators
    - Ensure color contrast meets WCAG AA
    - _Requirements: Accessibility section_

- [x] 12. Final integration and testing




  - [x] 12.1 Integrate all calculator components into App


    - Wire up routing
    - Connect navigation menu
    - Test navigation flow
    - _Requirements: 7.1, 8.1, 8.2_

  - [x] 12.2 Run all property-based tests


    - Verify all 21 properties pass with 100+ iterations
    - Fix any failing tests
    - _Requirements: All correctness properties_

  - [x] 12.3 Run integration tests


    - Test complete user workflows
    - Verify state management across navigation
    - Test responsive behavior
    - _Requirements: 7.2, 7.3, 8.3, 9.2_

  - [x] 12.4 Build production bundle


    - Run Vite build
    - Verify bundle size is reasonable
    - Test production build locally
    - _Requirements: 7.5_
-

- [x] 13. Checkpoint - Ensure all tests pass



  - Ensure all tests pass, ask the user if questions arise.
