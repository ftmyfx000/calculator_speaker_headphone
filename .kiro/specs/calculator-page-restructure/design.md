# Design Document

## Overview

本設計は、スピーカー計算機WEBアプリケーションのページ構造を再編成するものです。現在、TSパラメータ計算機は1つの長いページに全てのセクションが含まれており、ユーザーは多くのスクロールが必要です。また、独立したSPL計算タブが存在しますが、これはTSパラメータ計算の一部として統合されるべきです。

### 主な変更点

1. **SPL計算タブの削除**: `/spl`ルートとSPLCalculatorコンポーネントを削除
2. **TSパラメータ計算機の分割**: 各計算セクションを独立したページコンポーネントに分割
3. **ルーティングの再構成**: 各計算に専用のルートを作成
4. **ナビゲーションメニューの更新**: 全ての計算ページへのリンクを表示
5. **状態管理の維持**: CalculatorStateContextを使用して全ページ間でパラメータを共有

### 設計方針

- 各計算は独立したページコンポーネントとして実装
- 全てのページは同じCalculatorStateContextを共有
- ナビゲーションメニューは全ての計算ページを表示
- URLは計算の内容を反映した分かりやすいパスを使用
- レスポンシブデザインとアクセシビリティを維持

## Architecture

### コンポーネント構造

```
App.tsx
├── Layout
│   ├── NavigationMenu (更新)
│   └── Main Content Area
│       ├── F0CalculationPage (新規)
│       ├── AirLoadMassPage (新規)
│       ├── InputVoltagePage (新規)
│       ├── VasCalculationPage (新規)
│       ├── QesCalculationPage (新規)
│       ├── QmsCalculationPage (新規)
│       ├── QtsCalculationPage (新規)
│       ├── AmplitudeCalculationPage (新規)
│       ├── SPLCalculationPage (新規)
│       ├── FrequencyResponsePage (新規)
│       ├── ThinFilmResistancePage (新規)
│       ├── XmaxCalculationPage (新規)
│       ├── OpenTubeResonancePage (新規)
│       └── CrossoverNetworkCalculator (既存)
└── CalculatorStateContext (既存)
```

### ルーティング構造

| パス | コンポーネント | 説明 |
|------|--------------|------|
| `/` | Redirect to `/f0` | ルートパスはF0計算にリダイレクト |
| `/ts-parameters` | Redirect to `/f0` | 旧TSパラメータパスもリダイレクト |
| `/f0` | F0CalculationPage | F0（共振周波数）計算 |
| `/air-load-mass` | AirLoadMassPage | 空気負荷質量計算 |
| `/input-voltage` | InputVoltagePage | 入力電圧計算 |
| `/vas` | VasCalculationPage | Vas（等価コンプライアンス容積）計算 |
| `/qes` | QesCalculationPage | Qes（電気的Q値）計算 |
| `/qms` | QmsCalculationPage | Qms（機械的Q値）計算 |
| `/qts` | QtsCalculationPage | Qts（総合Q値）計算 |
| `/amplitude` | AmplitudeCalculationPage | 振幅計算 |
| `/spl` | SPLCalculationPage | 音圧計算 |
| `/frequency-response` | FrequencyResponsePage | 低音域音圧計算とグラフ表示 |
| `/thin-film` | ThinFilmResistancePage | 薄膜パターンの抵抗値計算 |
| `/xmax` | XmaxCalculationPage | ドイツのXmax計算 |
| `/open-tube` | OpenTubeResonancePage | 開管の気中共鳴周波数計算 |
| `/crossover` | CrossoverNetworkCalculator | クロスオーバーネットワーク計算 |

## Components and Interfaces

### 1. App.tsx (更新)

**変更内容**:
- SPLCalculatorのインポートと`/spl`ルートを削除
- 新しい計算ページコンポーネントをインポート
- 各計算ページへのルートを追加
- `/`と`/ts-parameters`を`/f0`にリダイレクト

