# GitHubへのアップロード手順（Git未インストール環境）

## 方法1: GitHub Desktop を使用（推奨・最も簡単）

### ステップ1: GitHub Desktop をインストール

1. https://desktop.github.com/ にアクセス
2. 「Download for Windows」をクリック
3. ダウンロードしたファイルを実行してインストール
4. GitHubアカウントでサインイン

### ステップ2: リポジトリをクローン

1. GitHub Desktop を開く
2. 「File」→「Clone repository」
3. 「URL」タブを選択
4. URL: `https://github.com/ftmyfx000/calculator_speaker_headphone.git`
5. Local path: 任意の場所（例: `C:\Users\FTMY\Documents\GitHub\calculator_speaker_headphone`）
6. 「Clone」をクリック

### ステップ3: ファイルをコピー

1. 現在のプロジェクトフォルダ（`C:\Users\FTMY\Desktop\計算シート`）から以下のファイル・フォルダを**すべて**コピー：
   - `src/` フォルダ
   - `.kiro/` フォルダ
   - `index.html`
   - `package.json`
   - `vite.config.ts`
   - `tsconfig.json`
   - `tsconfig.node.json`
   - `tailwind.config.js`
   - `postcss.config.js`
   - `netlify.toml`
   - `.gitignore`
   - `README.md`
   - すべての `.md` ファイル

2. クローンしたリポジトリフォルダにペースト

**注意**: 以下のファイルはコピー不要：
- `いろいろ計算シート簡易版_rev4.xlsx`（元のExcelファイル）
- `read_excel.py`（Pythonスクリプト）
- `node_modules/`（存在する場合）

### ステップ4: コミット＆プッシュ

1. GitHub Desktop に戻る
2. 左側に変更されたファイル一覧が表示される
3. 左下の「Summary」に `Initial commit: Speaker Calculator Web App` と入力
4. 「Commit to main」をクリック
5. 上部の「Push origin」をクリック

完了！GitHubにコードがアップロードされました。

---

## 方法2: GitHub Web UI を使用（ファイル数が多いため非推奨）

### ステップ1: リポジトリページを開く

https://github.com/ftmyfx000/calculator_speaker_headphone にアクセス

### ステップ2: ファイルをアップロード

1. 「Add file」→「Upload files」をクリック
2. ファイルをドラッグ&ドロップ
3. 「Commit changes」をクリック

**注意**: この方法はファイル数が多いため時間がかかります。GitHub Desktop の使用を推奨します。

---

## 方法3: Git をインストールしてコマンドラインで実行

### ステップ1: Git をインストール

1. https://git-scm.com/download/win にアクセス
2. 「64-bit Git for Windows Setup」をダウンロード
3. インストーラーを実行（デフォルト設定でOK）
4. コマンドプロンプトを再起動

### ステップ2: Git コマンドを実行

コマンドプロンプトで以下を実行：

```bash
# 現在のフォルダでGitを初期化
git init

# すべてのファイルをステージング
git add .

# コミット
git commit -m "Initial commit: Speaker Calculator Web App"

# ブランチ名をmainに変更
git branch -M main

# リモートリポジトリを追加
git remote add origin https://github.com/ftmyfx000/calculator_speaker_headphone.git

# プッシュ
git push -u origin main
```

初回プッシュ時、GitHubの認証が求められる場合があります。

---

## 次のステップ: Netlify でデプロイ

GitHubにコードがアップロードされたら：

1. https://www.netlify.com にアクセス
2. 「Sign up」→「GitHub」でログイン
3. 「Add new site」→「Import an existing project」
4. 「GitHub」を選択
5. `calculator_speaker_headphone` リポジトリを選択
6. ビルド設定を確認：
   - Build command: `npm run build`
   - Publish directory: `dist`
   - これらは `netlify.toml` で自動設定されます
7. 「Deploy site」をクリック

数分後、アプリケーションが公開されます！

Netlifyが自動的に以下を行います：
- Node.js のインストール
- `npm install` の実行
- `npm run build` の実行
- `dist/` フォルダのデプロイ
- HTTPS の有効化
- カスタムURLの提供（例: `https://your-site-name.netlify.app`）

---

## トラブルシューティング

### GitHub Desktop でエラーが出る

→ リポジトリが空でない場合、「Fetch origin」を先に実行してから、ファイルをコピーしてください。

### 認証エラーが出る

→ GitHubの個人アクセストークンが必要な場合があります。GitHub Desktop を使用すれば自動的に処理されます。

### ファイルが多すぎてアップロードできない

→ GitHub Desktop を使用してください。Web UIよりも確実です。

---

## 推奨方法

**初心者向け**: 方法1（GitHub Desktop）
- 最も簡単で確実
- GUIで操作できる
- エラーが少ない

**開発者向け**: 方法3（Git CLI）
- コマンドラインで完全にコントロール
- 自動化しやすい
- 高速

どちらの方法でも、最終的にNetlifyで自動デプロイされます！
