# Reading Quest ⛏️ — General セットアップ手順

> **前提:** General 版は **Charlie 版とは完全に別ファイル / 別 GitHub リポジトリ** として進める。  
> **目的:** Charlie 版を壊さずに、General MVP を **独立して開発・公開**できる状態を作る。  
> **構成:** **静的 Web アプリ + localStorage + GitHub Pages** を使う。

---

## 手順の全体像

| 順番 | 内容 | 状態 |
|------|------|------|
| **Step 1** | 新しい General 用フォルダを用意する | ✅ 完了 (2026-04-27) |
| **Step 2** | General 専用の GitHub リポジトリを作る | ✅ 完了 (2026-04-27) |
| **Step 3** | `web/` と `docs/` の骨組みを作る | ✅ 完了 (2026-04-27) |
| **Step 4** | ローカルで動作確認する | ✅ 完了 (2026-04-27, port 8081) |
| **Step 5** | GitHub に push する | 🟡 途中（commit 済み、push が認証待ち） |
| **Step 6** | GitHub Pages を有効にする | ⬜ 未着手 |
| **Step 7** | General 版の初期設定と動作確認をする | ✅ ローカルでは完了 (2026-04-27) |

---

## 実行記録 / 進捗ログ

### 2026-04-27

#### 確定した設定
- リポジトリ URL: `https://github.com/tamamifreilich-star/reading-quest-general.git`
- ローカル開発ポート: **`8081`**（Charlie 版が以前 `8080` を使っていたため避けた）
- localStorage キー: `readingQuest_general_v1`
- Charlie 版とは別 origin / 別キーで完全分離されていることを DevTools で確認済み

#### 動作確認した内容（ローカル `http://localhost:8081`）
- ✅ Setup 画面 → 各項目入力 → Save setup で Home 画面へ遷移
- ✅ Home に Player 名 / Total XP / Books / Streak / Level progress / Reward progress 表示
- ✅ Log Today's Read → 本タイトル + Enjoyment + コメント入力 → GET XP で保存
- ✅ Result 画面で `+350 XP` 表示（基本 100 + コメント 150 + 新規本 100）
- ✅ リロード後もデータが残る（localStorage 永続化 OK）
- ✅ DevTools の Application → Local Storage に `readingQuest_general_v1` キーが保存されている
- ✅ `readingQuest_charlie_v1` は存在しない（Charlie 版と分離成功）

#### Git の進捗
- ✅ `.gitignore` 追加（`.DS_Store` などを除外）
- ✅ `git init` / `git branch -M main` / `git add .` / `git commit -m "Initial General MVP setup"` 完了
- ✅ `git remote add origin https://github.com/tamamifreilich-star/reading-quest-general.git`
- ⏸ `git push -u origin main` は **HTTPS 認証が未設定**のため失敗
  - エラー: `fatal: could not read Username for 'https://github.com': Device not configured`
  - 次の対処: 以下のいずれかで認証を通す
    - **A.** ターミナルで対話的に push（PAT を入力）
    - **B.** GitHub CLI (`gh`) をインストールして `gh auth login` してから push
    - **C.** SSH 鍵を設定して remote URL を `git@github.com:...` に変更してから push

#### 残タスク
- [ ] Step 5: `git push` を完了させる
- [ ] Step 6: GitHub Pages を `main` / `/docs` で有効化
- [ ] Step 7: 公開 URL（`https://tamamifreilich-star.github.io/reading-quest-general/`）でも動作確認

---

## Step 1: 新しい General 用フォルダを用意する

General 版は Charlie 版と分けるため、`Tamami/Reading_Quest/General/` を独立した作業場所として使う。

### 想定フォルダ

```text
Tamami/Reading_Quest/General/
├── PROJECT_PLAN.md
├── SETUP.md
├── README.md
├── web/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── docs/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── sync-web-to-docs.sh   （必要なら）
```

### ポイント

- Charlie 版の `web/` や `docs/` をそのまま上書きしない
- General 版の `localStorage` キーは **`readingQuest_general_v1`**
- まずは最小構成で OK

---

## Step 2: General 専用の GitHub リポジトリを作る

Charlie 版と完全に分けるため、GitHub も別リポジトリにする。

### リポジトリ名の例

