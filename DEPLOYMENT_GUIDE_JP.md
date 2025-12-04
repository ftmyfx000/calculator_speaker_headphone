# デプロイガイド（日本語）

## 現在の状況

スピーカー計算WEBアプリケーションの実装が完了しました。
デプロイするには、以下のいずれかの方法を選択してください。

## 方法1: GitHub + Netlify（最も簡単・推奨）

### ステップ1: GitHubリポジトリを作成

1. https://github.com にアクセス
2. 「New repository」をクリック
3. リポジトリ名を入力（例: speaker-calculator）
4. 「Create repository」をクリック

### ステップ2: コードをGitHubにプッシュ

コマンドプロンプトで以下を実行：

```bash
git init
git add .
git commit -m "Initial commit: Speaker Calculator Web App"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/speaker-calculator.git
git push -u origin main
```

### ステップ3: Netlifyでデプロイ

1. https://www.netlify.com にアクセス
2. 「Sign up」でGitHubアカウントでログイン
3. 「Add new site」→「Import an existing project」
4. GitHubを選択し、作成したリポジトリを選択
5. ビルド設定を確認：
   - Build command: `npm run build`
   - Publish directory: `dist`
6. 「Deploy site」をクリック

数分後、アプリケーションが公開されます！

## 方法2: GitHub + Vercel

### ステップ1-2: 上記と同じ（GitHubリポジトリ作成とプッシュ）

### ステップ3: Vercelでデプロイ

1. https://vercel.com にアクセス
2. 「Sign up」でGitHubアカウントでログイン
3. 「Add New」→「Project」
4. GitHubリポジトリを選択
5. Vercelが自動的にViteプロジェクトを検出
6. 「Deploy」をクリック

数分後、アプリケーションが公開されます！

## 方法3: ローカルでビルドしてデプロイ

### 前提条件

Node.jsのインストールが必要です。

#### Node.jsのインストール方法

1. https://nodejs.org/ にアクセス
2. 「LTS」版（推奨版）をダウンロード
3. インストーラーを実行
4. コマンドプロンプトを再起動
5. 確認：`node --version` と `npm --version` を実行

### ビルド手順

```bash
# 1. 依存関係のインストール
npm install

# 2. テストの実行（オプション）
npm test

# 3. プロダクションビルド
npm run build

# 4. ローカルでプレビュー
npm run preview
```

ビルドが成功すると、`dist/` フォルダに以下のファイルが生成されます：
- index.html
- assets/ フォルダ（JavaScript、CSSファイル）

### dist/フォルダのデプロイ

生成された `dist/` フォルダの内容を以下のいずれかにアップロード：

- **Netlify Drop**: https://app.netlify.com/drop にdistフォルダをドラッグ&ドロップ
- **Vercel CLI**: `npx vercel --prod`
- **GitHub Pages**: リポジトリ設定でGitHub Pagesを有効化
- **AWS S3**: S3バケットにアップロードし、静的ウェブサイトホスティングを有効化

## 推奨デプロイ方法

**初心者向け**: 方法1（GitHub + Netlify）
- 最も簡単
- 自動ビルド・デプロイ
- 無料プランで十分
- HTTPSが自動で有効
- カスタムドメイン設定可能

**開発者向け**: 方法3（ローカルビルド）
- ビルドプロセスを完全にコントロール
- デプロイ前にローカルでテスト可能
- 様々なホスティングサービスに対応

## デプロイ後の確認事項

デプロイが完了したら、以下を確認してください：

1. ✅ アプリケーションが正常に読み込まれる
2. ✅ 3つの計算機すべてにアクセスできる
3. ✅ TSパラメータ計算が正しく動作する
4. ✅ SPL計算が正しく動作する
5. ✅ クロスオーバーネットワーク計算が正しく動作する
6. ✅ ナビゲーションが正常に機能する
7. ✅ 入力値が保持される（ページ遷移後も）
8. ✅ モバイルデバイスで正常に表示される
9. ✅ 計算結果が正確である

## トラブルシューティング

### 「npm」が認識されない

→ Node.jsをインストールしてください（上記参照）

### ビルドエラーが発生する

```bash
# node_modulesを削除して再インストール
rmdir /s /q node_modules
del package-lock.json
npm install
```

### デプロイ後にページが表示されない

→ ホスティングサービスでSPAリダイレクト設定が必要です

**Netlify**: `netlify.toml` ファイルを作成
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Vercel**: `vercel.json` ファイルを作成
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## サポート

問題が発生した場合は、以下のドキュメントを参照してください：
- BUILD_AND_DEPLOYMENT.md - 詳細なビルド・デプロイガイド
- FINAL_VERIFICATION_CHECKLIST.md - 検証チェックリスト
- README.md - プロジェクト概要

## 次のステップ

デプロイが成功したら：

1. URLを共有して他の人に使ってもらう
2. フィードバックを収集する
3. 必要に応じて機能を追加・改善する
4. カスタムドメインを設定する（オプション）

おめでとうございます！🎉
スピーカー計算WEBアプリケーションが公開されました！
