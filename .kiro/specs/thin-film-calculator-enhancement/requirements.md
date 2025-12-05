# Requirements Document

## Introduction

本ドキュメントは、薄膜パターンの抵抗値計算機能の汎用性向上に関する要件を定義します。現在の実装では抵抗値のみを計算していますが、ユーザーが任意のパラメータを入力値として選択し、他のパラメータを計算できるようにします。また、体積抵抗率の入力方法を改善し、材料のプリセット値と自由入力を組み合わせた使いやすいインターフェースを提供します。

## Glossary

- **System**: 薄膜パターン抵抗値計算システム
- **User**: 計算機能を使用するエンジニアまたは技術者
- **Volume Resistivity**: 体積抵抗率（ρ）- 材料固有の電気抵抗特性
- **Line Width**: 線幅（W）- 薄膜パターンの幅
- **Line Thickness**: 線厚（T）- 薄膜パターンの厚さ
- **Line Length**: 線長（L）- 薄膜パターンの長さ
- **Resistance**: 抵抗値（R）- 計算される電気抵抗
- **Calculation Mode**: 計算モード - どのパラメータを計算するかを指定する設定
- **Material Preset**: 材料プリセット - 一般的な材料の体積抵抗率の事前定義値

## Requirements

### Requirement 1

**User Story:** As a user, I want to select which parameter to calculate, so that I can solve for different unknowns using the same resistance formula.

#### Acceptance Criteria

1. WHEN the user accesses the thin film resistance calculator THEN the System SHALL display a calculation mode selector with five options: resistance, line width, line thickness, line length, and volume resistivity
2. WHEN the user selects a calculation mode THEN the System SHALL designate the selected parameter as the output and the remaining four parameters as inputs
3. WHEN the user changes the calculation mode THEN the System SHALL update the input and output fields accordingly without losing previously entered values
4. WHEN all required input values are provided THEN the System SHALL calculate the selected output parameter using the formula R = ρ × L / (W × T)
5. WHEN the user provides inputs that would result in division by zero or invalid calculation THEN the System SHALL prevent the calculation and display an appropriate error message

### Requirement 2

**User Story:** As a user, I want to input volume resistivity using material presets or custom values, so that I can quickly select common materials or specify exact values for specialized materials.

#### Acceptance Criteria

1. WHEN the user views the volume resistivity input field THEN the System SHALL display a dropdown selector with preset material options and a custom input option
2. WHEN the user selects a preset material from the dropdown THEN the System SHALL populate the volume resistivity field with the corresponding value in units of 10⁻⁸ Ω·m
3. WHEN the user selects the custom input option THEN the System SHALL enable a text input field for manual entry of volume resistivity values
4. WHEN the user enters a custom volume resistivity value THEN the System SHALL accept the value in units of 10⁻⁸ Ω·m
5. WHERE volume resistivity is an input parameter, WHEN the user switches between preset and custom modes THEN the System SHALL preserve the current value if possible

### Requirement 3

**User Story:** As a user, I want the volume resistivity to default to 10⁻⁸ Ω·m units, so that I can work with convenient values for common thin film materials.

#### Acceptance Criteria

1. WHEN the System displays volume resistivity values THEN the System SHALL use 10⁻⁸ Ω·m as the default unit
2. WHEN the user inputs or views volume resistivity THEN the System SHALL clearly indicate that the unit is 10⁻⁸ Ω·m
3. WHEN the System performs calculations THEN the System SHALL correctly convert volume resistivity from 10⁻⁸ Ω·m to Ω·m for internal computation
4. WHEN the System displays calculated volume resistivity as output THEN the System SHALL convert the result from Ω·m to 10⁻⁸ Ω·m for display

### Requirement 4

**User Story:** As a user, I want to reference standard material resistivity values from a reference table, so that I can ensure accuracy when selecting materials.

#### Acceptance Criteria

1. WHEN the System provides material presets THEN the System SHALL include resistivity values based on the reference document "resistivityJ.pdf"
2. WHEN the user selects a material preset THEN the System SHALL use the resistivity value corresponding to that material from the reference table
3. WHEN displaying material options THEN the System SHALL show both the material name and its resistivity value for clarity
4. WHERE new materials are added to the preset list, THEN the System SHALL maintain consistency with the reference document values

### Requirement 5

**User Story:** As a user, I want the calculator to maintain proper unit conversions, so that I can input values in convenient units and receive accurate results.

#### Acceptance Criteria

1. WHEN the user inputs line width, line thickness, or line length THEN the System SHALL accept values in millimeters
2. WHEN the System performs resistance calculations THEN the System SHALL convert millimeter inputs to meters for computation
3. WHEN the System calculates dimensional outputs (width, thickness, or length) THEN the System SHALL convert results from meters to millimeters for display
4. WHEN the System displays calculated resistance THEN the System SHALL show the value in Ohms
5. WHEN unit conversions are performed THEN the System SHALL maintain numerical precision to at least six decimal places

### Requirement 6

**User Story:** As a user, I want clear visual feedback about which parameter is being calculated, so that I can easily understand the calculator's current configuration.

#### Acceptance Criteria

1. WHEN a calculation mode is selected THEN the System SHALL visually distinguish output fields from input fields using different styling
2. WHEN the user views the calculator THEN the System SHALL display the calculation formula with the output parameter clearly highlighted
3. WHEN the calculation mode changes THEN the System SHALL update the visual indicators immediately to reflect the new configuration
4. WHEN displaying the formula THEN the System SHALL show which variable is being solved for in the current mode

### Requirement 7

**User Story:** As a user, I want input validation for all parameters, so that I can receive immediate feedback on invalid entries and understand acceptable value ranges.

#### Acceptance Criteria

1. WHEN the user enters a non-numeric value in any input field THEN the System SHALL display a validation error message
2. WHEN the user enters a negative value for any physical parameter THEN the System SHALL display a validation error indicating that positive values are required
3. WHEN the user enters zero for a parameter that would cause division by zero THEN the System SHALL prevent calculation and display an appropriate error message
4. WHEN validation errors are present THEN the System SHALL disable the calculation and clearly indicate which fields contain errors
5. WHEN the user corrects an invalid input THEN the System SHALL remove the error message and re-enable calculation if all inputs are valid