- `reading-quest-general`
- `reading-quest-mvp-general`
- `reading-quest-dyslexia`

### GitHub でやること

1. GitHub で **新規リポジトリ**を作成
2. **空のリポジトリ**で作る
3. Public / Private は用途に応じて選ぶ

### おすすめ

- まずは **Private** でもよい
- テスト公開したくなったら Public に切り替える

---

## Step 3: `web/` と `docs/` の骨組みを作る

### 開発用

- `web/index.html`
- `web/style.css`
- `web/app.js`

### GitHub Pages 用

- `docs/index.html`
- `docs/style.css`
- `docs/app.js`

### なぜ `docs/` が必要か

GitHub Pages は通常、

- ルート `/(root)`
- または `docs/`

しか公開元にしにくいため。

### 運用方針

- 日常の編集は **`web/`**
- 公開用は **`docs/`**
- `web/` を更新したら `docs/` にコピーする

### MVP 初期状態

最初は中身が空でもよい。最低限、以下があればスタートできる。

- `index.html`
- `style.css`
- `app.js`

---

## Step 4: ローカルで動作確認する

### 1. ターミナルで `web/` に入る

```bash
cd /Users/tamamifreilich/Documents/Tamami_Workspace/Tamami/Reading_Quest/General/web
```

### 2. ローカルサーバーを起動する

```bash
python3 -m http.server 8081
```

> **メモ:** Charlie 版が以前 `8080` を使っていたため、General 版は **`8081`** を使う方針にした（2026-04-27 確定）。  
> Charlie 版を同時に動かさないなら `8080` でも動くが、ポートを分けた方が混乱が少ない。

### 3. ブラウザで開く

`http://localhost:8081`

### 注意

- `file://` 直開きだと、マイクが不安定になることがある
- **Web Speech API** は `localhost` または `HTTPS` の方が安定しやすい
- Chromebook / Chrome 想定なら、Chrome で確認する
- localStorage は **ポート単位**で別領域。`8080` と `8081` は別保存になるので、テストするポートを途中で変えるとデータが見えなくなる

---

## Step 5: GitHub に push する

### 先にやること

1. GitHub で **General 用の新しい空リポジトリ**を作る  
2. リポジトリ URL を控える  
   例: `git@github.com:YOURNAME/reading-quest-general.git`  
   または `https://github.com/YOURNAME/reading-quest-general.git`

### 今回使ったリポジトリ URL

```text
https://github.com/tamamifreilich-star/reading-quest-general.git
```

### そのまま使うコマンド

```bash
cd /Users/tamamifreilich/Documents/Tamami_Workspace/Tamami/Reading_Quest/General

git init
git add .
git commit -m "Initial General MVP setup"
git branch -M main
git remote add origin https://github.com/tamamifreilich-star/reading-quest-general.git
git push -u origin main
```

### 認証で詰まった場合（2026-04-27 に発生）

`git push` で次のエラーが出たら、HTTPS 認証が未設定の状態。

```text
fatal: could not read Username for 'https://github.com': Device not configured
```

#### 解決策 A: ターミナルで対話的に push（一番手っ取り早い）

ターミナルアプリ（Terminal.app / iTerm2）で次を実行する。

```bash
cd /Users/tamamifreilich/Documents/Tamami_Workspace/Tamami/Reading_Quest/General
git push -u origin main
```

ユーザー名を聞かれたら GitHub のユーザー名（`tamamifreilich-star`）、パスワードを聞かれたら **Personal Access Token (PAT)** を貼り付ける。

PAT は https://github.com/settings/tokens の **Generate new token (classic)** から作る。スコープは `repo` だけで OK。1 回貼れば macOS Keychain に保存されて、次回以降は自動で使われる。

#### 解決策 B: GitHub CLI (`gh`) を使う

```bash
brew install gh
gh auth login
# → GitHub.com / HTTPS / Login with a web browser を選ぶと一番楽
```

そのあと普通に `git push -u origin main` でいける。

#### 解決策 C: SSH 鍵を使う

すでに `~/.ssh/id_ed25519.pub` などがあれば、それを GitHub の SSH keys に登録してから

```bash
git remote set-url origin git@github.com:tamamifreilich-star/reading-quest-general.git
git push -u origin main
```

### `docs/` を最新にしてから push したい時