**新しいルート構造**:
```typescript
<Routes>
  <Route path="/" element={<Navigate to="/f0" replace />} />
  <Route path="/ts-parameters" element={<Navigate to="/f0" replace />} />
  <Route path="/f0" element={<F0CalculationPage />} />
  <Route path="/air-load-mass" element={<AirLoadMassPage />} />
  <Route path="/input-voltage" element={<InputVoltagePage />} />
  <Route path="/vas" element={<VasCalculationPage />} />
  <Route path="/qes" element={<QesCalculationPage />} />
  <Route path="/qms" element={<QmsCalculationPage />} />
  <Route path="/qts" element={<QtsCalculationPage />} />
  <Route path="/amplitude" element={<AmplitudeCalculationPage />} />
  <Route path="/spl" element={<SPLCalculationPage />} />
  <Route path="/frequency-response" element={<FrequencyResponsePage />} />
  <Route path="/thin-film" element={<ThinFilmResistancePage />} />
  <Route path="/xmax" element={<XmaxCalculationPage />} />
  <Route path="/open-tube" element={<OpenTubeResonancePage />} />
  <Route path="/crossover" element={<CrossoverNetworkCalculator />} />
</Routes>
```

### 2. NavigationMenu.tsx (更新)

**変更内容**:
- `calculators`配列を更新して全ての計算ページを含める
- SPL計算タブを削除
- 各TSパラメータ計算を個別のメニュー項目として追加

**新しいメニュー構造**:
```typescript
const calculators: Calculator[] = [
  { id: 'f0', name: 'F0計算', path: '/f0' },
  { id: 'air-load-mass', name: '空気負荷質量の計算', path: '/air-load-mass' },
  { id: 'input-voltage', name: '入力電圧計算', path: '/input-voltage' },
  { id: 'vas', name: 'Vas計算', path: '/vas' },
  { id: 'qes', name: 'Qes計算', path: '/qes' },
  { id: 'qms', name: 'Qms計算', path: '/qms' },
  { id: 'qts', name: 'Qts計算', path: '/qts' },
  { id: 'amplitude', name: '振幅の計算', path: '/amplitude' },
  { id: 'spl', name: '音圧の計算', path: '/spl' },
  { id: 'frequency-response', name: '低音域音圧計算', path: '/frequency-response' },
  { id: 'thin-film', name: '薄膜パターンの抵抗値計算', path: '/thin-film' },
  { id: 'xmax', name: 'ドイツのXmax計算', path: '/xmax' },
  { id: 'open-tube', name: '開管の気中共鳴周波数計算', path: '/open-tube' },
  { id: 'crossover', name: 'クロスオーバーネットワーク計算', path: '/crossover' },
];
```

### 3. 新しいページコンポーネント

各ページコンポーネントは、現在TSParameterCalculator.tsxにある対応するセクションから作成されます。

#### 共通パターン:

```typescript
export const [PageName]: React.FC = () => {
  const { states, update[StateType]State } = useCalculatorState();
  
  // ページ固有の状態とロジック
  
  return (
    <div className="max-w-6xl mx-auto space-y-6" role="main">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        [計算名]
      </h1>
      
      <section className="bg-white rounded-lg shadow p-4 sm:p-6">
        {/* 計算セクションの内容 */}
      </section>
    </div>
  );
};
```

#### 3.1 F0CalculationPage

**元のセクション**: TSParameterCalculator.tsxのF0計算セクション

**必要な状態**:
- `mms`: 振動系の質量
- `kms`: 機械的スティフネス

**計算**:
- F0 = sqrt(Kms / Mms) / (2π)

#### 3.2 AirLoadMassPage

**元のセクション**: TSParameterCalculator.tsxの空気負荷質量計算セクション

**必要な状態**:
- `airDensity`: 空気密度
- `effectiveRadius`: 有効振動半径

**計算**:
- Mair_free = (8/3) × ρ × a³ × 1000
- Mair_baffle = (16/3) × ρ × a³ × 1000

#### 3.3 InputVoltagePage

**元のセクション**: TSParameterCalculator.tsxの入力電圧計算セクション

