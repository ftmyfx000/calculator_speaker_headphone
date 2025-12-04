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

1. **TSParameterCalculator** - TSパラメータ計算
   - 共振周波数 (F0)、等価コンプライアンス容積 (Vas)、電気的Q値 (Qes)
   - 空気負荷質量、入力電圧計算

2. **SPLCalculator** - 音圧レベル計算
   - 総合Q値 (Qts)、音圧、dB SPL変換
   - 周波数応答計算

3. **CrossoverNetworkCalculator** - クロスオーバーネットワーク計算
   - 1次～4次フィルター対応
   - 7種類のフィルタータイプ (Butterworth, Linkwitz-Riley, Bessel, Chebychev, Legendre, Gaussian, Linear-Phase)

## 主な特徴

- ✅ **レスポンシブデザイン**: モバイル、タブレット、デスクトップに対応
- ✅ **リアクティブ計算**: 入力変更時に自動的に再計算
- ✅ **状態保持**: 計算機間の移動時も入力値を保持
- ✅ **入力検証**: 数値検証とエラーメッセージ表示
- ✅ **数式表示**: 計算式と変数定義の表示
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

- [Requirements Document](./.kiro/specs/speaker-calculator-webapp/requirements.md) - 要件定義
- [Design Document](./.kiro/specs/speaker-calculator-webapp/design.md) - 設計書
- [Tasks Document](./.kiro/specs/speaker-calculator-webapp/tasks.md) - 実装タスク

## ライセンス

Private
