# Requirements Document

## Introduction

本システムは、スピーカーおよびヘッドホン設計において必要となる各種計算を実行するWEBアプリケーションである。既存のExcelベースの計算シートをWEB化し、設計者が場所やデバイスを問わずアクセス可能な計算ツールを提供する。

## Glossary

- **System**: スピーカー計算WEBアプリケーション
- **User**: スピーカーまたはヘッドホンの設計者
- **TS Parameters**: Thiele-Smallパラメータ。スピーカーの電気音響特性を表す基本パラメータ群
- **F0**: 共振周波数（Resonance Frequency）
- **Mms**: 振動系の質量（Moving Mass）
- **Kms**: 機械的スティフネス（Mechanical Stiffness）
- **Vas**: 等価コンプライアンス容積（Equivalent Compliance Volume）
- **Qes**: 電気的Q値（Electrical Q Factor）
- **Qts**: 総合Q値（Total Q Factor）
- **Bl**: 力係数（Force Factor）
- **SPL**: 音圧レベル（Sound Pressure Level）
- **Crossover Network**: クロスオーバーネットワーク。周波数帯域を分割するフィルター回路
- **Spider**: スパイダー（ダンパー）。スピーカーの振動板を支持する部品

## Requirements

### Requirement 1

**User Story:** As a User, I want to calculate TS parameters from basic measurements, so that I can characterize speaker performance.

#### Acceptance Criteria

1. WHEN a User inputs Mms in grams and Kms in N/mm THEN the System SHALL calculate F0 in Hz using the formula F0 = sqrt(Kms/Mms)/(2π)
2. WHEN a User inputs air density, effective radius, and Kms THEN the System SHALL calculate Vas in liters
3. WHEN a User inputs F0, DC resistance, Mms, and Bl THEN the System SHALL calculate Qes
4. WHEN a User inputs effective radius THEN the System SHALL calculate air load mass for both free space and infinite baffle conditions
5. WHEN a User inputs DC resistance and power in watts THEN the System SHALL calculate input voltage in volts

### Requirement 2

**User Story:** As a User, I want to calculate low frequency sound pressure response, so that I can predict speaker performance at various frequencies.

#### Acceptance Criteria

1. WHEN a User inputs air density, effective radius, Mms, F0, DC resistance, microphone distance, input voltage, Rms, Bl, and target frequency THEN the System SHALL calculate sound pressure in Pascals
2. WHEN the System calculates sound pressure THEN the System SHALL convert the pressure to dB SPL using 20*log10(P/2×10^-5)
3. WHEN a User requests frequency response THEN the System SHALL calculate SPL for standard frequencies from 16Hz to 10kHz
4. WHEN a User inputs parameters THEN the System SHALL calculate Qts from the formula Qts = 2πF0Mms/(Bl²/Re + Rms)
5. WHEN the System displays frequency response THEN the System SHALL show both pressure values and dB values

### Requirement 3

**User Story:** As a User, I want to analyze spider mechanical characteristics, so that I can evaluate suspension stiffness and linearity.

#### Acceptance Criteria

1. WHEN a User inputs material properties including Young's modulus and Poisson's ratio THEN the System SHALL accept these values for spider analysis
2. WHEN a User inputs load values in mN and corresponding displacement values in mm THEN the System SHALL calculate Kms in N/mm for both upward and downward motion
3. WHEN the System calculates Kms THEN the System SHALL compute the difference between upward and downward Kms values
4. WHEN a User analyzes spider data THEN the System SHALL calculate deviation from 133% of initial Kms value
5. WHEN the System displays spider analysis results THEN the System SHALL show load, displacement, Kms, and linearity metrics in tabular format

### Requirement 4

**User Story:** As a User, I want to calculate magnetic circuit parameters, so that I can design the motor structure and predict Bl values.

#### Acceptance Criteria

1. WHEN a User accesses the magnetic circuit calculator THEN the System SHALL provide input fields for magnetic circuit geometry
2. WHEN a User inputs magnetic circuit parameters THEN the System SHALL calculate Bl values for two-layer voice coil configurations
3. WHEN the System calculates magnetic circuit properties THEN the System SHALL display results with appropriate units
4. WHEN a User modifies magnetic circuit parameters THEN the System SHALL recalculate Bl values immediately

