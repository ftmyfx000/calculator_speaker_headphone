# ステップバイステップ デプロイガイド

## 📋 準備するもの

- GitHubアカウント（既にお持ちです ✅）
- インターネット接続
- Windows PC

---

## ステップ1: GitHub Desktop のインストール

### 1-1. ダウンロード

1. ブラウザで以下のURLを開く：
   ```
   https://desktop.github.com/
   ```

2. 「Download for Windows」ボタンをクリック

3. `GitHubDesktopSetup-x64.exe` がダウンロードされます

### 1-2. インストール

1. ダウンロードした `GitHubDesktopSetup-x64.exe` をダブルクリック

2. インストーラーが起動します（数分かかります）

3. インストールが完了すると、GitHub Desktop が自動的に起動します

### 1-3. サインイン

1. 「Sign in to GitHub.com」をクリック

2. ブラウザが開き、GitHubのログイン画面が表示されます

3. GitHubアカウントでログイン

4. 「Authorize desktop」をクリック

5. GitHub Desktop に戻ります

6. 名前とメールアドレスを確認して「Finish」をクリック

---

## ステップ2: リポジトリをクローン

### 2-1. リポジトリをクローン

1. GitHub Desktop で「File」→「Clone repository...」をクリック
   （または、初回起動時は「Clone a repository from the Internet...」）

2. 「URL」タブをクリック

3. 以下を入力：
   - Repository URL: `https://github.com/ftmyfx000/calculator_speaker_headphone.git`
   - Local path: `C:\Users\FTMY\Documents\GitHub\calculator_speaker_headphone`
     （または任意の場所）

4. 「Clone」ボタンをクリック

5. クローンが完了するまで待ちます（数秒）

---

## ステップ3: ファイルをコピー

### 3-1. エクスプローラーで2つのフォルダを開く

**フォルダA（コピー元）:**
```
C:\Users\FTMY\Desktop\計算シート
```

**フォルダB（コピー先）:**
```
C:\Users\FTMY\Documents\GitHub\calculator_speaker_headphone
```

### 3-2. 以下のファイル・フォルダをコピー

**フォルダA から フォルダB へコピー：**

✅ **フォルダ:**
- `src/` フォルダ（すべての内容を含む）
- `.kiro/` フォルダ（すべての内容を含む）

