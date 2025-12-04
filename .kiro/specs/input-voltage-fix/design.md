# Design Document

## Overview

本設計は、TSパラメータ計算機のUIレイアウトと入力フィールド配置を改善するものです。現在、「その他のパラメータ」セクションに全ての入力欄がまとめられていますが、これを各計算セクション内に分散配置します。

### 主な変更点

1. **UIレイアウトの改善**: 「その他のパラメータ」セクションを削除し、各計算セクションに必要な入力フィールドを配置
2. **入力電圧計算セクション**: Re（DC抵抗）とP（入力電力）の入力フィールドを追加
3. **空気負荷質量の計算セクション**: ρ（空気密度）とa（有効振動半径）の入力フィールドを追加
4. **Vas計算セクション**: ρ（空気密度）、c（音速）、a（有効振動半径）、Kms（機械的スティフネス）の入力フィールドを追加
5. **Qes計算セクション**: Re（DC抵抗）、Mms（振動系の質量）、Bl（力係数）の入力フィールドを追加
6. **F0計算セクション**: Mms（振動系の質量）とKms（機械的スティフネス）の入力フィールドを追加（既存の確認）

### 設計方針

- 各計算セクションは自己完結型とし、必要な全ての入力フィールドをセクション内に配置
- 同じパラメータを使用する複数のセクション間で値を自動同期
- ユーザーは各セクションで独立して計算を実行できる
- 全てのセクションは同一ページ内に配置（ページ分割はオプション）

## Architecture

### 影響を受けるコンポーネント

1. **TSParameterCalculator**: メインコンポーネント（「その他のパラメータ」セクションを削除）
2. **F0CalculationSection**: F0計算セクション（入力フィールドの確認・追加）
3. **AirLoadMassSection**: 空気負荷質量計算セクション（修正対象）
4. **InputVoltageSection**: 入力電圧計算セクション（修正対象）
5. **VasCalculationSection**: Vas計算セクション（修正対象）
6. **QesCalculationSection**: Qes計算セクション（修正対象）
7. **CalculatorStateContext**: 状態管理（既存フィールドの確認）

### データフロー

1. ユーザーが各セクションの入力フィールドに値を入力
2. CalculatorStateContextに値が保存される
3. 入力値が変更されるたびに、対応する計算が実行される
4. 計算結果が表示される
5. 同じパラメータを使用する他のセクションにも値が反映される

## Components and Interfaces

### 0. TSParameterCalculator (修正)

**変更内容**:
- 「その他のパラメータ」セクションを削除
- 各計算セクションが独立して入力フィールドを持つように変更

### 1. F0CalculationSection (確認・修正)

**必要な入力フィールド**:
- Mms (振動系の質量): `states.tsParameters.mms`
- Kms (機械的スティフネス): `states.tsParameters.kms`

**計算式**:
```typescript
F0 = sqrt(Kms / Mms) / (2π)
```

**表示要素**:
- Mms入力フィールド（単位: g）
- Kms入力フィールド（単位: N/mm）
- F0計算結果表示（単位: Hz）
- 数式表示

### 2. InputVoltageSection (修正)

**必要な入力フィールド**:
- Re (DC抵抗): `states.tsParameters.re`
- P (入力電力): `states.tsParameters.power`

**計算式**:
```typescript
V = Math.sqrt(Re × P)
```

**表示要素**:
- Re入力フィールド（単位: Ω）
- P入力フィールド（単位: W）
- 計算結果表示（単位: V）
- 数式表示

### 3. AirLoadMassSection (修正)

**必要な入力フィールド**:
- ρ (空気密度): `states.tsParameters.airDensity`（デフォルト: 1.29）
- a (有効振動半径): `states.tsParameters.effectiveRadius`

**計算式**:
```typescript
Mair_free = (8/3) × ρ × a³ × 1000
Mair_baffle = (16/3) × ρ × a³ × 1000
```

**表示要素**:
- ρ入力フィールド（単位: kg/m³）
- a入力フィールド（単位: mm）
- Mair_free計算結果表示（単位: g）
- Mair_baffle計算結果表示（単位: g）
- 数式表示

### 4. VasCalculationSection (修正)

**必要な入力フィールド**:
- ρ (空気密度): `states.tsParameters.airDensity`（デフォルト: 1.29）
- c (音速): `states.tsParameters.soundSpeed`（デフォルト: 346.1）
- a (有効振動半径): `states.tsParameters.effectiveRadius`
- Kms (機械的スティフネス): `states.tsParameters.kms`

**計算式**:
```typescript
Vas = ρ × c² × π × a² / Kms
```

**表示要素**:
- ρ入力フィールド（単位: kg/m³）
- c入力フィールド（単位: m/s）
- a入力フィールド（単位: mm）
- Kms入力フィールド（単位: N/mm）
- Vas計算結果表示（単位: L）
- 数式表示

### 5. QesCalculationSection (修正)

