# Reading Quest ⛏️ — General MVP 仕様書

> **General 版の目的:** Charlie 専用版を壊さずに、**より汎用的に使える Reading Quest** を別系統で作る。  
> **前提:** `Charlie/PROJECT_PLAN.md` を土台にしつつ、**Dyslexia / reading difficulty の子ども向け**に、**音声アウトプット中心**の UX へ再設計する。  
> **データ互換方針:** Charlie 版と **localStorage キーを分離**し、既存データを壊さない。

---

## 0. 開発方針

### 今回作るもの

Dyslexia / reading difficulty の子ども向けに、**読書後のアウトプットを音声で行い、XP 化する無料 Web アプリ**。

### 技術構成

- HTML / CSS / JavaScript
- GitHub Pages
- localStorage
- Web Speech API
- Chromebook / Chrome 優先

### 今は作らないもの

- ログイン
- クラウド保存
- 課金
- 親ダッシュボード
- 外部 DB
- SaaS 化

---

## 1. プロダクトの目的

子どもが「読めない / 読みづらい」ことで、**読書体験から外れない**ようにする。

このプロダクトで作りたいのは、読むことそのものの点数化ではなく、

- 本に関わる
- 内容を思い出す
- 感想を話す
- 記録される
- XP が増える

という一連の成功体験。

### General 版で大事にすること

- 正しく読めたかを測るアプリではない
- 長い文章を書けるかを測るアプリでもない
- **話せた / 思い出せた / 続けられた** を価値にする

---

## 2. 最重要 UX 原則

### 子ども向け原則

- 文字を読ませない
- 視覚でわかる
- ボタン中心
- 1画面1目的
- 迷わせない
- 1分以内で完了
- マイク入力を主役にする

### Dyslexia 配慮

- 説明文を減らす
- 入力欄よりアイコン優先
- 正しい文章を求めない
- 音声入力の誤変換を責めない
- 1語でも成功扱い
- 話したこと自体を評価する

### UX 判断の基準

迷ったら、次の順で優先する。

1. 子どもが止まらない
2. 子どもが読まなくて済む
3. 子どもが押せば進める
4. 保存されたことが分かる

---

## 3. 画面構成

### Screen 1: Home / Dashboard

#### 目的

子どもが「今の自分の状態」と「次に押すボタン」をすぐ理解する。

#### 表示内容

- アプリ名: `Reading Quest`
- Player name
- Level title
- Total XP
- XP bar
- Reward progress
- Books count
- Streak
- 保存安心表示

#### 必須表示

`✔ Progress saved`  
または、**保存されていることが視覚的に伝わる表示**。

#### ボタン優先順位

メインボタンを最大表示。

1. `Log Today's Read`
2. `My Bookshelf`
3. `My Stats`

ただし、General MVP では `My Bookshelf` / `My Stats` は**小さめ**でよい。

#### UI メモ

- 画面中央に `Log Today's Read`
- XP / Level / Reward は上部または中央上
- `Parent Settings` は小さく下部

---

### Screen 2: Today's Read

#### 目的

読書後に、子どもが**音声で感想を出し**、XP を獲得する。

#### 最重要方針

この画面は「フォーム」ではなく、**ゲーム操作画面**として設計する。

---

### 3-1. Book Title

#### 仕様

- タイプ可能
- マイク入力可能
- `Same Book / Last Book` あり
- 前回の本をワンタップで選べる

#### 推奨表示

`📖 Book`

長い説明文は不要。

---

### 3-2. Enjoyment

#### 仕様

5 段階のアイコン評価。

例:

- `💀`
- `😐`
- `🙂`
- `⭐`
- `💎`

#### UI 要件

- テキスト説明は最小限
- 押したら即時フィードバック
  - 色が変わる
  - 少し跳ねる
  - 選択済みがわかる

---

### 3-3. Comment / Speaking

#### 位置づけ

ここが**コア機能**。

#### 方針

- コメントは**必須に近いメイン行動**
- ただし、詰まった時に進めなくなる設計は避ける
- マイクが主役
- テキストは副産物
- タイプも可能だがサブ扱い

#### UI 方針

今のように `Comment` 欄を主役にせず、**大きなマイクボタン**を主役にする。

推奨:

`🎤`  
大きいマイクボタン  
↓  
下に小さめのテキスト表示欄

#### 保存するもの

