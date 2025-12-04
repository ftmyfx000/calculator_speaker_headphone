# Design Document

## Overview

本設計は、Excelシート「いろいろ計算シート簡易版_rev5.xlsx」の全ての計算機能をWEBアプリケーションに実装するものです。既存のTSパラメータ計算機を大幅に拡張し、以下の新機能を追加します：

- Qms（機械的Q値）計算
- Qts（総合Q値）計算
- 振幅計算
- 音圧計算
- 低音域音圧計算とグラフ表示（10Hz～20kHz）
- 薄膜パターンの抵抗値計算
- ドイツのXmax計算
- 開管の気中共鳴周波数計算

既存のReact + TypeScript + Tailwind CSSの技術スタックを使用し、既存のコンポーネント構造とコンテキストAPIを活用します。

## Architecture

### Component Structure

```
src/
├── components/
│   ├── calculators/
│   │   ├── TSParameterCalculator.tsx (拡張)
│   │   ├── sections/
│   │   │   ├── F0CalculationSection.tsx (新規)
│   │   │   ├── QmsCalculationSection.tsx (新規)
│   │   │   ├── QtsCalculationSection.tsx (新規)
│   │   │   ├── AmplitudeCalculationSection.tsx (新規)
│   │   │   ├── SPLCalculationSection.tsx (新規)
│   │   │   ├── FrequencyResponseSection.tsx (新規)
│   │   │   ├── ThinFilmResistanceSection.tsx (新規)
│   │   │   ├── XmaxCalculationSection.tsx (新規)
│   │   │   └── OpenTubeResonanceSection.tsx (新規)
│   └── common/
│       ├── InputField.tsx (既存)
│       ├── ResultDisplay.tsx (既存)
│       ├── FormulaDisplay.tsx (既存)
│       ├── HelpTooltip.tsx (既存)
│       └── FrequencyResponseChart.tsx (新規)
├── lib/
│   ├── calculations/
│   │   ├── ts-parameters.ts (拡張)
│   │   ├── amplitude.ts (新規)
│   │   ├── spl-advanced.ts (新規)
│   │   ├── thin-film.ts (新規)
│   │   ├── xmax.ts (新規)
│   │   └── resonance.ts (新規)
│   └── types/
│       ├── ts-parameters.ts (拡張)
│       ├── amplitude.ts (新規)
│       ├── spl-advanced.ts (新規)
│       ├── thin-film.ts (新規)
│       ├── xmax.ts (新規)
│       └── resonance.ts (新規)
└── contexts/
    └── CalculatorStateContext.tsx (拡張)
```

### Data Flow

1. **Input Layer**: ユーザーが各セクションの入力フィールドに値を入力
2. **State Management**: CalculatorStateContextが全ての入力値を管理
3. **Calculation Layer**: 入力値が変更されるたびに、対応する計算関数が実行
4. **Display Layer**: 計算結果がResultDisplayコンポーネントで表示

### State Management

既存のCalculatorStateContextを拡張し、新しい入力フィールドを追加：

```typescript
interface TSParameterState {
  // 既存のフィールド
  mms: string;
  kms: string;
  bl: string;
  re: string;
  effectiveRadius: string;
  airDensity: string;
  power: string;
  
  // 新規フィールド
  rms: string;
  spl: string;
  frequency: string;
  micDistance: string;
  inputVoltage: string;
  
  // 薄膜パターン用
  volumeResistivity: string;
  lineWidth: string;
  lineThickness: string;
  lineLength: string;
  
  // Xmax計算用
  vcWindingWidth: string;
  plateThickness: string;
  
  // 開管共鳴用
  soundSpeed: string;
  tubeLength: string;
}
```

## Components and Interfaces

### 1. TSParameterCalculator (拡張)

メインの計算機コンポーネント。各計算セクションを統合し、レイアウトを管理します。

