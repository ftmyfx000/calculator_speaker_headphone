# Implementation Plan

- [x] 1. プロジェクトのセットアップと依存関係の追加





  - Rechartsライブラリをインストール（グラフ描画用）
  - fast-checkライブラリをインストール（Property-based testing用）
  - package.jsonを更新
  - _Requirements: 5.4, Testing Strategy_

- [x] 2. 型定義の拡張



  - [x] 2.1 TSParameterStateインターフェースを拡張


    - rms, spl, frequency, micDistance, inputVoltageフィールドを追加
    - 薄膜パターン用フィールド（volumeResistivity, lineWidth, lineThickness, lineLength）を追加
    - Xmax計算用フィールド（vcWindingWidth, plateThickness）を追加
    - 開管共鳴用フィールド（soundSpeed, tubeLength）を追加
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 6.1, 7.1, 8.1_

  - [x] 2.2 新しい型定義ファイルを作成


    - src/lib/types/amplitude.ts を作成
    - src/lib/types/spl-advanced.ts を作成
    - src/lib/types/thin-film.ts を作成
    - src/lib/types/xmax.ts を作成
    - src/lib/types/resonance.ts を作成
    - FrequencyResponsePoint, FrequencyResponseData型を定義
    - _Requirements: 5.3, 6.1, 7.1, 8.1_


- [x] 3. CalculatorStateContextの拡張



  - [x] 3.1 defaultTSParameterStateを更新


    - 新しいフィールドのデフォルト値を設定
    - soundSpeedのデフォルト値を346.1に設定
    - airDensityのデフォルト値を1.29に設定
    - _Requirements: 10.1, 10.2_

  - [x] 3.2 状態更新関数を確認


    - updateTSParameterStateが新しいフィールドを正しく処理することを確認
    - _Requirements: 10.1, 10.4_

- [x] 4. 計算関数の実装





  - [x] 4.1 Qms計算関数を実装


    - src/lib/calculations/ts-parameters.ts に calculateQms 関数を追加
    - 数式: Qms = 2π × F0 × Mms / Rms
    - Mmsをgからkgに変換
    - _Requirements: 1.1, 1.2_

  - [x] 4.2 Qts計算関数を実装


    - src/lib/calculations/ts-parameters.ts に calculateQts 関数を追加
    - 数式: Qts = (Qes × Qms) / (Qes + Qms)
    - _Requirements: 2.3_

  - [x] 4.3 振幅計算関数を実装


    - src/lib/calculations/amplitude.ts を作成
    - calculateAmplitude 関数を実装
    - 数式: amplitude = 2√2 × P0 × 10^(SPL/20) / (4π² × f² × ρ × a²)
    - P0 = 2×10^(-5) Pa
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 4.4 高度なSPL計算関数を実装


    - src/lib/calculations/spl-advanced.ts を作成
    - calculateAdvancedSPL 関数を実装
    - Qts, sec2, sec3の中間計算を含む
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 4.5 周波数応答計算関数を実装


    - src/lib/calculations/spl-advanced.ts に calculateFrequencyResponse 関数を追加
    - 標準周波数ポイントの配列を定義
    - 各周波数でSPLを計算
    - _Requirements: 5.1, 5.2_

  - [x] 4.6 薄膜抵抗計算関数を実装


    - src/lib/calculations/thin-film.ts を作成
    - calculateThinFilmResistance 関数を実装
    - 数式: R = ρ × L / (W × T)
    - 単位変換（mm → m）を含む
    - _Requirements: 6.1, 6.3_

  - [x] 4.7 Xmax計算関数を実装


    - src/lib/calculations/xmax.ts を作成
    - calculateXmax 関数を実装
    - 数式: Xmax = (VC巻き幅 - plate厚さ) / 2
    - _Requirements: 7.1, 7.2_

  - [x] 4.8 開管共鳴周波数計算関数を実装


    - src/lib/calculations/resonance.ts を作成
    - calculateOpenTubeResonance 関数を実装
    - 数式: f_n = n × c / (2 × L)
    - 基本波、2倍波、3倍波を計算
    - _Requirements: 8.1, 8.2, 8.3_
-

- [x] 5. 共通コンポーネントの実装



  - [x] 5.1 FrequencyResponseChartコンポーネントを作成


    - src/components/common/FrequencyResponseChart.tsx を作成
    - Rechartsを使用してグラフを描画
    - 対数スケールのX軸（周波数）
    - 線形スケールのY軸（SPL in dB）
    - グリッド線とツールチップを追加
    - レスポンシブデザイン
    - _Requirements: 5.4, 5.5_