**必要な状態**:
- `re`: DC抵抗
- `power`: 入力電力

**計算**:
- V = sqrt(Re × P)

#### 3.4 VasCalculationPage

**元のセクション**: TSParameterCalculator.tsxのVas計算セクション

**必要な状態**:
- `airDensity`: 空気密度
- `soundSpeed`: 音速
- `effectiveRadius`: 有効振動半径
- `kms`: 機械的スティフネス

**計算**:
- Vas = ρ × c² × π × a² / Kms

#### 3.5 QesCalculationPage

**元のセクション**: TSParameterCalculator.tsxのQes計算セクション

**必要な状態**:
- `re`: DC抵抗
- `mms`: 振動系の質量
- `bl`: 力係数
- F0（計算値）

**計算**:
- Qes = 2π × F0 × Re × Mms / Bl²

#### 3.6 QmsCalculationPage

**元のセクション**: QmsCalculationSection

**実装**: 既存のQmsCalculationSectionコンポーネントをページコンポーネントとしてラップ

#### 3.7 QtsCalculationPage

**元のセクション**: QtsCalculationSection

**実装**: 既存のQtsCalculationSectionコンポーネントをページコンポーネントとしてラップ

#### 3.8 AmplitudeCalculationPage

**元のセクション**: AmplitudeCalculationSection

**実装**: 既存のAmplitudeCalculationSectionコンポーネントをページコンポーネントとしてラップ

#### 3.9 SPLCalculationPage

**元のセクション**: SPLCalculationSection

**実装**: 既存のSPLCalculationSectionコンポーネントをページコンポーネントとしてラップ

**注**: 独立したSPLCalculatorコンポーネントは削除され、この機能はTSパラメータ計算の一部として統合されます

#### 3.10 FrequencyResponsePage

**元のセクション**: FrequencyResponseSection

**実装**: 既存のFrequencyResponseSectionコンポーネントをページコンポーネントとしてラップ

#### 3.11 ThinFilmResistancePage

**元のセクション**: ThinFilmResistanceSection

**実装**: 既存のThinFilmResistanceSectionコンポーネントをページコンポーネントとしてラップ

#### 3.12 XmaxCalculationPage

**元のセクション**: XmaxCalculationSection

**実装**: 既存のXmaxCalculationSectionコンポーネントをページコンポーネントとしてラップ

#### 3.13 OpenTubeResonancePage

**元のセクション**: OpenTubeResonanceSection

**実装**: 既存のOpenTubeResonanceSectionコンポーネントをページコンポーネントとしてラップ

## Data Models

### CalculatorStateContext (変更なし)

既存のCalculatorStateContextは変更なしで使用されます。全てのページコンポーネントは同じコンテキストを共有し、パラメータの同期が自動的に行われます。

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Navigation menu completeness
*For any* time the navigation menu is rendered, it should contain exactly 14 menu items (13 TS parameter calculations + 1 crossover calculation) and should not contain an SPL calculator menu item
**Validates: Requirements 1.1, 1.3, 2.1**

### Property 2: Route accessibility
*For any* valid calculation path, navigating to that path should render the corresponding calculation page component
**Validates: Requirements 4.1, 4.2**

### Property 3: State persistence across navigation
*For any* parameter value entered on any page, navigating to a different page and back should preserve that value
**Validates: Requirements 5.1, 5.2, 5.3**

### Property 4: URL reflection
*For any* calculation page displayed, the browser URL should match the expected path for that calculation
**Validates: Requirements 4.1**

### Property 5: Redirect behavior
*For any* access to root path "/" or "/ts-parameters", the application should redirect to "/f0"
**Validates: Requirements 4.4, 4.5**

### Property 6: Crossover calculator preservation
*For any* interaction with the crossover calculator, it should function identically to before the restructure
**Validates: Requirements 6.3, 6.4**

## Error Handling

### ルーティングエラー

1. **無効なパス**: 存在しないパスにアクセスした場合、404ページまたはデフォルトページ（F0計算）にリダイレクト
2. **旧パスの処理**: `/spl`や`/ts-parameters`などの旧パスは適切な新しいパスにリダイレクト

