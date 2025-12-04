# Implementation Plan

- [x] 1. 全セクションの入力フィールド追加と不具合修正


  - 既存コードの調査と確認
    - 全ての対象セクションコンポーネントを確認（InputVoltageSection, AirLoadMassSection, VasCalculationSection, QesCalculationSection, AmplitudeCalculationSection）
    - CalculatorStateContextの確認（re, power, airDensity, effectiveRadius, soundSpeed, kms, mms, bl）
    - パラメータの共有状況を確認
    - 振幅計算セクションの不具合を調査（disabled/readOnly属性、イベントハンドラ）
  - TSParameterCalculatorの修正
    - 「その他のパラメータ」セクションを削除
  - F0CalculationSectionの確認と修正
    - Mms入力フィールドを確認・追加（単位: g）
    - Kms入力フィールドを確認・追加（単位: N/mm）
  - InputVoltageSectionの修正
    - Re入力フィールドを追加（単位: Ω）
    - P入力フィールドを追加（単位: W）
    - 計算ロジックの確認（V = sqrt(Re × P)）
  - AirLoadMassSectionの修正
    - ρ入力フィールドを追加（単位: kg/m³、デフォルト: 1.29）
    - a入力フィールドを追加（単位: mm）
    - 計算ロジックの確認（Mair_free, Mair_baffle）
  - VasCalculationSectionの修正
    - ρ入力フィールドを追加（単位: kg/m³、デフォルト: 1.29）
    - c入力フィールドを追加（単位: m/s、デフォルト: 346.1）
    - a入力フィールドを追加（単位: mm）
    - Kms入力フィールドを追加（単位: N/mm）
    - 計算ロジックの確認（Vas = ρ × c² × π × a² / Kms）
  - QesCalculationSectionの修正
    - Re入力フィールドを追加（単位: Ω）
    - Mms入力フィールドを追加（単位: g）
    - Bl入力フィールドを追加（単位: N/A）
    - 計算ロジックの確認（Qes = 2π × F0 × Re × Mms / Bl²）
  - 振幅計算セクションの入力フィールド編集不具合の修正
    - AmplitudeCalculationSectionの全ての入力フィールドからdisabled/readOnly属性を削除
    - onChange/onInputイベントハンドラが正しく状態を更新することを確認
    - 入力フィールドの動作を確認（フォーカス、選択、編集、複数回の編集）
  - 入力検証の実装
    - 数値検証を追加（全パラメータ）
    - 正の値チェックを追加
    - エラーハンドリング
  - 状態管理の確認
    - 状態の永続化を確認
    - リアクティブ計算を確認
  - パラメータの同期確認
    - Re, P, ρ, a, c, Kms, Mms, Blの各パラメータが複数のセクション間で正しく同期されることを確認
  - _Requirements: 0.1-0.5, 1.1-1.5, 2.1-2.4, 3.1-3.6, 4.1-4.7, 5.1-5.6, 6.1-6.5, 7.1-7.16_

- [x] 2. 最終確認とバグ修正


  - ローカルでの動作確認
    - 「その他のパラメータ」セクションが削除されていることを確認
    - 各計算セクションに必要な入力フィールドが表示されることを確認
    - 全ての計算が正しく動作することを確認
    - パラメータの同期が正しく動作することを確認
    - 振幅計算セクションの入力フィールドが編集可能であることを確認（複数回の編集をテスト）
    - エラーハンドリングが正しく動作することを確認
  - バグ修正
    - 発見された不具合を修正
    - 再度動作確認
  - _Requirements: 0.1-0.5, 1.1-6.5_

- [ ] 3. ビルドとデプロイ




  - ビルド確認
    - ビルドエラーがないことを確認
    - TypeScriptエラーがないことを確認
  - Netlifyへのデプロイ
    - Gitでコミット
    - Netlifyにプッシュ
    - デプロイ後の動作確認
  - ユーザーに確認を依頼
    - 全ての不具合が修正されたことを確認
    - 新しい機能が正しく動作することを確認