- `speechText / commentText`
- `typed` or `spoken` の区別
- `timestamp`

#### 成功判定

- 1語でも入れば成功
- 誤変換でも成功
- 声を出したこと自体を評価する

---

### 3-4. Finished this book

現在のチェックボックス形式より、**ボタン型**が望ましい。

推奨:

`🎉 Finished Book`  
`+500 XP`

ただし MVP では、現行のチェックボックスでも可。

---

### 3-5. Save Button

現在の `Save & Earn XP` より、子ども向けには以下が望ましい。

- `🎉 GET XP`
- `⚡ EARN XP`

---

### 3-6. Back Button

`← Back` は廃止推奨。

代わりに:

`🏠 Home`

#### 理由

子どもには `Back` より `Home` の方が直感的。

---

### Screen 3: Result / Saved

#### 目的

保存されたこと、XP が増えたこと、データが消えていないことを**強く伝える**。

#### 表示内容

- `Saved!`
- 獲得 XP
- Total XP
- Level
- Reward progress
- Next level までの進捗
- Home ボタン

#### 必須演出

- XP が増えた表示を大きく
- Total XP 更新
- 「保存された」安心感

例:

```text
✅ Saved!
+200 XP
Total XP: 1,250
```

---

## 4. XP ルール更新

現在の Charlie 版の XP ルールは参考になるが、General 版では **話す行動**をより重視する。

### 推奨 MVP XP

| アクション | XP |
|------------|----|
| Book + Rating を記録 | +100 |
| Comment / Speak をした | +150 |
| 新しい本を始めた | +100 |
| 本を読了した | +500 |

### 理由

このアプリの本質は、**読めない子が内容を話してアウトプットすること**。  
そのため、`Speak` に一番価値を置く。

### 実装メモ

- `comment` が 1語以上あれば `speechComment` または `typedComment` の XP 対象
- MVP では `typed` も同じ XP にしてよい
- 将来、`speech` をより高くするのは Phase 2 で検討

### レベル曲線（General 確定版・10 段階）

XP しきい値はテーマ非依存（絶対値）。タイトル名だけがテーマで切り替わる。

| Lv | 累計 XP | Minecraft 既定タイトル |
|----|---------|------------------------|
| 1  | 0       | Wood Pickaxe |
| 2  | 500     | Stone Miner |
| 3  | 1,500   | Iron Crafter |
| 4  | 3,000   | Gold Explorer |
| 5  | 5,000   | Redstone Reader |
| 6  | 8,000   | Emerald Hunter |
| 7  | 12,000  | Diamond Digger |
| 8  | 17,000  | Netherite Knight |
| 9  | 24,000  | Ender Master |
| 10 | 32,000  | Dragon Slayer |

Lv10 到達 ≒ 約 6 ヶ月（週 5 日ペース）。

### デフォルト Goal（General 中立化）

- `goalPoints`: **15,000**（約 3 ヶ月で達成イメージ）
- `goalName`: **`Reward`**

Charlie 専用の `39,900` / `Apple Watch SE` は廃止（プレースホルダー・初期値・フォールバック全箇所）。

---

## 5. データ設計アップデート

### localStorage キー

Charlie 版と General 版はキーを分ける。

- Charlie 版: `readingQuest_charlie_v1`
- General 版: `readingQuest_general_v1`

既存データを壊さないため、キーを分ける。

### 新データ構造

```json
{
  "appVersion": "general-mvp-0.2",
  "player": {
    "name": "Charlie",
    "totalXp": 0,
    "level": 1,
    "title": "Wood Pickaxe",
    "bestStreak": 0,
    "currentStreak": 0,
    "lastLogDate": ""
  },
  "logs": [
    {
      "id": "log_001",
      "date": "2026-04-26",
      "bookTitle": "The Bad Guys",
      "enjoyment": 4,
      "comment": "It was funny and the shark was silly",
      "commentMode": "speech",
      "xpEarned": 250,
      "finishedBook": false
    }
  ],
  "books": [
    {
      "title": "The Bad Guys",
      "status": "reading",
      "startDate": "2026-04-26",
      "endDate": "",
      "logCount": 3
    }
  ],
  "config": {
    "goalName": "Apple Watch SE",
    "goalPoints": 39900,
    "speechLang": "en-AU",
    "theme": "minecraft",
    "xpRules": {
      "baseLog": 100,
      "speechComment": 150,
      "newBook": 100,
      "finishedBook": 500
    }
  }
}
```

