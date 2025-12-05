# Implementation Plan: Box Volume Calculator

## Step 1: 必要な機能のすべての実装

- [x] 1. 型定義とデータモデルの作成





  - `src/lib/types/box-volume.ts` を作成
  - InternalDimensionInput, ExternalDimensionInput インターフェースを定義
  - BoxDimensions, VolumeData, DimensionalRatio インターフェースを定義
  - AxialModeFrequencies, CompositeModeFrequency, StandingWaveFrequencies インターフェースを定義
  - BoxVolumeResults インターフェースを定義
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.5, 3.1, 3.2, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3_

- [x] 2. 計算ロジックの実装





- [x] 2.1 基本計算関数の実装


  - `src/lib/calculations/box-volume.ts` を作成
  - `calculateDimensionalRatio` 関数を実装（寸法比率の計算）
  - `calculateCompositeMode` 関数を実装（複合モード周波数の計算）
  - 音速定数 (343 m/s) を定義
  - _Requirements: 3.1, 3.2, 3.3, 5.1, 5.2, 4.6_

- [x] 2.2 Property test for dimensional ratio scale invariance


  - **Property 4: Dimensional ratio scale invariance**
  - **Validates: Requirements 3.1, 3.2**

- [x] 2.3 定在波周波数計算の実装


  - `calculateStandingWaveFrequencies` 関数を実装
  - 軸方向の定在波周波数（次数1-3）を計算
  - 29種類の複合モード周波数を計算
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4_


- [x] 2.4 Property test for axial frequency ordering

  - **Property 5: Axial frequency ordering**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

- [x] 2.5 Property test for composite mode frequency calculation


  - **Property 6: Composite mode frequency calculation**
  - **Validates: Requirements 5.1, 5.2**

- [x] 2.6 内寸から外寸への計算実装


  - `calculateFromInternalDimensions` 関数を実装
  - 外寸 = 内寸 + 2×板厚 の計算
  - 容積計算（cm³とリットル）
  - 寸法比率の計算
  - 定在波周波数の計算を呼び出し
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2.7 Property test for external dimension calculation consistency


  - **Property 1: External dimension calculation consistency**
  - **Validates: Requirements 1.1, 1.2, 1.3**

- [x] 2.8 Property test for volume calculation consistency


  - **Property 3: Volume calculation consistency**
  - **Validates: Requirements 1.4, 1.5, 2.5**

- [x] 2.9 外寸から内寸への計算実装


  - `calculateFromExternalDimensions` 関数を実装
  - 内寸 = 外寸 - 2×板厚 の計算
  - 板厚バリデーション（板厚 < 外寸の半分）
  - 容積計算（cm³とリットル）
  - 寸法比率の計算
  - 定在波周波数の計算を呼び出し
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2.10 Property test for internal dimension calculation consistency


  - **Property 2: Internal dimension calculation consistency**
  - **Validates: Requirements 2.1, 2.2, 2.3**

- [x] 2.11 Property test for panel thickness validation


  - **Property 7: Panel thickness validation**
  - **Validates: Requirements 2.4**

- [x] 2.12 Property test for positive dimension validation


  - **Property 8: Positive dimension validation**
  - **Validates: Requirements 7.1**

- [x] 3. バリデーション機能の実装





  - `src/lib/validation/box-volume-validation.ts` を作成
  - 正の数値チェック関数を実装
  - 板厚バリデーション関数を実装
  - エラーメッセージ定義
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 4. UIコンポーネントの実装




- [x] 4.1 ページコンポーネントの基本構造


  - `src/components/calculators/pages/BoxVolumeCalculatorPage.tsx` を作成
  - 計算モード選択UI（内寸/外寸）を実装
  - ローカルステート管理を実装
  - モード切り替え時の板厚保持ロジックを実装
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 4.2 Property test for mode selector state preservation


  - **Property 9: Mode selector state preservation**
  - **Validates: Requirements 6.4**

- [x] 4.3 入力フィールドの実装

  - 内寸モード用の入力フィールド（幅、高さ、奥行き、板厚）
  - 外寸モード用の入力フィールド（幅、高さ、奥行き、板厚）
  - 数値入力バリデーション
  - エラーメッセージ表示
  - _Requirements: 6.2, 6.3, 7.1, 7.2, 7.3, 7.5_

- [x] 4.4 計算結果表示の実装

  - 寸法表示セクション（内寸・外寸）
  - 容積表示（cm³とリットル）
  - 寸法比率表示（内寸・外寸）
  - 基本モード周波数表示（3軸×3次数）
  - 複合モード周波数テーブル表示（29種類）
  - 周波数の小数点1桁フォーマット
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 5.4_
-

- [x] 5. アプリケーション統合




  - `src/App.tsx` にBOX容積計算ページのルートを追加
  - ナビゲーションメニューに「BOX容積計算」を追加
  - 日本語ラベルとアイコンを設定
  - _Requirements: 全般_
-

- [x] 6. Checkpoint - すべてのテストが通ることを確認




  - すべてのテストが通ることを確認し、問題があればユーザーに質問する

## Step 2: 構文チェック (node.js、npm、npxは使用しない)

- [x] 7. TypeScript構文チェック




  - TypeScriptコンパイラで型エラーがないことを確認
  - getDiagnosticsツールを使用して全ファイルをチェック
  - エラーがあれば修正

- [x] 8. 実装の最終確認





  - すべての要件が実装されていることを確認
  - 計算式が仕様通りであることを確認
  - UIが正しく表示されることを確認

## Step 3: Git Desktop経由でNetlifyにプッシュとデプロイ
-

- [x] 9. デプロイ準備の確認




  - ビルドエラーがないことを最終確認
  - 変更ファイルのリストを確認
  - コミットメッセージの準備
-

- [x] 10. Git操作とデプロイ





  - Git Desktopで変更をステージング
  - 「BOX容積計算機能を追加」というコミットメッセージでコミット
  - mainブランチにプッシュ
  - Netlifyの自動デプロイを確認
  - デプロイ完了後、本番環境で動作確認