```bash
cd /Users/tamamifreilich/Documents/Tamami_Workspace/Tamami/Reading_Quest/General

chmod +x ./sync-web-to-docs.sh
./sync-web-to-docs.sh

git add .
git commit -m "Sync web to docs"
git push
```

### 初回

```bash
git init
git add .
git commit -m "Initial General MVP setup"
git branch -M main
git remote add origin <YOUR_GENERAL_REPO_URL>
git push -u origin main
```

### 補足

- `<YOUR_GENERAL_REPO_URL>` は GitHub で作った **General 専用リポジトリ URL**
- Charlie 版の remote を流用しない
- すでに `git init` したあとにやり直したい場合は、同じフォルダで `git remote -v` を見てから進めると安全

---

## Step 6: GitHub Pages を有効にする

### 手順

1. GitHub で General リポジトリを開く
2. `Settings`
3. 左メニューの `Pages`
4. `Build and deployment`
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - Folder: `/docs`
5. `Save`

### 公開 URL

数分後に、以下のような URL が表示される。

`https://tamamifreilich-star.github.io/reading-quest-general/`

### 確認すること

- `docs/` 側に `index.html` がある
- CSS / JS のパスが正しい
- 表示崩れがない

---

## Step 7: General 版の初期設定と動作確認

General 版は Charlie 版と違い、初回セットアップを想定している。

### 最初に確認すること

- Child name が設定できる
- Reward name が設定できる
- Goal points が設定できる
- Speech language が設定できる
- Theme が設定できる

### 動作確認チェックリスト（ローカル `http://localhost:8081`）

- [x] Home 画面が開く
- [x] `Log Today's Read` が押せる
- [x] 本タイトルが入力できる
- [ ] マイク入力が使える（未テスト）
- [x] Enjoyment が選べる
- [x] Comment / Speak が保存される
- [x] `GET XP` または `EARN XP` で保存できる
- [x] Result 画面に遷移する
- [x] Total XP が更新される（+350 XP を確認）
- [x] リロードしてもデータが残る
- [x] `readingQuest_general_v1` で保存される

### 公開後の動作確認チェックリスト（GitHub Pages URL）

GitHub Pages で公開できたら、以下を改めて確認する。

- [ ] `https://tamamifreilich-star.github.io/reading-quest-general/` が開く
- [ ] Setup 画面が出る
- [ ] Setup → Home の遷移ができる
- [ ] Today's Read が保存できる
- [ ] HTTPS なのでマイクも安定して動く
- [ ] localStorage キーは `readingQuest_general_v1`

---

## localStorage の注意

General 版は Charlie 版と絶対に分ける。

### 使用キー

```text
readingQuest_general_v1
```

### Charlie 版

```text
readingQuest_charlie_v1
```

### 重要

- キーを同じにしない
- テスト中に Charlie 版データを上書きしない
- ブラウザの devtools で保存確認すると安心

---

## 推奨する最初の実装順

1. `Home`
2. `Today's Read`
3. `Result / Saved`
4. localStorage 保存
5. Web Speech API
6. Same Book / Last Book
7. Parent Settings

### 理由

まず、

- 入力できる
- 保存できる
- XP が増える
- リロードしても残る

この最小の成功体験を先に作ると、あとで調整しやすい。

---

## トラブルシューティング

### ページが真っ白

- `python3 -m http.server 8080` を起動しているか確認
- `http://localhost:8080` で開いているか確認
- `index.html` と `app.js` のパスが合っているか確認

### GitHub Pages で 404

- `docs/index.html` があるか確認
- Pages の公開元が `/docs` になっているか確認

### マイクが動かない

- Chrome を使っているか
- マイク許可を出しているか
- `localhost` か `HTTPS` で開いているか

### データが消えた

- localStorage はブラウザ / プロファイルごと
- シークレットモードでは別保存
- ブラウザデータ削除で消える

---

## 公開前の確認

- Charlie 版とは別 URL になっている
- localStorage キーが別
- Child name など Charlie 固定文言が残っていない
- `Back` より `Home` を使っている
- `Speak` / `GET XP` が主役になっている

---

## 更新したら

- `PROJECT_PLAN.md` の仕様とズレていないか確認
- 変更点を `README.md` に追記してもよい
- 必要なら `sync-web-to-docs.sh` を作る
