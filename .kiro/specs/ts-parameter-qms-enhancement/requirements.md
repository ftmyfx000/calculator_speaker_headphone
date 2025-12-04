# Requirements Document

## Introduction

このドキュメントは、Excelシート「いろいろ計算シート簡易版_rev5.xlsx」の全ての計算機能をWEBアプリケーションに実装する要件を定義します。既存のTSパラメータ計算機を拡張し、Qms、Qts、振幅計算、音圧計算、薄膜パターン計算、Xmax計算、開管の気中共鳴周波数計算などの機能を追加します。

## Glossary

- **TSパラメータ**: Thiele-Small パラメータ。スピーカーの電気音響特性を表す一連のパラメータ
- **Qms**: 機械的Q値（Mechanical Quality Factor）。スピーカーの機械的損失を表す無次元パラメータ
- **Qes**: 電気的Q値（Electrical Quality Factor）。スピーカーの電気的損失を表す無次元パラメータ
- **Qts**: 総合Q値（Total Quality Factor）。QesとQmsを組み合わせた総合的なQ値
- **Rms**: 機械的抵抗（Mechanical Resistance）。スピーカーの振動系における機械的損失を表すパラメータ（単位: kg/s）
- **F0**: 共振周波数（Resonance Frequency）。スピーカーの自然共振周波数（単位: Hz）
- **Mms**: 振動系の質量（Moving Mass）。振動板、ボイスコイル等の可動部品の合計質量（単位: g）
- **Kms**: 機械的スティフネス（Mechanical Stiffness）。サスペンションの硬さ（単位: N/mm）
- **Bl**: 力係数（Force Factor）。磁束密度とボイスコイルの長さの積（単位: N/A）
- **Re**: DC抵抗（DC Resistance）。ボイスコイルの直流抵抗値（単位: Ω）
- **Xmax**: 最大振幅（Maximum Excursion）。スピーカーが線形動作できる最大振幅（単位: mm）
- **SPL**: 音圧レベル（Sound Pressure Level）。音の大きさを表す指標（単位: dB）
- **WEBアプリ**: 本要件で拡張する既存のスピーカー計算機WEBアプリケーション

## Requirements

### Requirement 1: Qms計算

**User Story:** As a スピーカー設計者, I want to calculate Qms (機械的Q値), so that I can evaluate the mechanical damping characteristics of the speaker system

#### Acceptance Criteria

1. WHEN a user inputs F0, Mms, and Rms values THEN the WEBアプリ SHALL calculate and display Qms using the formula: Qms = 2π × F0 × Mms / Rms
2. WHEN Mms is provided in grams THEN the WEBアプリ SHALL convert it to kilograms before calculation
3. WHEN any required input value for Qms calculation is missing or invalid THEN the WEBアプリ SHALL not display a Qms result
4. WHEN all required input values for Qms calculation are valid THEN the WEBアプリ SHALL display the Qms result with 4 decimal places precision
5. WHEN the Qms calculation section is displayed THEN the WEBアプリ SHALL show the formula and variable descriptions

### Requirement 2: Qts計算

**User Story:** As a スピーカー設計者, I want to calculate Qts (総合Q値), so that I can evaluate the overall damping characteristics of the speaker system

#### Acceptance Criteria

1. WHEN a user inputs Re, Bl, Rms, F0, and Mms values THEN the WEBアプリ SHALL calculate Qes using the formula: Qes = 2π × F0 × Mms × Re / Bl²
2. WHEN Qes is calculated THEN the WEBアプリ SHALL calculate Qms using the formula: Qms = 2π × F0 × Mms / Rms
3. WHEN both Qes and Qms are calculated THEN the WEBアプリ SHALL calculate Qts using the formula: Qts = (Qes × Qms) / (Qes + Qms)
4. WHEN all required input values are valid THEN the WEBアプリ SHALL display Qes, Qms, and Qts results with 4 decimal places precision
5. WHEN any required input value is missing or invalid THEN the WEBアプリ SHALL not display the corresponding result