### 状態管理エラー

1. **コンテキスト未初期化**: CalculatorStateContextが利用できない場合のフォールバック処理
2. **無効な状態値**: 数値変換エラーや無効な入力値の処理

## Testing Strategy

### Unit Testing

1. **Navigation Menu Test**
   - 正しい数のメニュー項目が表示されることを確認
   - SPL計算メニュー項目が存在しないことを確認
   - 各メニュー項目が正しいパスにリンクしていることを確認

2. **Page Component Tests**
   - 各ページコンポーネントが正しくレンダリングされることを確認
   - 入力フィールドが正しく表示されることを確認
   - 計算結果が正しく表示されることを確認

3. **Routing Tests**
   - 各ルートが正しいコンポーネントをレンダリングすることを確認
   - リダイレクトが正しく機能することを確認
   - ブラウザの戻る/進むボタンが正しく機能することを確認

### Integration Testing

1. **State Persistence Test**
   - ページ間を移動しても入力値が保持されることを確認
   - 複数のページで同じパラメータを使用する場合、値が同期されることを確認

2. **End-to-End Navigation Test**
   - 全てのページに順番にアクセスできることを確認
   - 各ページで計算が正しく実行されることを確認

### Property-Based Testing

Property-based testingには**fast-check**ライブラリを使用します。各プロパティテストは最低100回の反復を実行します。

1. **Property Test for Navigation Menu**
   - **Feature: calculator-page-restructure, Property 1: Navigation menu completeness**
   - ナビゲーションメニューが常に正しい数のアイテムを含むことを検証

2. **Property Test for State Persistence**
   - **Feature: calculator-page-restructure, Property 3: State persistence across navigation**
   - ランダムなパラメータ値を入力し、ページ間を移動しても値が保持されることを検証

## Implementation Notes

### 実装の順序

1. **Phase 1**: 新しいページコンポーネントの作成
   - 各セクションを独立したページコンポーネントに抽出
   - 既存のセクションコンポーネントを再利用

2. **Phase 2**: ルーティングの更新
   - App.tsxに新しいルートを追加
   - リダイレクトルートを設定

3. **Phase 3**: ナビゲーションメニューの更新
   - NavigationMenu.tsxを更新して全ての計算ページを表示
   - SPL計算メニュー項目を削除

4. **Phase 4**: SPLCalculatorの削除
   - SPLCalculator.tsxファイルを削除
   - 関連するインポートを削除

5. **Phase 5**: TSParameterCalculatorの削除
   - TSParameterCalculator.tsxファイルを削除（全てのセクションが個別ページに移行したため）

### コンポーネント再利用戦略

既存のセクションコンポーネント（QmsCalculationSection、QtsCalculationSectionなど）は、新しいページコンポーネント内で再利用されます。これにより、コードの重複を避け、既存のロジックを保持できます。

```typescript
// 例: QmsCalculationPage
export const QmsCalculationPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6" role="main">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        Qms計算
      </h1>
      <QmsCalculationSection />
    </div>
  );
};
```

### アクセシビリティの考慮事項

- 各ページに適切な`<h1>`タイトルを設定
- ナビゲーションメニューに`aria-current="page"`を使用して現在のページを示す
- キーボードナビゲーションをサポート
- スクリーンリーダー用の適切なARIAラベルを維持

### レスポンシブデザインの考慮事項

- 既存のTailwind CSSクラスを使用してレスポンシブデザインを維持
- モバイルデバイスでのナビゲーションメニューの表示を最適化
- 各ページが小さい画面でも読みやすいことを確認

## Migration Strategy

1. **Phase 1**: 新しいページコンポーネントの作成（既存のコードを壊さない）
2. **Phase 2**: ルーティングとナビゲーションの更新
3. **Phase 3**: 旧コンポーネント（TSParameterCalculator、SPLCalculator）の削除
4. **Phase 4**: テストの実行と検証
5. **Phase 5**: デプロイ