- [x] 6. 計算セクションコンポーネントの実装




  - [x] 6.1 QmsCalculationSectionを作成


    - src/components/calculators/sections/QmsCalculationSection.tsx を作成
    - F0, Mms, Rmsの入力フィールド（コンテキストから取得）
    - Qms計算結果の表示
    - 数式の表示（FormulaDisplay使用）
    - ヘルプツールチップの追加
    - _Requirements: 1.1, 1.3, 1.4, 1.5, 11.1, 11.2_

  - [x] 6.2 QtsCalculationSectionを作成


    - src/components/calculators/sections/QtsCalculationSection.tsx を作成
    - Re, Bl, Rms, F0, Mmsの入力フィールド
    - Qes, Qms, Qts計算結果の表示
    - 数式の表示
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 6.3 AmplitudeCalculationSectionを作成


    - src/components/calculators/sections/AmplitudeCalculationSection.tsx を作成
    - SPL, airDensity, effectiveRadius, frequencyの入力フィールド
    - 振幅計算結果の表示（mとmmの両方）
    - 数式の表示
    - _Requirements: 3.1, 3.4, 3.5_

  - [x] 6.4 SPLCalculationSectionを作成


    - src/components/calculators/sections/SPLCalculationSection.tsx を作成
    - 必要な全ての入力フィールド
    - SPL計算結果の表示
    - 中間計算結果（Qts, sec2, sec3）の表示
    - 数式の表示
    - _Requirements: 4.1, 4.5_

  - [x] 6.5 FrequencyResponseSectionを作成


    - src/components/calculators/sections/FrequencyResponseSection.tsx を作成
    - 周波数応答テーブルの表示（FREQ, x=f/f0, P音圧, P dB）
    - FrequencyResponseChartコンポーネントを統合
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 6.6 ThinFilmResistanceSectionを作成


    - src/components/calculators/sections/ThinFilmResistanceSection.tsx を作成
    - volumeResistivity, lineWidth, lineThickness, lineLengthの入力フィールド
    - 抵抗値計算結果の表示
    - 科学的記数法の入力サポート
    - _Requirements: 6.1, 6.2, 6.4, 6.5_

  - [x] 6.7 XmaxCalculationSectionを作成


    - src/components/calculators/sections/XmaxCalculationSection.tsx を作成
    - vcWindingWidth, plateThicknessの入力フィールド
    - Xmax計算結果の表示
    - _Requirements: 7.1, 7.3, 7.4_

  - [x] 6.8 OpenTubeResonanceSectionを作成


    - src/components/calculators/sections/OpenTubeResonanceSection.tsx を作成
    - soundSpeed, tubeLengthの入力フィールド
    - 基本波、2倍波、3倍波の共鳴周波数を表示
    - _Requirements: 8.1, 8.4, 8.5_
-

- [x] 7. TSParameterCalculatorの拡張




  - [x] 7.1 TSParameterCalculatorに新しいセクションを統合


    - 既存のセクションを維持
    - 新しいセクションコンポーネントをインポート
    - Excelのレイアウトに合わせてセクションを配置
    - セクション間のスペーシングを調整
    - _Requirements: 9.1, 9.2, 9.3, 9.5_

  - [x] 7.2 レスポンシブデザインの確認


    - モバイル、タブレット、デスクトップでのレイアウトを確認
    - グリッドレイアウトの調整
    - _Requirements: 9.4_

- [x] 8. エラーハンドリングの実装




  - [x] 8.1 入力検証の実装


    - 数値検証（非数値入力の処理）
    - 範囲検証（周波数、SPL、空気密度など）
    - ゼロ除算チェック
    - _Requirements: 1.3, 2.5_

  - [x] 8.2 エラー表示の実装


    - 無効な入力に対するエラーメッセージ
    - 計算失敗時のメッセージ
    - グラフ描画エラーの処理
    - _Requirements: 1.3, 2.5_
-

- [x] 9. 状態の永続化とリアクティブ計算



  - [x] 9.1 状態の永続化を確認


    - CalculatorStateContextが新しいフィールドを正しく保存することを確認
    - _Requirements: 10.1, 10.2, 10.3_

  - [x] 9.2 リアクティブ計算の実装


    - useEffectで依存配列を適切に設定
    - 入力値変更時の自動再計算を確認
    - _Requirements: 10.4_
-

- [x] 10. ヘルプツールチップの追加



  - [x] 10.1 全ての新しい入力フィールドにツールチップを追加

    - Rms: "機械的抵抗。スピーカーの振動系における機械的損失を表します。"
    - SPL: "音圧レベル。音の大きさを表す指標です。"
    - その他のパラメータにも適切な説明を追加
    - _Requirements: 11.1, 11.2, 11.3_
-

- [x] 11. パフォーマンス最適化




  - [x] 11.1 計算結果のメモ化


    - useMemoで複雑な計算結果をメモ化
    - 周波数応答データのメモ化
    - _Requirements: Performance Considerations_

  - [x] 11.2 Rechartsの動的インポート


    - React.lazyでFrequencyResponseChartを遅延ロード
    - Suspenseでローディング状態を処理
    - _Requirements: Performance Considerations_
-

- [x] 12. アクセシビリティの改善



  - [x] 12.1 セマンティックHTMLの使用


    - 適切なsection, h2, h3タグを使用
    - ARIAラベルの追加
    - _Requirements: Accessibility_

  - [x] 12.2 キーボードナビゲーションの確認


    - Tab順序の確認
    - フォーカスインジケーターの確認
    - _Requirements: Accessibility_
-

- [x] 13. ドキュメントの更新




  - [x] 13.1 README.mdの更新


    - 新機能の説明を追加
    - 使用方法の説明を追加


  - [x] 13.2 コンポーネントのJSDocコメントを追加

    - 各コンポーネントの説明
    - プロパティの説明
-

- [-] 14. 最終チェックポイント - Netlifyでのビルド確認


  - GitでコミットしてNetlifyにプッシュ
  - Netlifyのビルドログで問題がないことを確認
  - デプロイされたアプリで動作確認
  - ユーザーに質問があれば確認
