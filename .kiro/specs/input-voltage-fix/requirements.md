# Requirements Document

## Introduction

このドキュメントは、TSパラメータ計算機の複数のセクションにおける入力フィールド不足の不具合を修正する要件を定義します。具体的には以下の4つのセクションで必要な入力フィールドが表示されていません：

1. **入力電圧計算セクション**: Re（DC抵抗）とP（入力電力）の入力フィールドが不足
2. **空気負荷質量の計算セクション**: ρ（空気密度）とa（有効振動半径）の入力フィールドが不足
3. **Vas計算セクション**: ρ（空気密度）、c（音速）、a（有効振動半径）、Kms（機械的スティフネス）の入力フィールドが不足
4. **Qes計算セクション**: Re（DC抵抗）、Mms（振動系の質量）、Bl（力係数）の入力フィールドが不足

## Glossary

- **Re**: DC抵抗（DC Resistance）。ボイスコイルの直流抵抗値（単位: Ω）
- **P**: 入力電力（Input Power）。スピーカーに入力される電力（単位: W）
- **V**: 入力電圧（Input Voltage）。スピーカーに印加される電圧（単位: V）
- **ρ**: 空気密度（Air Density）。空気の密度（単位: kg/m³、デフォルト: 1.29）
- **a**: 有効振動半径（Effective Radius）。スピーカーの有効振動半径（単位: mm）
- **c**: 音速（Sound Speed）。空気中の音速（単位: m/s、デフォルト: 346.1）
- **Kms**: 機械的スティフネス（Mechanical Stiffness）。サスペンションの硬さ（単位: N/mm）
- **Mms**: 振動系の質量（Moving Mass）。振動板、ボイスコイル等の可動部品の合計質量（単位: g）
- **Bl**: 力係数（Force Factor）。磁束密度とボイスコイルの長さの積（単位: N/A）
- **Qes**: 電気的Q値（Electrical Quality Factor）。スピーカーの電気的損失を表す無次元パラメータ
- **F0**: 共振周波数（Resonance Frequency）。スピーカーの自然共振周波数（単位: Hz）
- **Vas**: 等価コンプライアンス容積（Equivalent Compliance Volume）。スピーカーの等価容積（単位: L）
- **Mair_free**: 自由空間の空気負荷質量（単位: g）
- **Mair_baffle**: 無限バッフルの空気負荷質量（単位: g）
- **WEBアプリ**: 修正対象のスピーカー計算機WEBアプリケーション
- **入力電圧計算セクション**: TSパラメータ計算機内の入力電圧を計算するセクション
- **空気負荷質量の計算セクション**: TSパラメータ計算機内の空気負荷質量を計算するセクション
- **Vas計算セクション**: TSパラメータ計算機内のVasを計算するセクション
- **Qes計算セクション**: TSパラメータ計算機内のQesを計算するセクション

## Requirements

### Requirement 0: UIレイアウトの改善

**User Story:** As a スピーカー設計者, I want each calculation section to have its own input fields, so that I can easily understand which inputs are needed for each calculation

#### Acceptance Criteria

1. WHEN a calculation section is displayed THEN the WEBアプリ SHALL show all required input fields within that section
2. WHEN a user views the TSパラメータ計算機 THEN the WEBアプリ SHALL NOT have a separate "その他のパラメータ" section with all inputs grouped together
3. WHEN a user enters a value in one section THEN the WEBアプリ SHALL automatically reflect that value in other sections that use the same parameter
4. WHEN multiple sections use the same parameter THEN the WEBアプリ SHALL ensure the value is synchronized across all sections
5. WHEN a user navigates between sections THEN the WEBアプリ SHALL maintain all entered values

**Alternative Option (if preferred by user)**:
- WHEN the user prefers separate pages THEN the WEBアプリ MAY organize each calculation section into separate pages with navigation between them

### Requirement 1: 入力電圧計算セクションの入力フィールド表示

**User Story:** As a スピーカー設計者, I want to input Re and P values in the input voltage calculation section, so that I can calculate the input voltage correctly

#### Acceptance Criteria