### Requirement 3: 振幅の計算

**User Story:** As a スピーカー設計者, I want to calculate speaker amplitude from SPL, so that I can determine the required excursion for a given sound pressure level

#### Acceptance Criteria

1. WHEN a user inputs SPL, air density, effective radius, and frequency THEN the WEBアプリ SHALL calculate amplitude using the formula: amplitude = 2√2 × P0 × 10^(SPL/20) / (4π² × f² × ρ × a²)
2. WHEN the base pressure P0 is required THEN the WEBアプリ SHALL use the value 2×10^(-5) Pa
3. WHEN effective radius is provided in mm THEN the WEBアプリ SHALL convert it to meters before calculation
4. WHEN amplitude is calculated THEN the WEBアプリ SHALL display the result in both meters and millimeters
5. WHEN all required input values are valid THEN the WEBアプリ SHALL display the amplitude result with appropriate precision

### Requirement 4: 音圧の計算

**User Story:** As a スピーカー設計者, I want to calculate SPL from speaker parameters, so that I can predict the sound output of my speaker design

#### Acceptance Criteria

1. WHEN a user inputs air density, effective radius, Mms, F0, Re, microphone distance, input voltage, Rms, Bl, and frequency THEN the WEBアプリ SHALL calculate SPL
2. WHEN calculating SPL THEN the WEBアプリ SHALL first calculate Qts using the formula: Qts = 2π × F0 × Mms / (Bl² / Re + Rms)
3. WHEN calculating SPL THEN the WEBアプリ SHALL calculate sec2 using the formula: sec2 = ρ × a² × V × Bl / (2 × distance × Mms × Re)
4. WHEN calculating SPL THEN the WEBアプリ SHALL calculate sec3 using the formula: sec3 = (f / F0) × (√(1/Qts² + (f/F0 - F0/f)²))^(-1)
5. WHEN calculating SPL THEN the WEBアプリ SHALL calculate the final SPL using the formula: SPL = 20 × log10(sec2 × sec3 / P0)
6. WHEN all required input values are valid THEN the WEBアプリ SHALL display the SPL result in dB with 2 decimal places precision

### Requirement 5: 低音域音圧計算とグラフ表示

**User Story:** As a スピーカー設計者, I want to see a frequency response graph of SPL, so that I can visualize the speaker's performance across the frequency range

#### Acceptance Criteria

1. WHEN SPL calculation parameters are provided THEN the WEBアプリ SHALL calculate SPL for frequencies from 10 Hz to 20 kHz
2. WHEN calculating frequency response THEN the WEBアプリ SHALL use standard frequency points: 16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000 Hz
3. WHEN frequency response is calculated THEN the WEBアプリ SHALL display a table with columns: FREQ, x=f/f0, P音圧, P dB
4. WHEN frequency response is calculated THEN the WEBアプリ SHALL display a line graph with frequency on the x-axis (logarithmic scale) and SPL in dB on the y-axis
5. WHEN the graph is displayed THEN the WEBアプリ SHALL use appropriate axis labels and grid lines for readability

### Requirement 6: 薄膜パターンの抵抗値計算

**User Story:** As a 電子回路設計者, I want to calculate the resistance of thin film patterns, so that I can design resistive elements with specific values

#### Acceptance Criteria

1. WHEN a user inputs volume resistivity, line width, line thickness, and line length THEN the WEBアプリ SHALL calculate resistance using the formula: R = ρ × L / (W × T)
2. WHEN volume resistivity is provided in Ω·m with scientific notation THEN the WEBアプリ SHALL handle the input correctly
3. WHEN line dimensions are provided in mm THEN the WEBアプリ SHALL convert them to meters before calculation
4. WHEN resistance is calculated THEN the WEBアプリ SHALL display the result in Ω with appropriate precision
5. WHEN all required input values are valid THEN the WEBアプリ SHALL display the resistance result

### Requirement 7: ドイツのXmax計算