**必要な入力フィールド**:
- Re (DC抵抗): `states.tsParameters.re`
- Mms (振動系の質量): `states.tsParameters.mms`
- Bl (力係数): `states.tsParameters.bl`
- F0 (共振周波数): 計算値（他のセクションから取得）

**計算式**:
```typescript
Qes = 2π × F0 × Re × Mms / Bl²
```

**表示要素**:
- Re入力フィールド（単位: Ω）
- Mms入力フィールド（単位: g）
- Bl入力フィールド（単位: N/A）
- Qes計算結果表示（4桁精度）
- 数式表示

## Data Models

### 既存の状態確認

CalculatorStateContextには既に以下のフィールドが存在するはず：
- `re`: DC抵抗（Ω）
- `power`: 入力電力（W）
- `airDensity`: 空気密度（kg/m³）
- `effectiveRadius`: 有効振動半径（mm）
- `soundSpeed`: 音速（m/s）
- `kms`: 機械的スティフネス（N/mm）
- `mms`: 振動系の質量（g）
- `bl`: 力係数（N/A）

これらのフィールドが正しく定義されているか確認が必要。

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Input voltage calculation accuracy
*For any* valid Re and P values (both positive), calculating V using the formula V = sqrt(Re × P) should produce a positive result
**Validates: Requirements 1.3**

### Property 2: Air load mass calculation accuracy
*For any* valid ρ and a values (both positive), calculating Mair_free and Mair_baffle should produce positive results, and Mair_baffle should be exactly twice Mair_free
**Validates: Requirements 3.3, 3.4**

### Property 3: Vas calculation accuracy
*For any* valid ρ, c, a, and Kms values (all positive), calculating Vas should produce a positive result
**Validates: Requirements 4.5**

### Property 4: Qes calculation accuracy
*For any* valid F0, Re, Mms, and Bl values (all positive), calculating Qes should produce a positive result
**Validates: Requirements 5.4**

### Property 5: Input field visibility
*For any* time each calculation section is rendered, all required input fields should be visible and functional
**Validates: Requirements 1.1, 1.2, 3.1, 3.2, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3**

### Property 6: State synchronization
*For any* parameter value entered in any section, the same value should be accessible in all other sections that use that parameter
**Validates: Requirements 7.1-7.16**

### Property 7: Input field editability
*For any* input field in any section, after entering a value, the user should be able to edit or change that value at any time
**Validates: Requirements 6.1, 6.2, 6.4, 6.5**

## Error Handling

### Input Validation

1. **Numeric Validation**: Re と P は数値のみ受け付ける
2. **Positive Value Check**: Re と P は正の値である必要がある
3. **Missing Value Handling**: Re または P が空の場合、計算結果を表示しない

### Error Display

- 無効な入力に対してはエラーメッセージを表示
- 計算結果が無効な場合は結果を非表示

## Testing Strategy

### Unit Testing

1. **Input Voltage Calculation Test**
   - 正常な入力値での計算（例: Re=8Ω, P=10W → V≈8.94V）
   - 境界値テスト
   - 負の値の処理

2. **Input Field Rendering Test**
   - ReとPの入力フィールドが表示されることを確認
   - 入力値が状態に正しく保存されることを確認

### Property-Based Testing

Property-based testingには**fast-check**ライブラリを使用します。

1. **Property Test for Input Voltage Calculation**
   - **Feature: input-voltage-fix, Property 1: Input voltage calculation accuracy**
   - ランダムな正のRe, P値を生成し、Vが常に正であることを検証

## Implementation Notes

### 修正箇所

1. **TSParameterCalculatorコンポーネント**: 「その他のパラメータ」セクションを削除
2. **各計算セクションコンポーネント**: 必要な入力フィールドを追加
3. **AmplitudeCalculationSectionコンポーネント**: 入力フィールドが編集不可になる不具合を修正

### 既存コードの確認事項

1. CalculatorStateContextに必要な全てのフィールドが存在するか確認
2. 各セクションで既に使用されているパラメータを確認
3. 入力フィールドコンポーネント（InputField）の使用方法を確認
4. AmplitudeCalculationSectionで入力フィールドがdisabledになっている箇所を特定

### 振幅計算セクションの不具合原因の可能性

1. **入力フィールドのdisabled属性**: 計算後にdisabled=trueが設定されている可能性
2. **readOnly属性**: readOnly=trueが設定されている可能性
3. **状態管理の問題**: 入力値の更新が正しく反映されていない可能性
4. **イベントハンドラの問題**: onChange/onInputイベントが正しく処理されていない可能性

## Migration Strategy

1. **Phase 1**: 既存のInputVoltageSectionコンポーネントを確認
2. **Phase 2**: Re と P の入力フィールドを追加
3. **Phase 3**: 計算ロジックが正しく動作することを確認
4. **Phase 4**: テストを実行
5. **Phase 5**: デプロイ