### Requirement 5

**User Story:** As a User, I want to calculate crossover network component values, so that I can design frequency-dividing filters for multi-way speaker systems.

#### Acceptance Criteria

1. WHEN a User inputs woofer impedance, tweeter impedance, and desired cutoff frequency THEN the System SHALL calculate component values for first through fourth order filters
2. WHEN a User selects a filter type THEN the System SHALL provide calculations for Butterworth, Linkwitz-Riley, Bessel, Chebychev, Legendre, Gaussian, and Linear-Phase characteristics
3. WHEN the System calculates crossover components THEN the System SHALL display capacitor values in microfarads and inductor values in millihenries
4. WHEN a User inputs SPL values for woofer and tweeter THEN the System SHALL use these values in network calculations
5. WHEN the System displays crossover network results THEN the System SHALL organize values by filter order and filter type

### Requirement 6

**User Story:** As a User, I want to input parameters with appropriate units, so that I can work with familiar measurement systems.

#### Acceptance Criteria

1. WHEN a User inputs a parameter THEN the System SHALL display the expected unit next to the input field
2. WHEN a User enters a value THEN the System SHALL validate that the value is numeric and within reasonable ranges
3. WHEN the System performs unit conversions THEN the System SHALL convert between grams and kilograms, millimeters and meters, and other unit pairs as needed
4. WHEN a User views calculation results THEN the System SHALL display all values with their corresponding units
5. WHEN a User inputs an invalid value THEN the System SHALL display an error message indicating the expected format and range

### Requirement 7

**User Story:** As a User, I want to access the calculator from any device with a web browser, so that I can perform calculations without installing software.

#### Acceptance Criteria

1. WHEN a User opens the application URL in a web browser THEN the System SHALL display the calculator interface
2. WHEN a User accesses the application from a mobile device THEN the System SHALL display a responsive layout optimized for the screen size
3. WHEN a User accesses the application from a desktop browser THEN the System SHALL display a layout utilizing available screen space
4. WHEN a User navigates between different calculators THEN the System SHALL maintain a consistent user interface
5. WHEN a User performs calculations THEN the System SHALL execute all computations in the browser without requiring server-side processing

### Requirement 8

**User Story:** As a User, I want to navigate between different calculation modules, so that I can access the specific calculator I need.

#### Acceptance Criteria

1. WHEN a User opens the application THEN the System SHALL display a navigation menu listing all available calculators
2. WHEN a User selects a calculator from the menu THEN the System SHALL display the corresponding calculator interface
3. WHEN a User switches between calculators THEN the System SHALL preserve previously entered values in each calculator
4. WHEN a User views a calculator THEN the System SHALL display a clear title indicating which calculator is active
5. WHEN a User navigates the application THEN the System SHALL provide visual feedback indicating the currently selected calculator

### Requirement 9

**User Story:** As a User, I want calculation results to update automatically, so that I can see the effects of parameter changes immediately.

#### Acceptance Criteria

1. WHEN a User modifies an input parameter THEN the System SHALL recalculate dependent values within 100 milliseconds
2. WHEN the System recalculates values THEN the System SHALL update all affected output fields
3. WHEN a User enters an incomplete set of parameters THEN the System SHALL display only the results that can be calculated with available inputs
4. WHEN all required parameters are provided THEN the System SHALL display all calculated results
5. WHEN a User clears an input field THEN the System SHALL remove dependent calculated values

### Requirement 10

**User Story:** As a User, I want to see calculation formulas and explanations, so that I can understand and verify the calculations being performed.

#### Acceptance Criteria

1. WHEN a User views a calculated result THEN the System SHALL provide an option to display the formula used
2. WHEN a User requests formula information THEN the System SHALL show the mathematical expression with variable definitions
3. WHEN a User views a calculator section THEN the System SHALL provide brief explanations of the parameters and their significance
4. WHEN a User accesses help information THEN the System SHALL display context-sensitive guidance for the current calculator
5. WHEN a User views technical terms THEN the System SHALL provide definitions or links to definitions