**User Story:** As a スピーカー設計者, I want to calculate Xmax using the German method, so that I can determine the maximum linear excursion of my speaker

#### Acceptance Criteria

1. WHEN a user inputs voice coil winding width and plate thickness THEN the WEBアプリ SHALL calculate Xmax using the formula: Xmax = (VC巻き幅 - plate厚さ) / 2
2. WHEN dimensions are provided in mm THEN the WEBアプリ SHALL perform the calculation in mm
3. WHEN Xmax is calculated THEN the WEBアプリ SHALL display the result in mm with 2 decimal places precision
4. WHEN all required input values are valid THEN the WEBアプリ SHALL display the Xmax result

### Requirement 8: 開管の気中共鳴周波数計算

**User Story:** As a 音響設計者, I want to calculate the resonance frequencies of an open tube, so that I can design acoustic resonators

#### Acceptance Criteria

1. WHEN a user inputs sound speed and tube length THEN the WEBアプリ SHALL calculate resonance frequencies for the fundamental and harmonics
2. WHEN calculating resonance frequencies THEN the WEBアプリ SHALL use the formula: f = n × c / (2 × L) where n is the harmonic number
3. WHEN tube length is provided in mm THEN the WEBアプリ SHALL convert it to meters before calculation
4. WHEN resonance frequencies are calculated THEN the WEBアプリ SHALL display results for at least the fundamental (n=1), 2nd harmonic (n=2), and 3rd harmonic (n=3)
5. WHEN all required input values are valid THEN the WEBアプリ SHALL display the resonance frequency results in Hz with 2 decimal places precision

### Requirement 9: UIレイアウトの改善

**User Story:** As a スピーカー設計者, I want the UI layout to match the Excel sheet structure, so that I can easily transition between the Excel tool and the WEB application

#### Acceptance Criteria

1. WHEN the TSパラメータ計算機 page is displayed THEN the WEBアプリ SHALL organize calculations into separate sections: F0計算, 空気負荷質量の計算, 入力電圧計算, Vasの計算, Qesの計算, Qmsの計算, Qtsの計算, 振幅の計算, 音圧の計算, 薄膜パターンの抵抗値計算, ドイツのXmax計算, 開管の気中共鳴周波数計算
2. WHEN each calculation section is displayed THEN the WEBアプリ SHALL clearly separate input fields and calculation results
3. WHEN multiple related calculations are shown THEN the WEBアプリ SHALL group them logically with clear section headers
4. WHEN the page layout is rendered THEN the WEBアプリ SHALL maintain responsive design for mobile and desktop devices
5. WHEN a calculation section requires many inputs THEN the WEBアプリ SHALL organize them in a grid layout for better readability

### Requirement 10: 入力値の永続化

**User Story:** As a スピーカー設計者, I want input values to persist across page reloads, so that I don't lose my work when refreshing the browser

#### Acceptance Criteria

1. WHEN a user enters a value in any input field THEN the WEBアプリ SHALL store the value in the application state
2. WHEN input values are stored in state THEN the WEBアプリ SHALL persist them using the existing CalculatorStateContext
3. WHEN the page reloads THEN the WEBアプリ SHALL restore all previously entered input values from the context
4. WHEN any input value changes THEN the WEBアプリ SHALL automatically recalculate all dependent results

### Requirement 11: ヘルプツールチップ

**User Story:** As a スピーカー設計者, I want to see helpful tooltips for all input fields, so that I can understand what values to enter

#### Acceptance Criteria

1. WHEN any input field is displayed THEN the WEBアプリ SHALL show a help tooltip icon next to the field
2. WHEN a user hovers over or clicks a help tooltip icon THEN the WEBアプリ SHALL display an appropriate explanation for that parameter
3. WHEN the tooltip is displayed THEN the WEBアプリ SHALL use consistent styling with other tooltips in the application
4. WHEN tooltips are shown THEN the WEBアプリ SHALL ensure they do not obstruct other UI elements
