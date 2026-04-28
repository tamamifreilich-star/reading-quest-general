# Reading Quest ⛏️ — General 開発ロードマップ

> **ステータス（2026-04-28）:** MVP セットアップ完了。公開 URL 稼働中。  
> 公開 URL: https://tamamifreilich-star.github.io/reading-quest-general/  
> リポジトリ: https://github.com/tamamifreilich-star/reading-quest-general

---

## 戦略サマリー

### ターゲット
- **英語圏のディスレクシア家庭**（プライマリ）
- **幼児〜小学生**（脱文字 UI で幼児層にも自然に刺さる）
- **ジェンダーニュートラル**（現状は Minecraft 一択 → 女の子・年少児にも届かない）

### 販売
- **チャネル**: Gumroad（英語圏向け digital product 販売）
- **価格**: $15〜$20（ベータ版価格）
- **アクセス制御**: パスワード保護（Lv2: 簡易ライセンスキー）
- **ゴール**: 10 本売る → 検証完了 → クラウドファンディング → SaaS 化

### コア差別化ポイント
1. **脱文字 UI** — アイコンで操作完結、ディスレクシアの子も幼児も使える
2. **音声でアウトプット** — 読書後に「話す」ことで XP、書けなくても続く
3. **ゲーム的演出** — テーマ・サウンド・XP・レベル・ご褒美ポイント

### やらないこと（明示的に）
- ログイン / クラウドストレージ（Phase 2 / SaaS 化フェーズで実装）
- 課金システム自前実装（Gumroad に任せる）
- ガチガチの DRM（テスト販売段階では過剰）
- 多言語化（英語のみで開始）

---

## Phase 0: テスト販売できる状態にする（目標 2〜3 週間）

「Gumroad に並べて売れる」最低ライン。コア差別化を売り文句として成立させる。

### Phase 0 の完了条件（Definition of Done）
- [x] デフォルトを General 中立化（goalName=`Reward`, goalPoints=15,000）
- [x] 10 段階レベル + レベルアップ演出（Goal 設定に依存しない）
- [x] **Parent Settings から全データリセットができる**（confirm 付き、子は触れない）
- [ ] 脱文字 UI: 主要操作がアイコンで分かる（読まなくても押せる）
- [ ] テーマが最低 **3 つ**選べる（Minecraft 含む、性別年齢偏らない）
- [ ] サウンド効果: XP 獲得・Saved・レベルアップで音が出る
- [ ] My Bookshelf 画面が動く（読了本の一覧が見える）
- [ ] My Stats 画面が動く（最低限: 累計 XP / Books / Streak / 直近ログ）
- [ ] PWA 化: ホーム画面に追加でき、アプリらしく起動する
- [ ] Export / Import: JSON でバックアップ・復元できる
- [ ] パスワード保護: 購入者だけアプリ本体に入れる
- [ ] Gumroad 商品ページが公開され、決済→アクセス通知まで通る
- [ ] スクリーンショット・LP 用画像一式が揃う

### Phase 0 のサブゴール（実装順）

| # | 内容 | なぜこの順か |
|---|---|---|
| **1** | **テーマ・ビジュアルシステム再設計** | 全機能の土台。色・アイコン・フォント・タイポを決めると、他の追加が一貫する |
| **2** | **脱文字 UI（アイコン化）** | コア差別化。ボタン・タイトル・状態表示をアイコン中心に |
| **3** | **テーマ追加（最低 +2 種）** | Minecraft 一辺倒からの脱却。女の子・年少向け |
| **4** | **サウンド効果** | 「やった感」と継続モチベ |
| **5** | **My Bookshelf / My Stats** | 売る時の画面写真として必要 |
| **6** | **Export / Import** | データ消失で返金リクエストを防ぐ自衛 |
| **7** | **PWA 化** | アプリらしさで価格を正当化 |
| **8** | **パスワード保護ゲート** | 購入者限定アクセス |
| **9** | **Gumroad 商品ページ + LP 用画像** | 販売開始の最後の一手 |

### Phase 0 から外すもの（Phase 1 へ）
- XP ルールの親カスタム（最初は固定で売る）
- 親設定の期間目安・アドバイス
- Achievements / Badges
- 中間ご褒美 / マイルストーン
- Reading minutes（時間トラッキング）
- ヒートマップ / カレンダー Stats

---

## Phase 1: テスト販売中の改善（販売開始 → 10 本到達まで）

実際の購入者 / フィードバックを見ながら追加。

- XP ルールの親カスタム（`config.xpRules` を Parent Settings から編集可能に）
- 親設定の拡張（期間の目安 + 各項目の説明・アドバイス）
- Achievements / Badges（初めての本、3 日連続、10 冊達成など）
- 中間ご褒美 / マイルストーン（39,900 XP 到達前のご褒美設定）
- テーマ追加（フィードバックを受けて +1〜2 種）
- ヒートマップ / カレンダー Stats（GitHub の草風）
- 読了本のカバー風カード UI

---

## Phase 2: 10 本売れたら（クラウドファンディング → SaaS 化）

検証完了後、本格プロダクト化に投資。

- Auth（Firebase Auth / Supabase / Clerk のいずれか）
- クラウドストレージ（Firestore / Supabase DB）
- 複数プロファイル（兄弟用）
- 親レポート（週次 / 月次のメール送信）
- Reading minutes トラッキング
- カメラで本の表紙撮影
- Stripe Subscriptions による月額課金
- Charlie 版データ取り込み（既存ユーザー向け）

