# Requirements Document

## Introduction

このドキュメントは、スピーカー計算機WEBアプリケーションのページ構造を再編成する要件を定義します。現在、TSパラメータ計算機は1つのページに全ての計算セクションが含まれており、また独立したSPL計算タブが存在します。この改善では、以下を実施します：

1. **SPL計算タブの削除**: 独立したSPL計算ページを削除
2. **TSパラメータ計算機の分割**: 各計算セクションを独立したページに分割
3. **クロスオーバー計算の維持**: クロスオーバーネットワーク計算は現状のまま維持

## Glossary

- **WEBアプリ**: 修正対象のスピーカー計算機WEBアプリケーション
- **TSパラメータ計算機**: スピーカーのThiele-Smallパラメータを計算する機能群
- **SPL計算**: 音圧レベル（Sound Pressure Level）を計算する機能
- **クロスオーバーネットワーク計算**: スピーカーシステムのクロスオーバー回路を設計する機能
- **計算セクション**: TSパラメータ計算機内の個別の計算機能（F0計算、Vas計算など）
- **ナビゲーションメニュー**: サイドバーに表示される計算機選択メニュー
- **CalculatorStateContext**: アプリケーション全体で計算パラメータを共有する状態管理コンテキスト

## Requirements

### Requirement 1: SPL計算タブの削除

**User Story:** As a ユーザー, I want a simplified navigation menu without the SPL calculator tab, so that I can focus on the reorganized TS parameter calculations

#### Acceptance Criteria

1. WHEN the WEBアプリ is loaded THEN the ナビゲーションメニュー SHALL NOT display the "SPL計算" menu item
2. WHEN a user navigates to /spl path THEN the WEBアプリ SHALL redirect to the default page
3. WHEN the WEBアプリ is displayed THEN the ナビゲーションメニュー SHALL only show "クロスオーバーネットワーク計算" and the new TS parameter calculation pages
4. WHEN the SPL calculator component is removed THEN the WEBアプリ SHALL maintain all SPL calculation functionality within the TS parameter pages

### Requirement 2: TSパラメータ計算機の個別ページ分割

**User Story:** As a ユーザー, I want each calculation section to be on its own page, so that I can focus on one calculation at a time without scrolling through a long page

#### Acceptance Criteria

1. WHEN the WEBアプリ is loaded THEN the ナビゲーションメニュー SHALL display separate menu items for each TS parameter calculation
2. WHEN a user clicks on a calculation menu item THEN the WEBアプリ SHALL navigate to that calculation's dedicated page
3. WHEN a calculation page is displayed THEN the WEBアプリ SHALL show only that specific calculation section
4. WHEN a user navigates between calculation pages THEN the WEBアプリ SHALL preserve all input values using CalculatorStateContext
5. WHEN a calculation page is displayed THEN the WEBアプリ SHALL show the page title indicating which calculation is being performed

### Requirement 3: 計算ページの構成

**User Story:** As a ユーザー, I want clear organization of calculation pages, so that I can easily find and use the calculation I need

#### Acceptance Criteria

1. WHEN the ナビゲーションメニュー is displayed THEN the WEBアプリ SHALL show the following calculation pages in order:
   - F0計算
   - 空気負荷質量の計算
   - 入力電圧計算
   - Vas計算
   - Qes計算
   - Qms計算
   - Qts計算
   - 振幅の計算
   - 音圧の計算
   - 低音域音圧計算とグラフ表示
   - 薄膜パターンの抵抗値計算
   - ドイツのXmax計算
   - 開管の気中共鳴周波数計算
   - クロスオーバーネットワーク計算
2. WHEN each calculation page is displayed THEN the WEBアプリ SHALL show a descriptive title for that calculation
3. WHEN a calculation page requires input from another calculation THEN the WEBアプリ SHALL display the dependent value as a read-only result reference

### Requirement 4: ルーティングとナビゲーション

**User Story:** As a ユーザー, I want intuitive URL paths for each calculation, so that I can bookmark and share specific calculations

#### Acceptance Criteria

1. WHEN a user navigates to a calculation page THEN the WEBアプリ SHALL update the URL to reflect the current calculation
2. WHEN a user bookmarks a calculation page URL THEN the WEBアプリ SHALL load that specific calculation when the bookmark is accessed
3. WHEN a user uses browser back/forward buttons THEN the WEBアプリ SHALL navigate between calculation pages correctly
4. WHEN the root path "/" is accessed THEN the WEBアプリ SHALL redirect to the first calculation page (F0計算)
5. WHEN the old "/ts-parameters" path is accessed THEN the WEBアプリ SHALL redirect to the first calculation page (F0計算)

### Requirement 5: 状態管理の継続性

**User Story:** As a ユーザー, I want my input values to persist across all calculation pages, so that I don't need to re-enter values when switching between calculations

#### Acceptance Criteria

1. WHEN a user enters a value on any calculation page THEN the WEBアプリ SHALL store it in CalculatorStateContext
2. WHEN a user navigates to a different calculation page THEN the WEBアプリ SHALL preserve all previously entered values
3. WHEN a calculation page uses a parameter that was entered on another page THEN the WEBアプリ SHALL automatically use that value
4. WHEN a user refreshes the browser THEN the WEBアプリ SHALL restore all input values from CalculatorStateContext
5. WHEN multiple calculation pages use the same parameter THEN the WEBアプリ SHALL ensure the value is synchronized across all pages

### Requirement 6: クロスオーバーネットワーク計算の維持

**User Story:** As a ユーザー, I want the crossover network calculator to remain unchanged, so that I can continue using it as before

#### Acceptance Criteria

1. WHEN the ナビゲーションメニュー is displayed THEN the WEBアプリ SHALL show "クロスオーバーネットワーク計算" as a menu item
2. WHEN a user clicks on "クロスオーバーネットワーク計算" THEN the WEBアプリ SHALL navigate to the crossover calculator page
3. WHEN the crossover calculator page is displayed THEN the WEBアプリ SHALL show the same functionality as before the restructure
4. WHEN the crossover calculator is used THEN the WEBアプリ SHALL maintain all existing features and calculations

### Requirement 7: レスポンシブデザインの維持

**User Story:** As a ユーザー, I want the new page structure to work well on all devices, so that I can use the calculator on desktop, tablet, and mobile

#### Acceptance Criteria

1. WHEN the WEBアプリ is displayed on any device THEN the ナビゲーションメニュー SHALL be accessible and usable
2. WHEN a calculation page is displayed on mobile THEN the WEBアプリ SHALL show the content in a readable format
3. WHEN a user interacts with input fields on any device THEN the WEBアプリ SHALL provide appropriate touch/click targets
4. WHEN the ナビゲーションメニュー is displayed on mobile THEN the WEBアプリ SHALL provide a collapsible or scrollable menu if needed

### Requirement 8: アクセシビリティの維持

**User Story:** As a ユーザー with accessibility needs, I want the new page structure to maintain accessibility features, so that I can navigate and use the calculator effectively

#### Acceptance Criteria

1. WHEN a user navigates with keyboard THEN the WEBアプリ SHALL allow navigation between menu items and input fields
2. WHEN a screen reader is used THEN the WEBアプリ SHALL announce page titles and navigation changes
3. WHEN a calculation page is displayed THEN the WEBアプリ SHALL maintain proper ARIA labels and roles
4. WHEN focus moves between elements THEN the WEBアプリ SHALL provide visible focus indicators
