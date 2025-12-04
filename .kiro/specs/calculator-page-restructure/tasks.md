# Implementation Plan

- [x] 1. ページ構造の再編成とコンポーネント作成





  - 新しいページコンポーネントの作成
    - src/components/calculators/pages/ディレクトリを作成
    - F0計算ページ（F0CalculationPage.tsx）を作成
    - 空気負荷質量計算ページ（AirLoadMassPage.tsx）を作成
    - 入力電圧計算ページ（InputVoltagePage.tsx）を作成
    - Vas計算ページ（VasCalculationPage.tsx）を作成
    - Qes計算ページ（QesCalculationPage.tsx）を作成
    - Qms計算ページ（QmsCalculationPage.tsx）を作成
    - Qts計算ページ（QtsCalculationPage.tsx）を作成
    - 振幅計算ページ（AmplitudeCalculationPage.tsx）を作成
    - 音圧計算ページ（SPLCalculationPage.tsx）を作成
    - 低音域音圧計算ページ（FrequencyResponsePage.tsx）を作成
    - 薄膜パターンの抵抗値計算ページ（ThinFilmResistancePage.tsx）を作成
    - ドイツのXmax計算ページ（XmaxCalculationPage.tsx）を作成
    - 開管の気中共鳴周波数計算ページ（OpenTubeResonancePage.tsx）を作成
    - ページコンポーネントのインデックスファイル（index.ts）を作成
  - ルーティングの更新
    - App.tsxを更新して新しいページコンポーネントへのルートを追加
    - リダイレクトルートを設定（/と/ts-parametersを/f0にリダイレクト）
    - SPLCalculatorへのルートを削除
  - ナビゲーションメニューの更新
    - NavigationMenu.tsxのcalculators配列を更新
    - 全てのTSパラメータ計算ページを個別のメニュー項目として追加
    - SPL計算メニュー項目を削除
    - クロスオーバーネットワーク計算を維持
  - 旧コンポーネントの削除
    - SPLCalculator.tsxを削除
    - TSParameterCalculator.tsxを削除
    - src/components/calculators/index.tsから削除されたコンポーネントのエクスポートを削除
  - 構文チェック
    - TypeScriptの構文エラーがないことを確認
    - インポート/エクスポートが正しいことを確認
    - コンポーネントの基本的な構造が正しいことを確認
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.5, 3.1, 3.2, 4.1, 4.2, 4.3, 4.4, 4.5, 6.1_
-

- [x] 2. 最終確認とバグ修正




  - コードレビュー
    - 全てのページコンポーネントが正しく作成されていることを確認
    - ルーティングが正しく設定されていることを確認
    - ナビゲーションメニューが正しく更新されていることを確認
    - 旧コンポーネントが削除されていることを確認
  - 構文とコードの基本的なチェック
    - TypeScriptエラーがないことを確認
    - インポートパスが正しいことを確認
    - コンポーネントの命名規則が一貫していることを確認
  - バグ修正
    - 発見された問題を修正
    - 再度確認
  - _Requirements: 全て_
