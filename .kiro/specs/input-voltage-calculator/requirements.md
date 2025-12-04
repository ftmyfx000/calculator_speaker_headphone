# Requirements Document

## Introduction

入力電圧計算機能は、スピーカーシステムにおいて、指定された電力（ワット）を出力するために必要な入力電圧を計算する機能です。この計算機は、スピーカーの直流抵抗値と希望する入力電力から、必要な電圧値を算出します。

## Glossary

- **System**: 入力電圧計算システム
- **User**: この計算機を使用するオーディオエンジニア、スピーカー設計者、または一般ユーザー
- **DC Resistance (直流抵抗値)**: スピーカーの直流抵抗値（Ohm単位）
- **Input Power (入力電力)**: スピーカーに入力する電力（Watt単位）
- **Voltage (電圧)**: 計算結果として得られる電圧値（Volt単位）
- **Calculator Component**: 入力電圧を計算するReactコンポーネント

## Requirements

### Requirement 1

**User Story:** As a user, I want to input the DC resistance and power values, so that I can calculate the required input voltage.

#### Acceptance Criteria

1. WHEN the user enters a DC resistance value THEN the System SHALL accept positive numeric values in Ohm units
2. WHEN the user enters an input power value THEN the System SHALL accept positive numeric values in Watt units
3. WHEN both DC resistance and input power are provided THEN the System SHALL display input fields with appropriate labels and units
4. WHEN the user modifies an input value THEN the System SHALL update the calculation immediately
5. WHEN the user enters invalid input THEN the System SHALL provide clear visual feedback

### Requirement 2

**User Story:** As a user, I want the system to calculate the voltage using the correct formula, so that I get accurate results.

#### Acceptance Criteria

1. WHEN valid DC resistance and input power values are provided THEN the System SHALL calculate voltage using the formula V = √(P × R)
2. WHEN the calculation is performed THEN the System SHALL display the result with appropriate precision
3. WHEN input values change THEN the System SHALL recalculate the voltage automatically
4. WHEN the calculation result is displayed THEN the System SHALL show the unit [V] next to the value

### Requirement 3

**User Story:** As a user, I want to see validation errors for invalid inputs, so that I understand what corrections are needed.

#### Acceptance Criteria

1. WHEN the user enters a negative value THEN the System SHALL display an error message and prevent calculation
2. WHEN the user enters zero for DC resistance THEN the System SHALL display an error message indicating invalid input
3. WHEN the user enters non-numeric characters THEN the System SHALL display an error message
4. WHEN the user clears a required field THEN the System SHALL indicate that the field is required
5. WHEN all validation errors are resolved THEN the System SHALL remove error messages and display the calculated result

### Requirement 4

**User Story:** As a user, I want the calculator to be accessible, so that I can use it with assistive technologies.

#### Acceptance Criteria

1. WHEN the calculator is rendered THEN the System SHALL provide appropriate ARIA labels for all input fields
2. WHEN the calculator is rendered THEN the System SHALL ensure proper keyboard navigation order
3. WHEN validation errors occur THEN the System SHALL announce errors to screen readers
4. WHEN the calculation result is updated THEN the System SHALL make the result accessible to screen readers
5. WHEN the user navigates with keyboard THEN the System SHALL provide visible focus indicators

### Requirement 5

**User Story:** As a user, I want the calculator to integrate seamlessly with the existing application, so that I have a consistent user experience.

#### Acceptance Criteria

1. WHEN the calculator is accessed THEN the System SHALL display it within the existing application layout
2. WHEN the calculator is rendered THEN the System SHALL use consistent styling with other calculators
3. WHEN the user navigates to the calculator THEN the System SHALL provide a route at /input-voltage
4. WHEN the calculator is displayed THEN the System SHALL show the title "入力電圧計算" in the navigation
5. WHEN the calculator state changes THEN the System SHALL persist state using the existing CalculatorStateContext

### Requirement 6

**User Story:** As a user, I want to see example values pre-filled, so that I can understand how to use the calculator.

#### Acceptance Criteria

1. WHEN the calculator loads for the first time THEN the System SHALL display default values (8 Ohm, 1 W)
2. WHEN default values are displayed THEN the System SHALL show the calculated result immediately
3. WHEN the user modifies default values THEN the System SHALL update calculations based on new inputs