```typescript
export const TSParameterCalculator: React.FC = () => {
  const { states, updateTSParameterState } = useCalculatorState();
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2>TSパラメータ計算機</h2>
      
      <F0CalculationSection />
      <AirLoadMassSection />
      <InputVoltageSection />
      <VasCalculationSection />
      <QesCalculationSection />
      <QmsCalculationSection />
      <QtsCalculationSection />
      <AmplitudeCalculationSection />
      <SPLCalculationSection />
      <FrequencyResponseSection />
      <ThinFilmResistanceSection />
      <XmaxCalculationSection />
      <OpenTubeResonanceSection />
    </div>
  );
};
```

### 2. QmsCalculationSection (新規)

Qms計算専用のセクションコンポーネント。

**Props**: なし（コンテキストから状態を取得）

**State**: コンテキストから取得
- F0 (計算値)
- Mms (入力値)
- Rms (入力値)

**Calculations**:
- Qms = 2π × F0 × Mms / Rms

### 3. QtsCalculationSection (新規)

Qts計算専用のセクションコンポーネント。

**Props**: なし

**State**: コンテキストから取得
- Re (入力値)
- Bl (入力値)
- Rms (入力値)
- F0 (計算値)
- Mms (入力値)

**Calculations**:
- Qes = 2π × F0 × Mms × Re / Bl²
- Qms = 2π × F0 × Mms / Rms
- Qts = (Qes × Qms) / (Qes + Qms)

### 4. AmplitudeCalculationSection (新規)

振幅計算専用のセクションコンポーネント。

**Props**: なし

**State**: コンテキストから取得
- SPL (入力値、dB)
- airDensity (入力値、kg/m³)
- effectiveRadius (入力値、mm)
- frequency (入力値、Hz)

**Calculations**:
- P0 = 2×10^(-5) Pa (基準音圧)
- amplitude = 2√2 × P0 × 10^(SPL/20) / (4π² × f² × ρ × a²)

### 5. SPLCalculationSection (新規)

音圧計算専用のセクションコンポーネント。

**Props**: なし

**State**: コンテキストから取得
- airDensity (入力値)
- effectiveRadius (入力値)
- Mms (入力値)
- F0 (計算値)
- Re (入力値)
- micDistance (入力値)
- inputVoltage (入力値)
- Rms (入力値)
- Bl (入力値)
- frequency (入力値)

**Calculations**:
- Qts = 2π × F0 × Mms / (Bl² / Re + Rms)
- sec2 = ρ × a² × V × Bl / (2 × distance × Mms × Re)
- sec3 = (f / F0) × (√(1/Qts² + (f/F0 - F0/f)²))^(-1)
- SPL = 20 × log10(sec2 × sec3 / P0)

### 6. FrequencyResponseSection (新規)

周波数応答グラフ表示セクション。

**Props**: なし

**State**: コンテキストから取得（SPL計算に必要な全てのパラメータ）

**Features**:
- 標準周波数ポイント（16, 20, 25, ..., 20000 Hz）でSPLを計算
- テーブル表示（FREQ, x=f/f0, P音圧, P dB）
- グラフ表示（Recharts使用）

**Dependencies**: 
- Recharts ライブラリ（グラフ描画用）

### 7. ThinFilmResistanceSection (新規)

薄膜パターンの抵抗値計算セクション。

**Props**: なし

**State**: コンテキストから取得
- volumeResistivity (入力値、Ω·m)
- lineWidth (入力値、mm)
- lineThickness (入力値、mm)
- lineLength (入力値、mm)

**Calculations**:
- R = ρ × L / (W × T)

### 8. XmaxCalculationSection (新規)

ドイツのXmax計算セクション。

**Props**: なし

**State**: コンテキストから取得
- vcWindingWidth (入力値、mm)
- plateThickness (入力値、mm)

**Calculations**:
- Xmax = (VC巻き幅 - plate厚さ) / 2

### 9. OpenTubeResonanceSection (新規)

開管の気中共鳴周波数計算セクション。

**Props**: なし

