# いろいろ計算シート

スピーカーおよびヘッドホン設計において必要となる各種計算を実行するWEBアプリケーション。

A comprehensive web application for speaker and headphone design calculations, built with React, TypeScript, and Vite.

## セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn

### インストール

```bash
npm install
```

## 開発

### 開発サーバーの起動

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

### プレビュー

```bash
npm run preview
```

## テスト

### テストの実行

```bash
npm test
```

### テストのウォッチモード

```bash
npm run test:watch
```

## 技術スタック

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Testing**: Vitest + React Testing Library
- **Property-Based Testing**: fast-check

## プロジェクト構造

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
└── test/               # テストセットアップ
```

## 計算機モジュール

### 1. TSParameterCalculator - TSパラメータ計算

包括的なスピーカーパラメータ計算機能を提供：

#### 基本パラメータ計算
- **共振周波数 (F0)**: スピーカーの自然共振周波数を計算
- **等価コンプライアンス容積 (Vas)**: スピーカーのコンプライアンスを等価な空気容積で表現
- **電気的Q値 (Qes)**: 電気的損失を表すQ値
- **機械的Q値 (Qms)**: 機械的損失を表すQ値（新機能）
- **総合Q値 (Qts)**: QesとQmsを組み合わせた総合的なQ値（新機能）
- 空気負荷質量、入力電圧計算

#### 音響計算（新機能）
- **振幅計算**: SPL、空気密度、有効半径、周波数から振動板の振幅を計算
- **音圧計算**: スピーカーパラメータから音圧レベル (SPL) を計算
- **周波数応答**: 10Hz～20kHzの周波数応答をグラフとテーブルで表示
  - 標準周波数ポイント（32ポイント）での詳細な応答
  - 対数スケールのグラフ表示

#### 機械設計計算（新機能）
- **Xmax計算**: ドイツ方式によるスピーカーの最大線形振幅を計算
- **薄膜パターン抵抗値**: 薄膜抵抗パターンの抵抗値を計算（体積抵抗率、線幅、線厚、線長から）

#### 音響共鳴計算（新機能）
- **開管共鳴周波数**: 開管の気中共鳴周波数を計算（基本波、2倍波、3倍波）

### 2. SPLCalculator - 音圧レベル計算
- 総合Q値 (Qts)、音圧、dB SPL変換
- 周波数応答計算

### 3. CrossoverNetworkCalculator - クロスオーバーネットワーク計算
- 1次～4次フィルター対応
- 7種類のフィルタータイプ (Butterworth, Linkwitz-Riley, Bessel, Chebychev, Legendre, Gaussian, Linear-Phase)

## 使用方法

### TSパラメータ計算機の使い方

1. **基本パラメータの入力**
   - Mms（振動系質量）、Kms（機械的スティフネス）、Re（DC抵抗）、Bl（力係数）などの基本パラメータを入力
   - 各入力フィールドにはヘルプツールチップが付いており、パラメータの説明を確認できます

2. **Q値の計算**
   - Rms（機械的抵抗）を入力すると、Qms（機械的Q値）が自動計算されます
   - Qes（電気的Q値）とQmsから、Qts（総合Q値）が自動的に計算されます

3. **音響特性の計算**
   - SPL、空気密度、有効半径、周波数を入力して振幅を計算
   - スピーカーパラメータから音圧レベル（SPL）を予測
   - 周波数応答グラフで10Hz～20kHzの特性を視覚的に確認

4. **機械設計の検証**
   - VC巻き幅とplate厚さからXmax（最大線形振幅）を計算
   - 薄膜パターンの寸法から抵抗値を計算

5. **音響共鳴の計算**
   - 音速と管長から開管の共鳴周波数（基本波、2倍波、3倍波）を計算

### 入力値の永続化

- 入力した値はブラウザのセッション中保持されます
- ページをリロードしても、入力値は失われません
- 計算機間を移動しても、各計算機の状態は保持されます

## 主な特徴

- ✅ **レスポンシブデザイン**: モバイル、タブレット、デスクトップに対応
- ✅ **リアクティブ計算**: 入力変更時に自動的に再計算
- ✅ **状態保持**: 計算機間の移動時も入力値を保持
- ✅ **入力検証**: 数値検証とエラーメッセージ表示
- ✅ **数式表示**: 計算式と変数定義の表示
- ✅ **ヘルプツールチップ**: 全ての入力フィールドに説明付き
- ✅ **周波数応答グラフ**: インタラクティブなグラフ表示（Recharts使用）
- ✅ **アクセシビリティ**: キーボードナビゲーション、スクリーンリーダー対応

## テストカバレッジ

- **Property-Based Tests**: 17 correctness properties (100+ iterations each)
- **Integration Tests**: Complete user workflows and navigation
- **Unit Tests**: Individual components and functions

詳細は以下のドキュメントを参照:
- [Property Test Summary](./PROPERTY_TEST_SUMMARY.md)
- [Integration Test Summary](./INTEGRATION_TEST_SUMMARY.md)
- [Build and Deployment Guide](./BUILD_AND_DEPLOYMENT.md)
- [Final Verification Checklist](./FINAL_VERIFICATION_CHECKLIST.md)

## ドキュメント

### 初期実装
- [Requirements Document](./.kiro/specs/speaker-calculator-webapp/requirements.md) - 要件定義
- [Design Document](./.kiro/specs/speaker-calculator-webapp/design.md) - 設計書
- [Tasks Document](./.kiro/specs/speaker-calculator-webapp/tasks.md) - 実装タスク

### TSパラメータ拡張機能
- [Requirements Document](./.kiro/specs/ts-parameter-qms-enhancement/requirements.md) - Qms/Qts計算、音響計算、機械設計計算の要件
- [Design Document](./.kiro/specs/ts-parameter-qms-enhancement/design.md) - 拡張機能の設計書
- [Tasks Document](./.kiro/specs/ts-parameter-qms-enhancement/tasks.md) - 実装タスク

## ライセンス

Private