✅ **設定ファイル:**
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.node.json`
- `tailwind.config.js`
- `postcss.config.js`
- `netlify.toml`
- `.gitignore`
- `index.html`

✅ **ドキュメントファイル:**
- `README.md`
- `BUILD_AND_DEPLOYMENT.md`
- `DEPLOYMENT_GUIDE_JP.md`
- `GITHUB_UPLOAD_GUIDE.md`
- `STEP_BY_STEP_DEPLOYMENT.md`
- `FINAL_VERIFICATION_CHECKLIST.md`
- `INTEGRATION_TEST_SUMMARY.md`
- `PROPERTY_TEST_SUMMARY.md`
- `TASK_12_COMPLETION_SUMMARY.md`

❌ **コピー不要（これらはコピーしない）:**
- `いろいろ計算シート簡易版_rev4.xlsx`（元のExcelファイル）
- `read_excel.py`（Pythonスクリプト）
- `node_modules/` フォルダ（存在する場合）
- `.vscode/` フォルダ（エディタ設定）

### 3-3. コピーの確認

フォルダB に以下が存在することを確認：
- `src/` フォルダ
- `package.json` ファイル
- `index.html` ファイル
- その他の設定ファイル

---

## ステップ4: GitHub にプッシュ

### 4-1. GitHub Desktop で変更を確認

1. GitHub Desktop に戻る

2. 左側に変更されたファイルの一覧が表示されます
   - 緑色の「+」マーク = 新規追加されたファイル
   - たくさんのファイルが表示されるはずです

3. すべてのファイルにチェックが入っていることを確認

### 4-2. コミット

1. 左下の「Summary (required)」欄に以下を入力：
   ```
   Initial commit: Speaker Calculator Web App
   ```

2. 「Description」欄（オプション）に以下を入力（任意）：
   ```
   スピーカー・ヘッドホン設計用計算WEBアプリケーション
   - TSパラメータ計算
   - SPL計算
   - クロスオーバーネットワーク計算
   ```

3. 「Commit to main」ボタンをクリック

### 4-3. プッシュ

1. 上部に「Push origin」ボタンが表示されます

2. 「Push origin」をクリック

3. アップロードが開始されます（数秒～数分）

4. 完了すると「Fetch origin」に変わります

✅ **完了！** GitHubにコードがアップロードされました！

### 4-4. 確認

ブラウザで以下のURLを開いて確認：
```
https://github.com/ftmyfx000/calculator_speaker_headphone
```

ファイルが表示されていればOKです！

---

## ステップ5: Netlify でデプロイ

### 5-1. Netlify にアクセス

1. ブラウザで以下のURLを開く：
   ```
   https://www.netlify.com
   ```

2. 「Sign up」をクリック

3. 「GitHub」を選択してログイン

4. 「Authorize Netlify」をクリック

### 5-2. 新しいサイトを作成

1. ダッシュボードで「Add new site」をクリック

2. 「Import an existing project」を選択

3. 「GitHub」をクリック

4. リポジトリ一覧から `calculator_speaker_headphone` を探してクリック

5. ビルド設定を確認：
   - **Branch to deploy:** main
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   
   これらは `netlify.toml` で自動設定されているので、そのままでOK

6. 「Deploy site」をクリック

### 5-3. デプロイを待つ

1. デプロイが開始されます

2. 画面に進行状況が表示されます：
   - 🔄 Building...
   - 📦 Deploying...
   - ✅ Published!

3. 通常3～5分で完了します

### 5-4. 公開URLを確認

1. デプロイが完了すると、URLが表示されます：
   ```
   https://ランダムな名前.netlify.app
   ```

2. このURLをクリックして、アプリケーションを確認！

---

## ステップ6: 動作確認

### 6-1. アプリケーションをテスト

公開されたURLで以下を確認：

✅ **基本動作:**
- [ ] ページが正常に読み込まれる
- [ ] タイトル「スピーカー計算ツール」が表示される
- [ ] ナビゲーションメニューが表示される

✅ **TSパラメータ計算機:**
- [ ] 左メニューから「TSパラメータ」をクリック
- [ ] 入力フィールドが表示される
- [ ] 値を入力すると計算結果が表示される

✅ **SPL計算機:**
- [ ] 左メニューから「SPL計算」をクリック
- [ ] 入力フィールドが表示される
- [ ] 値を入力すると計算結果が表示される

✅ **クロスオーバーネットワーク計算機:**
- [ ] 左メニューから「クロスオーバーネットワーク」をクリック
- [ ] 入力フィールドが表示される
- [ ] 値を入力すると計算結果が表示される

✅ **ナビゲーション:**
- [ ] 計算機を切り替えても入力値が保持される
- [ ] ブラウザの戻る/進むボタンが動作する

✅ **レスポンシブデザイン:**
- [ ] スマートフォンで表示しても正常に動作する

---

## ステップ7: カスタムドメイン設定（オプション）

### 7-1. サイト名を変更

1. Netlify ダッシュボードで「Site settings」をクリック

2. 「Change site name」をクリック

3. 好きな名前を入力（例: `speaker-calculator`）

4. 「Save」をクリック

5. 新しいURL: `https://speaker-calculator.netlify.app`

### 7-2. カスタムドメインを追加（独自ドメインがある場合）

1. 「Domain management」をクリック

2. 「Add custom domain」をクリック

3. ドメイン名を入力

4. DNS設定の指示に従う

---

## 🎉 完了！

おめでとうございます！スピーカー計算WEBアプリケーションが公開されました！

### 公開URL:
```
https://あなたのサイト名.netlify.app
```

### 今後の更新方法:

1. ローカルでファイルを編集
2. GitHub Desktop で変更をコミット
3. 「Push origin」でプッシュ
4. Netlify が自動的に再デプロイ（数分）

---

## トラブルシューティング

### GitHub Desktop でエラーが出る

**問題:** 「Authentication failed」

**解決策:**
1. GitHub Desktop で「File」→「Options」→「Accounts」
2. 「Sign out」してから再度「Sign in」

---

### Netlify でビルドエラーが出る

**問題:** 「Build failed」

**解決策:**
1. Netlify のビルドログを確認
2. エラーメッセージをコピー
3. 必要に応じて設定を修正

よくあるエラー:
- Node.js バージョン → `netlify.toml` で指定済み
- ビルドコマンド → `netlify.toml` で指定済み

---

### ページが表示されない

**問題:** 404 エラー

**解決策:**
1. `netlify.toml` ファイルが正しくアップロードされているか確認
2. リダイレクト設定が含まれているか確認

---

## サポート

問題が発生した場合は、以下のドキュメントを参照：
- `GITHUB_UPLOAD_GUIDE.md` - GitHub アップロード詳細
- `BUILD_AND_DEPLOYMENT.md` - ビルド・デプロイ詳細
- `DEPLOYMENT_GUIDE_JP.md` - デプロイ全般ガイド

---

**次のステップ:** このガイドに従って、ステップ1から順番に進めてください！