**State**: コンテキストから取得
- soundSpeed (入力値、m/s、デフォルト: 346.1)
- tubeLength (入力値、mm)

**Calculations**:
- f_n = n × c / (2 × L) (n = 1, 2, 3, ...)

### 10. FrequencyResponseChart (新規)

周波数応答グラフを描画する共通コンポーネント。

**Props**:
```typescript
interface FrequencyResponseChartProps {
  data: Array<{
    frequency: number;
    spl: number;
    xRatio: number;
    pressure: number;
  }>;
}
```

**Features**:
- 対数スケールのX軸（周波数）
- 線形スケールのY軸（SPL in dB）
- グリッド線
- ツールチップ
- レスポンシブデザイン

## Data Models

### TSParameterState (拡張)

```typescript
interface TSParameterState {
  // 基本パラメータ
  mms: string;              // 振動系の質量 (g)
  kms: string;              // 機械的スティフネス (N/mm)
  bl: string;               // 力係数 (N/A)
  re: string;               // DC抵抗 (Ω)
  effectiveRadius: string;  // 有効半径 (mm)
  airDensity: string;       // 空気密度 (kg/m³)
  power: string;            // 入力電力 (W)
  rms: string;              // 機械的抵抗 (kg/s)
  
  // 振幅・音圧計算用
  spl: string;              // 音圧レベル (dB)
  frequency: string;        // 周波数 (Hz)
  micDistance: string;      // マイク距離 (m)
  inputVoltage: string;     // 入力電圧 (V)
  
  // 薄膜パターン用
  volumeResistivity: string;  // 体積抵抗率 (Ω·m)
  lineWidth: string;          // 線幅 (mm)
  lineThickness: string;      // 線厚 (mm)
  lineLength: string;         // 線長 (mm)
  
  // Xmax計算用
  vcWindingWidth: string;     // VC巻き幅 (mm)
  plateThickness: string;     // plate厚さ (mm)
  
  // 開管共鳴用
  soundSpeed: string;         // 音速 (m/s)
  tubeLength: string;         // 管の長さ (mm)
}
```

### FrequencyResponseData

```typescript
interface FrequencyResponsePoint {
  frequency: number;    // 周波数 (Hz)
  xRatio: number;       // x = f / f0
  pressure: number;     // 音圧 (Pa)
  spl: number;          // 音圧レベル (dB)
}

type FrequencyResponseData = FrequencyResponsePoint[];
```

### ThinFilmResistanceParams

```typescript
interface ThinFilmResistanceParams {
  volumeResistivity: number;  // 体積抵抗率 (Ω·m)
  lineWidth: number;          // 線幅 (m)
  lineThickness: number;      // 線厚 (m)
  lineLength: number;         // 線長 (m)
}
```

### XmaxParams

```typescript
interface XmaxParams {
  vcWindingWidth: number;   // VC巻き幅 (mm)
  plateThickness: number;   // plate厚さ (mm)
}
```

### OpenTubeResonanceParams