---

## XP 経済設計（Phase 0 確定版）

### XP ルール（変更なし）
| アクション | XP |
|---|---|
| 基本ログ（本タイトル + Enjoyment） | +100 |
| 音声 / テキストコメント | +150 |
| 新しい本を始めた | +100 |
| 本を読了した | +500 |

→ 1 日 = 標準で **250 XP**（基本 + コメント）。月〜金で続けると週 1,250 XP。

### レベル曲線（10 段階、テーマ非依存の絶対値）

| Lv | 累計 XP | Minecraft 既定タイトル | 標準到達 |
|---|---|---|---|
| 1 | 0 | Wood Pickaxe | 開始 |
| 2 | 500 | Stone Miner | 約 2 日 |
| 3 | 1,500 | Iron Crafter | 約 6 日 |
| 4 | 3,000 | Gold Explorer | 2 週 |
| 5 | 5,000 | Redstone Reader | 1 ヶ月 |
| 6 | 8,000 | Emerald Hunter | 6 週 |
| 7 | 12,000 | Diamond Digger | 10 週 |
| 8 | 17,000 | Netherite Knight | 14 週 |
| 9 | 24,000 | Ender Master | 19 週 |
| 10 | 32,000 | Dragon Slayer | 6 ヶ月 |

> 各テーマ（Magic Castle / Ocean Quest など）は同じ XP しきい値で、タイトル名だけが切り替わる。

### デフォルトゴール
| 項目 | 値 |
|---|---|
| デフォルト Goal points | **15,000 XP（約 3 ヶ月）** |
| デフォルト Goal name | **`Reward`** |
| Setup の placeholder（goal） | `15000` |
| Setup の placeholder（reward） | `Reward` |

### レベルアップ演出（重要・必須）
- どの Goal points を設定しても、レベル境界を越えたら**必ず演出が出る**
- Result 画面で大きく「🎉 LEVEL UP!」を出し、新しい Title 名を強調
- Phase 0-4 でサウンドも追加（ファンファーレ）
- 演出は次回 Home に戻った時には消える（毎回演出されないように）

---

## テーマ案（Phase 0 で 3 種揃える）

ジェンダー・年齢を偏らせない構成案。

| テーマ | 雰囲気 | レベル例 | 色調 |
|---|---|---|---|
| **Minecraft** (既存) | ゲーム好きの子・男の子向け | Wood Pickaxe → Stone Miner → Iron Crafter → Gold Explorer → Redstone Reader | 緑・茶 |
| **Magic Castle** (新) | 女の子・ファンタジー好き向け | Star Wand → Moon Crystal → Sun Crown → Dragon Sage → Wizard Master | 紫・金 |
| **Ocean Quest** (新) | 年少児・自然好き・ジェンダーニュートラル | Tiny Fish → Sea Turtle → Coral Guardian → Deep Diver → Whale Wizard | 青・水色 |

> ⚠️ レベル名・色は仮。Phase 0-1（テーマシステム再設計）で正式に決める。

---

## サウンド方針（Phase 0-4）

- **音源**: フリー / CC0 ライセンスのみ使用（freesound.org / mixkit / pixabay）
- **音量**: デフォルト中、Parent Settings で OFF にできる
- **シーン別**:
  - XP 獲得時: 短い「ピロッ」系
  - レベルアップ時: 派手なファンファーレ
  - Saved 時: ふわっと優しい音
  - ボタンタップ時: 軽いクリック音（有無は要検証、うるさいかも）

---

## ビジュアルシステム方針（Phase 0-1）

### フォント
- 通常: 親しみやすいサンセリフ（例: Nunito, Quicksand, Baloo 2 など Google Fonts）
- ディスレクシア対応モード: **OpenDyslexic** をオプションで選択可能 ← 売り文句にしやすい

### アイコン
- ライセンス: フリー素材（Heroicons, Phosphor, Lucide, または絵文字）
- 主要ボタン: アイコン + 必要なら短い英単語、で読まなくても操作可能

### イラスト
- ライセンス: フリー素材（unDraw, openDoodles, Storyset）または AI 生成（Stable Diffusion / Midjourney）
- ロゴ: 自作 or AI 生成、複数テーマでも共通アイデンティティを保つ

---

## 販売準備（Phase 0-9）

### Gumroad 商品ページに必要なもの
- 商品名（仮: `Reading Quest — Beta`）
- 説明文（英語）: ディスレクシアの子向け / 音声で読書を続ける / ゲーム化 / 親が設定 / オフライン動作
- スクリーンショット 5〜8 枚（Home / Today's Read / Result / Bookshelf / Stats / 各テーマ）
- 価格: $15〜$20
- 配信方法: 購入後にメールで「アクセス URL + パスワード」を送る（Gumroad の content delivery 機能）

### パスワード保護の実装案
- アプリ起動時に `localStorage.licenseKey` をチェック
- なければゲート画面 → ライセンスキー入力 → サーバーに問い合わせ ... ではなく、**JS 内に許可キーリスト**を持って簡易チェック（テスト販売段階では十分）
- セキュリティは弱いが、10 本売る検証目的では OK

---

## 進捗の記録ルール

- 各 Phase / サブゴールを完了したら、SETUP.md ではなく**この ROADMAP.md** に状態を更新する
- SETUP.md はあくまで「セットアップ作業の手順 + 過去の進捗ログ」として保持
- 大きな仕様決定は別途 PROJECT_PLAN.md にも反映する