1. WHEN the 入力電圧計算セクション is displayed THEN the WEBアプリ SHALL show an input field for Re (DC抵抗) with unit Ω
2. WHEN the 入力電圧計算セクション is displayed THEN the WEBアプリ SHALL show an input field for P (入力電力) with unit W
3. WHEN a user inputs Re and P values THEN the WEBアプリ SHALL calculate input voltage using the formula: V = sqrt(Re × P)
4. WHEN the calculation is valid THEN the WEBアプリ SHALL display the input voltage result in V with appropriate precision
5. WHEN either Re or P is missing or invalid THEN the WEBアプリ SHALL not display the calculation result

### Requirement 2: 状態管理の確認

**User Story:** As a スピーカー設計者, I want my Re and P input values to be preserved, so that I don't lose my work when navigating between sections

#### Acceptance Criteria

1. WHEN a user enters Re value THEN the WEBアプリ SHALL store it in the CalculatorStateContext
2. WHEN a user enters P value THEN the WEBアプリ SHALL store it in the CalculatorStateContext
3. WHEN the page reloads THEN the WEBアプリ SHALL restore the Re and P values from context
4. WHEN Re or P values change THEN the WEBアプリ SHALL automatically recalculate the input voltage

### Requirement 3: 空気負荷質量計算セクションの入力フィールド表示

**User Story:** As a スピーカー設計者, I want to input ρ and a values in the air load mass calculation section, so that I can calculate the air load mass correctly

#### Acceptance Criteria

1. WHEN the 空気負荷質量の計算セクション is displayed THEN the WEBアプリ SHALL show an input field for ρ (空気密度) with unit kg/m³ and default value 1.29
2. WHEN the 空気負荷質量の計算セクション is displayed THEN the WEBアプリ SHALL show an input field for a (有効振動半径) with unit mm
3. WHEN a user inputs ρ and a values THEN the WEBアプリ SHALL calculate Mair_free using the formula: Mair_free = (8/3) × ρ × a³ × 1000
4. WHEN a user inputs ρ and a values THEN the WEBアプリ SHALL calculate Mair_baffle using the formula: Mair_baffle = (16/3) × ρ × a³ × 1000
5. WHEN the calculation is valid THEN the WEBアプリ SHALL display both Mair_free and Mair_baffle results in g with appropriate precision
6. WHEN either ρ or a is missing or invalid THEN the WEBアプリ SHALL not display the calculation results

### Requirement 4: Vas計算セクションの入力フィールド表示

**User Story:** As a スピーカー設計者, I want to input ρ, c, a, and Kms values in the Vas calculation section, so that I can calculate Vas correctly

#### Acceptance Criteria

1. WHEN the Vas計算セクション is displayed THEN the WEBアプリ SHALL show an input field for ρ (空気密度) with unit kg/m³ and default value 1.29
2. WHEN the Vas計算セクション is displayed THEN the WEBアプリ SHALL show an input field for c (音速) with unit m/s and default value 346.1
3. WHEN the Vas計算セクション is displayed THEN the WEBアプリ SHALL show an input field for a (有効振動半径) with unit mm
4. WHEN the Vas計算セクション is displayed THEN the WEBアプリ SHALL show an input field for Kms (機械的スティフネス) with unit N/mm
5. WHEN a user inputs ρ, c, a, and Kms values THEN the WEBアプリ SHALL calculate Vas using the formula: Vas = ρ × c² × π × a² / Kms
6. WHEN the calculation is valid THEN the WEBアプリ SHALL display the Vas result in L with appropriate precision
7. WHEN any required input (ρ, c, a, or Kms) is missing or invalid THEN the WEBアプリ SHALL not display the calculation result

### Requirement 5: Qes計算セクションの入力フィールド表示

**User Story:** As a スピーカー設計者, I want to input Re, Mms, and Bl values in the Qes calculation section, so that I can calculate Qes correctly

#### Acceptance Criteria

