# 1. アプリケーション名

TCG-Simulator

# 2. アプリケーション概要

Web 上でオリジナルのカードゲームが遊べる

# 3. URL

https://tcg-simulator-2dfd2.web.app/

# 4. テスト用アカウント

・Basic 認証 ID：xxxx  
・Basic 認証パスワード：xxxx  
・google アカウント：tcg.simulator.test01@gmail.com  
・google アカウントのパスワード：TCG@test01

# 5. 利用方法

## 5-1 トップページ

1. ログインボタンで、google アカウントによるログインが出来る
2. ヘッダーや各種ボタンをクリックすることで、各ページに遷移できる

## 5-2. カード登録ページ

1. フォームにカード名、テキスト、タイプ、スタッツを入力し、画像を選択し、追加ボタンを押すことで、カードが登録できる(名前は必須、その他の項目は空欄でも保存できる)
2. 登録したカードをクリックすることで、詳細が表示できる
3. 詳細の編集ボタンを押すことで、編集ができる
4. 詳細の削除ボタンを押すことで、削除ができる
5. 並び順のプルダウンからソートができる
6. カード名・テキスト・タイプ・スタッツで検索ができる

## 5-3. デッキ登録ページ

1. NEW DECK CREATE ボタンを押すことで、新しいデッキを登録できる
2. カード一覧から追加ボタンを押すことで、そのカードをデッキに追加できる。追加したカードはデッキ確認ボタンで確認できる。
3. デッキ名を入力し、１枚以上カードを登録した状態で、フォームの横にある追加ボタンを押すと、デッキが保存でき、デッキ編集ページに遷移する

## 5-4. 対戦部屋への入室

1. 対戦相手の uid をフォームに入力し、自分の使用するデッキを選択することで、対戦部屋へ遷移する
2. 自分が含まれている対戦部屋は、ルーム一覧に表示される
3. 上のフォームから一度入ったことのある部屋であれば、ルーム一覧からルームを選択し、入室することができる

## 5-5. 対戦部屋

### 5-5-1. デッキ

1. 左クリックすることで、一番上のカードを１枚、手札に加えることができる
2. 右クリックすることで、ドロー・サーチ・シャッフルができる

### 5-5-2. 手札

1. 手札のカードを左クリックし、カードの向き(縦横、表裏)を選択すると、その向きでカードを場に出すことができる
2. 手札のカードを右クリックすることで、デッキに戻すか、捨て札に捨てることができる

### 5-5-3. サイドデッキ

1. サイドデッキを左クリックすると、中身のカードが全て表示され、選んだカードを選んだ向きでフィールドに出すことができる

### 5-5-4. 捨て札

1. 捨て札を左クリックすると、中身のカードが全て表示され、選んだカードを手札に加えることができる

### 5-5-5. フィールド

1. フィールドのカードはドラック＆ドロップで動かすことができる
2. フィールドのカードをダブルクリックすることで、カード名・テキスト・タイプ・スタッツを変更できる
3. フィールドのカードを右クリックすることで、カードの向きを変えること・デッキに戻すこと・サイドデッキに戻すこと・捨て札に捨てることが出来る

### 5-5-6. その他

1. リセットボタンを押すことで、自分のフィールド・手札・捨て札が空になり、デッキ・サイドデッキを元の状態に戻すことができる
2. コイントスボタンを押すことで、画面の中央に、表もしくは裏をランダムに表示することができる

# 6. アプリケーションを作成した背景

# 実装した機能についての画像や GIF 及びその説明

# 実装予定の機能

## カード登録ページ

1. 複数枚のカードを１度に登録できる
2. 自身が登録したカードを他人と共有できる

## デッキ登録ページ

1. デッキの中身を表示するとき、同種のカードは枚数で表示する
2. 編集ページで更新ボタンが押されるまでデータベースとのやり取りが発生しない

## 対戦部屋ページ

1. 自分にも詳細が見えない状態で裏向きにカードが置ける
2. 捨て札に裏向きでカードを置ける
3. 手札からドラック＆ドロップでフィールドにカードを置ける

# データベース設計

# 画面遷移図

[![Image from Gyazo](https://i.gyazo.com/72efaf0b98cafe84c937403ae4c5af45.png)](https://gyazo.com/72efaf0b98cafe84c937403ae4c5af45)

# 開発環境

バックエンド：Firebase  
フロントエンド：Next.js、React.js

# ローカルでの動作方法

# 工夫したポイント

1. ドラック＆ドロップでカードを動かせる
2. データベースとを介したやり取りが早い
3. MUI によるモダンな UI

# 改善点

# 製作期間

6 週間