```typescript
interface OpenTubeResonanceParams {
  soundSpeed: number;   // 音速 (m/s)
  tubeLength: number;   // 管の長さ (m)
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Qms calculation accuracy
*For any* valid F0, Mms (in kg), and Rms values, calculating Qms using the formula Qms = 2π × F0 × Mms / Rms should produce a positive result
**Validates: Requirements 1.1, 1.2**

### Property 2: Qts calculation consistency
*For any* valid Qes and Qms values, calculating Qts using the formula Qts = (Qes × Qms) / (Qes + Qms) should produce a result that is less than both Qes and Qms
**Validates: Requirements 2.3**

### Property 3: Unit conversion consistency
*For any* input value in millimeters, converting to meters and back to millimeters should preserve the original value (within floating-point precision)
**Validates: Requirements 1.2, 3.3, 4.2**

### Property 4: Amplitude calculation positivity
*For any* valid SPL, air density, effective radius, and frequency values, the calculated amplitude should be positive
**Validates: Requirements 3.1, 3.5**

### Property 5: SPL calculation range
*For any* valid speaker parameters, the calculated SPL should be within a reasonable range (e.g., 0 to 150 dB)
**Validates: Requirements 4.5**

### Property 6: Frequency response monotonicity near resonance
*For any* speaker with valid parameters, the SPL at F0 should be greater than or equal to the SPL at frequencies significantly below F0
**Validates: Requirements 5.1, 5.2**

### Property 7: Thin film resistance positivity
*For any* valid volume resistivity, line dimensions, the calculated resistance should be positive
**Validates: Requirements 6.4**

### Property 8: Xmax calculation validity
*For any* voice coil winding width greater than plate thickness, the calculated Xmax should be positive
**Validates: Requirements 7.3**

### Property 9: Resonance frequency ordering
*For any* open tube, the resonance frequencies should be ordered such that f_1 < f_2 < f_3
**Validates: Requirements 8.4**

### Property 10: State persistence
*For any* input value entered by the user, reloading the page should restore that value from the context
**Validates: Requirements 10.3**

### Property 11: Automatic recalculation
*For any* input value change, all dependent calculation results should be automatically updated
**Validates: Requirements 10.4**

## Error Handling

### Input Validation

1. **Numeric Validation**: 全ての数値入力フィールドは、非数値入力を適切に処理
   - 空文字列: 計算結果を非表示
   - 非数値文字: エラーメッセージを表示せず、単に計算を実行しない
   - 負の値: 物理的に意味のないパラメータ（質量、抵抗など）では警告

2. **Range Validation**: 特定のパラメータには妥当な範囲を設定
   - 周波数: 1 Hz ～ 100 kHz
   - SPL: 0 dB ～ 150 dB
   - 空気密度: 0.5 ～ 2.0 kg/m³

3. **Division by Zero**: ゼロ除算が発生する可能性のある計算では事前チェック
   - Rms = 0 の場合、Qms計算を実行しない
   - Qes + Qms = 0 の場合、Qts計算を実行しない

### Error Display

- エラーメッセージは入力フィールドの下に赤色で表示
- 計算結果が無効な場合は、結果表示エリアに「計算できません」と表示
- グラフ描画エラーの場合は、グラフエリアにエラーメッセージを表示

### Graceful Degradation

- 一部の計算が失敗しても、他の計算は継続
- 必須パラメータが不足している場合は、その計算セクションのみ結果を非表示

## Testing Strategy

### Unit Testing

各計算関数に対してユニットテストを実装：

1. **Qms Calculation Tests**
   - 正常な入力値での計算
   - 境界値テスト（非常に小さい/大きい値）
   - 単位変換の正確性

2. **Qts Calculation Tests**
   - Qes, Qms, Qtsの関係性の検証
   - Qts < Qes かつ Qts < Qms の検証

3. **Amplitude Calculation Tests**
   - 正の振幅値の検証
   - 単位変換の正確性

4. **SPL Calculation Tests**
   - 妥当な範囲のSPL値の検証
   - 周波数応答の連続性

5. **Thin Film Resistance Tests**
   - 抵抗値の正確性
   - 単位変換の正確性

6. **Xmax Calculation Tests**
   - 正のXmax値の検証
   - 境界条件（VC巻き幅 = plate厚さ）

7. **Resonance Frequency Tests**
   - 周波数の順序性（f_1 < f_2 < f_3）
   - 単位変換の正確性

### Property-Based Testing

Property-based testingには**fast-check**ライブラリを使用します。各テストは最低100回の反復を実行します。

1. **Property Test for Qms Calculation**
   - **Feature: ts-parameter-qms-enhancement, Property 1: Qms calculation accuracy**
   - ランダムなF0, Mms, Rms値を生成し、Qmsが常に正であることを検証

2. **Property Test for Qts Calculation**
   - **Feature: ts-parameter-qms-enhancement, Property 2: Qts calculation consistency**
   - ランダムなQes, Qms値を生成し、Qts < Qes かつ Qts < Qms を検証

3. **Property Test for Unit Conversion**
   - **Feature: ts-parameter-qms-enhancement, Property 3: Unit conversion consistency**
   - ランダムなmm値を生成し、mm → m → mm の変換が元の値を保持することを検証

4. **Property Test for Amplitude Calculation**
   - **Feature: ts-parameter-qms-enhancement, Property 4: Amplitude calculation positivity**
   - ランダムなSPL, 空気密度, 有効半径, 周波数を生成し、振幅が常に正であることを検証

5. **Property Test for SPL Calculation**
   - **Feature: ts-parameter-qms-enhancement, Property 5: SPL calculation range**
   - ランダムなスピーカーパラメータを生成し、SPLが0～150 dBの範囲内であることを検証

6. **Property Test for Frequency Response**
   - **Feature: ts-parameter-qms-enhancement, Property 6: Frequency response monotonicity near resonance**
   - ランダムなスピーカーパラメータを生成し、F0でのSPLが低周波数でのSPLより大きいことを検証

7. **Property Test for Thin Film Resistance**
   - **Feature: ts-parameter-qms-enhancement, Property 7: Thin film resistance positivity**
   - ランダムな体積抵抗率と線寸法を生成し、抵抗値が常に正であることを検証

8. **Property Test for Xmax Calculation**
   - **Feature: ts-parameter-qms-enhancement, Property 8: Xmax calculation validity**
   - ランダムなVC巻き幅とplate厚さを生成し、Xmaxが正であることを検証

9. **Property Test for Resonance Frequency**
   - **Feature: ts-parameter-qms-enhancement, Property 9: Resonance frequency ordering**
   - ランダムな音速と管長を生成し、f_1 < f_2 < f_3 を検証

### Integration Testing

1. **Context Integration Tests**
   - 状態の更新と取得が正しく動作することを検証
   - 複数のセクション間での状態共有を検証

2. **Component Integration Tests**
   - 入力フィールドの変更が計算結果に反映されることを検証
   - グラフコンポーネントがデータを正しく表示することを検証

### UI Testing

1. **Responsive Design Tests**
   - モバイル、タブレット、デスクトップでのレイアウトを検証

2. **Accessibility Tests**
   - キーボードナビゲーション
   - スクリーンリーダー対応
   - ARIA属性の適切な使用

## Implementation Notes

### Dependencies

新しい依存関係：
- **recharts**: グラフ描画ライブラリ（周波数応答グラフ用）
- **fast-check**: Property-based testingライブラリ

### Performance Considerations

1. **Calculation Optimization**: 
   - 周波数応答計算は32ポイントのみ（標準周波数）
   - useEffectでの計算は依存配列を適切に設定し、不要な再計算を防ぐ

2. **Memoization**:
   - 複雑な計算結果はuseMemoでメモ化
   - グラフデータはuseMemoでメモ化

3. **Lazy Loading**:
   - Rechartsコンポーネントは動的インポート

### Accessibility

1. **Semantic HTML**: 適切なHTML要素を使用（section, h2, h3など）
2. **ARIA Labels**: 全ての入力フィールドとボタンに適切なラベル
3. **Keyboard Navigation**: Tab順序を論理的に設定
4. **Focus Management**: フォーカスインジケーターを明確に表示

### Internationalization

現時点では日本語のみサポート。将来的に英語対応を検討する場合は、i18nライブラリの導入を推奨。

## Migration Strategy

既存のTSParameterCalculatorコンポーネントを段階的に拡張：

1. **Phase 1**: 新しい計算関数を実装（ts-parameters.ts拡張）
2. **Phase 2**: 新しいセクションコンポーネントを実装
3. **Phase 3**: CalculatorStateContextを拡張
4. **Phase 4**: TSParameterCalculatorに新しいセクションを統合
5. **Phase 5**: テストの実装
6. **Phase 6**: ドキュメントの更新

既存の機能は維持し、後方互換性を保ちます。