### Charlie 版との差分

- `appVersion` を追加
- `commentMode` を保持
- `id` を保持
- `goalAmount` より `goalPoints` の方が、General 版では UI に合う
- `xpRules` を config 内に持たせ、将来の調整をしやすくする

---

## 6. データ消失不安対策

これは必須。

### 追加仕様

- 起動時に保存済みデータを読み込む
- XP を常時表示
- 保存完了画面で Total XP を表示
- リロード後も XP が残ることを視覚的に見せる
- Reset は通常画面に置かない、または親用に隠す

### 表示例

`✔ Saved on this device`

ただし、**文字依存しすぎないようにアイコン併用**。

### 実装メモ

- Home 画面の上部に保存アイコン
- Save 後の Result にも保存済み表示
- エラー時は赤、通常は緑など色で区別

---

## 7. フリーズ・リロード対策

チャーリーのような子が「動かない」と感じた時の**逃げ道**を作る。

### 追加仕様

- 全画面に Home ボタン
- 操作後は必ず視覚フィードバック
- 保存後は Result 画面へ遷移
- Result 画面から Home へ戻れる
- 可能なら数秒後に Home へ自動遷移

### 補足

- `Back` を多用しない
- 状態が分からなくならないよう、画面遷移は単純にする

---

## 8. Same Book / Last Book

優先度高。

### 仕様

- 前回入力した本を保存
- 次回ログ画面に `Last Book` ボタンを表示
- 最近の本を最大 3冊表示

### 表示例

`📖 Last Book`

または本の表紙風カード。

### 実装メモ

- `books` 配列と `logs` から最近使用順に算出
- MVP はテキストボタンでも可
- Phase 2 でカード UI に拡張可能

---

## 9. 親設定画面

General MVP では入れる価値あり。  
ただし最初は簡易版。

### 初回だけ表示

親が設定する項目:

- Child name
- Reward name
- Goal points
- Speech language
- Theme

### 初回設定後

子どもは Home 画面へ。

### 親設定の入口

通常の子ども画面には大きく出さない。

例:

`⚙ Parent Settings`

小さく下部に置く。

### MVP 実装方針

- 初回起動時に `config.initialSetupDone` がなければ表示
- 後から変更できる
- Reset と Export / Import は同じ場所に将来集約しやすくする

---

## 10. Export / Import

販売前には必要。  
General MVP では **Phase 2** で OK。

### 目的

localStorage の弱点を補う。

### 機能

- Export data
- Import data
- Reset data

### Reset 仕様

誤操作防止のため、確認を 2回入れる。

---

## 11. PWA 化

今すぐ必須ではないが、早めに検討。

### 目的

Chromebook でアプリっぽく使う。

### 効果

- URL バーを意識しにくい
- 子どもが迷いにくい
- ホーム画面から起動できる

### Phase

Phase 2 以降。

---

## 12. 優先開発順

### Step 1: Charlie 版保護

- 今の URL とデータを残す
- 現行 localStorage キーを確認
- バックアップを取る

### Step 2: General 版を作る

- 別フォルダ / 別公開先にする
- localStorage キーを分ける
- Charlie 固定文言を削除

### Step 3: UI 改善

- XP を大きく
- Reward をわかりやすく
- Speak を主役化
- Save を `GET XP` へ変更
- Back を `Home` へ変更

### Step 4: 親設定

- Child name
- Goal
- Reward
- Speech language

### Step 5: テスト

- Charlie で再テスト
- 友達親子でテスト

---

## 補足: General 版の成功条件

- 子どもが**読めなくても使える**
- 子どもが**音声で1つでも出せば成功**
- 保存されたことが**目で見てわかる**
- Charlie 版を壊さずに並行運用できる
- 親が設定と保守をシンプルに扱える

---

## 推奨ファイル構成（General）

```text
Reading_Quest/
└── General/
    ├── PROJECT_PLAN.md
    ├── README.md
    ├── web/
    │   ├── index.html
    │   ├── style.css
    │   ├── app.js
    │   ├── assets/
    │   └── manifest.json        (Phase 2)
    ├── docs/
    │   ├── index.html
    │   ├── style.css
    │   └── app.js
    └── sync-web-to-docs.sh      (必要なら)
```

Charlie 版と同じ構成に寄せると、保守・比較・移植がしやすい。