1. WHEN the Qes計算セクション is displayed THEN the WEBアプリ SHALL show an input field for Re (DC抵抗) with unit Ω
2. WHEN the Qes計算セクション is displayed THEN the WEBアプリ SHALL show an input field for Mms (振動系の質量) with unit g
3. WHEN the Qes計算セクション is displayed THEN the WEBアプリ SHALL show an input field for Bl (力係数) with unit N/A
4. WHEN a user inputs Re, Mms, and Bl values THEN the WEBアプリ SHALL calculate Qes using the formula: Qes = 2π × F0 × Re × Mms / Bl² (where F0 is calculated from other inputs)
5. WHEN the calculation is valid THEN the WEBアプリ SHALL display the Qes result with 4 decimal places precision
6. WHEN any required input (Re, Mms, Bl, or F0) is missing or invalid THEN the WEBアプリ SHALL not display the calculation result

### Requirement 6: 振幅計算セクションの入力フィールド編集不具合の修正

**User Story:** As a スピーカー設計者, I want to be able to edit input values in the amplitude calculation section multiple times, so that I can try different values and see how they affect the results

#### Acceptance Criteria

1. WHEN a user enters a value in any input field in the 振幅の計算セクション THEN the WEBアプリ SHALL allow the user to change that value at any time
2. WHEN a user changes an input value THEN the WEBアプリ SHALL immediately recalculate the amplitude result
3. WHEN a user clears an input value THEN the WEBアプリ SHALL hide the calculation result until valid values are entered again
4. WHEN input fields are rendered THEN the WEBアプリ SHALL NOT disable or lock any input fields after initial entry
5. WHEN a user interacts with input fields THEN the WEBアプリ SHALL maintain normal input field behavior (focus, selection, editing)

### Requirement 7: 既存機能との整合性

**User Story:** As a スピーカー設計者, I want the input values to be shared across different calculation sections, so that I don't need to enter them multiple times

#### Acceptance Criteria

1. WHEN Re is entered in the 入力電圧計算セクション THEN the WEBアプリ SHALL use the same Re value in other sections that require it (Qes計算, Qts計算, 音圧計算など)
2. WHEN Re is entered in other sections THEN the WEBアプリ SHALL reflect the value in the 入力電圧計算セクション
3. WHEN P is entered in the 入力電圧計算セクション THEN the WEBアプリ SHALL use the same P value in other sections that require it
4. WHEN P is entered in other sections THEN the WEBアプリ SHALL reflect the value in the 入力電圧計算セクション
5. WHEN ρ is entered in the 空気負荷質量の計算セクション THEN the WEBアプリ SHALL use the same ρ value in other sections that require it (振幅計算, 音圧計算など)
6. WHEN ρ is entered in other sections THEN the WEBアプリ SHALL reflect the value in the 空気負荷質量の計算セクション
7. WHEN a is entered in the 空気負荷質量の計算セクション THEN the WEBアプリ SHALL use the same a value in other sections that require it (振幅計算, 音圧計算, Vas計算など)
8. WHEN a is entered in other sections THEN the WEBアプリ SHALL reflect the value in the 空気負荷質量の計算セクション
9. WHEN c is entered in the Vas計算セクション THEN the WEBアプリ SHALL use the same c value in other sections that require it (開管共鳴計算など)
10. WHEN c is entered in other sections THEN the WEBアプリ SHALL reflect the value in the Vas計算セクション
11. WHEN Kms is entered in the Vas計算セクション THEN the WEBアプリ SHALL use the same Kms value in other sections that require it (F0計算など)
12. WHEN Kms is entered in other sections THEN the WEBアプリ SHALL reflect the value in the Vas計算セクション
13. WHEN Mms is entered in the Qes計算セクション THEN the WEBアプリ SHALL use the same Mms value in other sections that require it (F0計算, Qms計算, Qts計算, 音圧計算など)
14. WHEN Mms is entered in other sections THEN the WEBアプリ SHALL reflect the value in the Qes計算セクション
15. WHEN Bl is entered in the Qes計算セクション THEN the WEBアプリ SHALL use the same Bl value in other sections that require it (Qts計算, 音圧計算など)
16. WHEN Bl is entered in other sections THEN the WEBアプリ SHALL reflect the value in the Qes計算セクション
