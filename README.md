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

## 5-2 カード登録ページ

1. フォームにカード名、テキスト、タイプ、スタッツを入力し、画像を選択し、追加ボタンを押すことで、カードが登録できる(名前は必須、その他の項目は空欄でも保存できる)
2. 登録したカードをクリックすることで、詳細が表示できる
3. 詳細の編集ボタンを押すことで、編集ができる
4. 詳細の削除ボタンを押すことで、削除ができる
5. 並び順のプルダウンからソートができる
6. カード名・テキスト・タイプ・スタッツで検索ができる

## 5-3 デッキ登録ページ

1. NEW DECK CREATE ボタンを押すことで、新しいデッキを登録できる
2. カード一覧から追加ボタンを押すことで、そのカードをデッキに追加できる。追加したカードはデッキ確認ボタンで確認できる。
3. デッキ名を入力し、１枚以上カードを登録した状態で、フォームの横にある追加ボタンを押すと、デッキが保存でき、デッキ編集ページに遷移する

## 5-4 対戦部屋への入室

1. 対戦相手の uid をフォームに入力し、自分の使用するデッキを選択することで、対戦部屋へ遷移する
2. 自分が含まれている対戦部屋は、ルーム一覧に表示される
3. 上のフォームから一度入ったことのある部屋であれば、ルーム一覧からルームを選択し、入室することができる

## 5-5 対戦部屋

### 5-5-1 デッキ

1. 左クリックすることで、一番上のカードを１枚、手札に加えることができる
2. 右クリックすることで、ドロー・サーチ・シャッフルができる

### 5-5-2 手札

1. 手札のカードを左クリックし、カードの向き(縦横、表裏)を選択すると、その向きでカードを場に出すことができる
2. 手札のカードを右クリックすることで、デッキに戻すか、捨て札に捨てることができる

### 5-5-3 サイドデッキ

1. サイドデッキを左クリックすると、中身のカードが全て表示され、選んだカードを選んだ向きでフィールドに出すことができる

### 5-5-4 捨て札

1. 捨て札を左クリックすると、中身のカードが全て表示され、選んだカードを手札に加えることができる

### 5-5-5 フィールド

1. フィールドのカードはドラック＆ドロップで動かすことができる
2. フィールドのカードをダブルクリックすることで、カード名・テキスト・タイプ・スタッツを変更できる
3. フィールドのカードを右クリックすることで、カードの向きを変えること・デッキに戻すこと・サイドデッキに戻すこと・捨て札に捨てることが出来る

### 5-5-6 その他

1. リセットボタンを押すことで、自分のフィールド・手札・捨て札が空になり、デッキ・サイドデッキを元の状態に戻すことができる
2. コイントスボタンを押すことで、画面の中央に、表もしくは裏をランダムに表示することができる

# 6. アプリケーションを作成した背景

# 7. 実装した機能についての画像や GIF 及びその説明

## 7-1 カード登録ページ

### 7-1-1 新規にカードが登録できる

### 7-1-2 既存のカードを編集できる

### 7-1-3 カードを並び替えできる、検索バーで検索できる

## 7-2 デッキ登録ページ

### 7-2-1 新規にデッキが保存できる

### 7-2-2 既存のデッキを編集できる

## 7-3 部屋作成ページ

### 7-3-1 新たに部屋を作成できる

### 7-3-2 既存の部屋に入室できる

## 7-4 対戦部屋ページ

### 7-4-1 デッキを左クリックし、カードがドローできる

### 7-4-2 デッキを右クリックし、ドロー・サーチ・シャッフルができる

### 7-4-3 手札のカードを左クリックし、カードを好きな向きでフィールドに出せる

### 7-4-4 手札のカードを右クリックし、デッキに戻すこと・捨て札に捨てることができる

### 7-4-5 フィールドのカードをダブルクリックし、カードの情報を修正できる

### 7-4-6 フィールドのカードを右クリックし、向きの変更・手札に戻すこと・デッキに戻すこと・捨て札に捨てること・サイドデッキに戻すことができる

### 7-4-7 フィールドのカードをドラック＆ドロップで動かせる

### 7-4-8 捨て札を左クリックし、好きなカードを手札に加えられる

### 7-4-9 サイドデッキを左クリックし、好きなカードを好きな向きでフィールドに出せる

### 7-4-10 リセットボタンで自分の盤面をリセットできる

### 7-4-11 コイントスボタンで表裏がランダムに表示される

# 8. 実装予定の機能

## 8-1 カード登録ページ

1. 複数枚のカードを１度に登録できる
2. 自身が登録したカードを他人と共有できる

## 8-2 デッキ登録ページ

1. デッキの中身を表示するとき、同種のカードは枚数で表示する
2. 編集ページで更新ボタンが押されるまでデータベースとのやり取りが発生しない

## 8-3 対戦部屋ページ

1. 自分にも詳細が見えない状態で裏向きにカードが置ける
2. 捨て札に裏向きでカードを置ける
3. 手札からドラック＆ドロップでフィールドにカードを置ける

# 9. データベース設計

## 9-1 cardsDataBase

### 9-1-1 cardsDataBase/{uid}/userCardList/{cardDocId}

ユーザーが登録したカード情報が保存されている。  
uid は FirebaseAuthentication の uid と同等である。  
cardDocId は 自動で生成されるユニークな id である。

| Field        | Type      | Description      | Sample                                |
| ------------ | --------- | ---------------- | ------------------------------------- |
| createdAt    | Timestamp | 作成日時         | 1987-12-01 00:00:00                   |
| cardName     | string    | カード名         | 火を吐くドラゴン                      |
| cardText     | string    | テキスト         | 場に出たとき相手のカードに 3 ダメージ |
| cardType     | string    | タイプ           | 炎                                    |
| cardStats    | string    | スタッツ         | 5/5/5                                 |
| cardImage    | string    | 画像のファイル名 | sample.png                            |
| cardImageUrl | string    | ストレージの url | https://xxx...                        |

### 9-1-2 cardsDataBase/{uid}/userDeckList/{deckDocId}

ユーザーが登録したデッキの情報が保存されている。  
deckDocId は uuidv4 にてランダムに生成される 16 進数の 32 桁の id である。

| Field     | Type      | Description | Sample                 |
| --------- | --------- | ----------- | ---------------------- |
| createdAt | Timestamp | 作成日時    | 1987-12-01 00:00:00    |
| updatedAt | Timestamp | 作成日時    | 1987-12-03 00:00:00    |
| name      | string    | デッキ名    | 火を吐くドラゴンデッキ |

### 9-1-3 cardsDataBase/{uid}/userDeckList/{deckDocId}/cards/{uuid}

ユーザーが登録したデッキの中に入っているカードの情報を保存する  
uuid は uuidv4 にてランダムに生成される 16 進数の 32 桁の id

| Field   | Type      | Description   | Sample                                       |
| ------- | --------- | ------------- | -------------------------------------------- |
| cardRef | reference | カードの参照  | cardsDataBase/{uid}/userCardList/{cardDocId} |
| uuid    | string    | ユニークな id | 01234567-89ab-cdef-0123-456789abcdef         |

## 9-2roomsDataBase

### 9-2-1 roomsDataBase/{roomId}

対戦部屋の情報が保存されている。  
roomId は"host の uid"-"guest の uid"で記述される。

| Field              | Type      | Description                      | Sample                               |
| ------------------ | --------- | -------------------------------- | ------------------------------------ |
| createdAt          | Timestamp | 作成日時                         | 1987-12-01 00:00:00                  |
| hostUserId         | string    | ホストの uid                     | abcdefghijklnmopqstuvwxyzABC         |
| guestUserId        | string    | ゲストの uid                     | abcdefghijklnmopqstuvwxyzABC         |
| hostDeckDocId      | string    | ホストのデッキの deckDocId       | 01234567-89ab-cdef-0123-456789abcdef |
| guestDeckDocId     | string    | ゲストのデッキの deckDocId       | 01234567-89ab-cdef-0123-456789abcdef |
| hostSideDeckDocId  | string    | ホストのサイドデッキの deckDocId | 01234567-89ab-cdef-0123-456789abcdef |
| guestSideDeckDocId | string    | ゲストのサイドデッキの deckDocId | 01234567-89ab-cdef-0123-456789abcdef |

### 9-2-2 roomsDataBase/{roomId}/{hostUserId}/deck

デッキ、フィールド、手札、サイドデッキ、捨て札にどのカードがあるのかという情報が保存されている。  
hostUserId は、ホストの uid である。  
/{guestUserId}/deck や、/deck、/field、/hand、/sideDeck、/trash は全て同様の構造で保存されている。  
{cards : [ {キー:バリュー,キー:バリュー,...} , {} , {} , ...]}という配列形式で保存されている。  
以下のテーブルは、{キー:バリュー,キー:バリュー,...}の内容である。

| Field        | Type      | Description                     | Sample                                |
| ------------ | --------- | ------------------------------- | ------------------------------------- |
| cardDocId    | string    | userCardList における cardDocId | 0123456789abcdefghij                  |
| createdAt    | Timestamp | 作成日時                        | 1987-12-01 00:00:00                   |
| cardName     | string    | カード名                        | 火を吐くドラゴン                      |
| cardText     | string    | テキスト                        | 場に出たとき相手のカードに 3 ダメージ |
| cardType     | string    | タイプ                          | 炎                                    |
| cardStats    | string    | スタッツ                        | 5/5/5                                 |
| cardImage    | string    | 画像のファイル名                | sample.png                            |
| cardImageUrl | string    | ストレージの url                | https://xxx...                        |
| uuid         | string    | ユニークな id                   | 01234567-89ab-cdef-0123-456789abcdef  |
| position     | map       | フィールドの位置                | { row : 3,col : 3 }                   |
| isFaceUp     | Boolean   | 表向きか否か                    | true                                  |
| isVertical   | Boolean   | 縦向きか否か                    | true                                  |

## 9-3 usersDataBase

### 9-3-1 usersDataBase/{uid}/rooms/hostRooms

各ユーザーがホスト・ゲストとして所属している対戦部屋の情報が保存されている。  
/guestRooms も同様の形式で保存されている。  
{roomId : {キー:バリュー,キー:バリュー,...}}というマップ形式で保存されている。  
以下のテーブルは、{キー:バリュー,キー:バリュー,...}の内容である。

| Field              | Type      | Description                      | Sample                               |
| ------------------ | --------- | -------------------------------- | ------------------------------------ |
| createdAt          | Timestamp | 作成日時                         | 1987-12-01 00:00:00                  |
| hostUserId         | string    | ホストの uid                     | abcdefghijklnmopqstuvwxyzABC         |
| guestUserId        | string    | ゲストの uid                     | abcdefghijklnmopqstuvwxyzABC         |
| hostDeckDocId      | string    | ホストのデッキの deckDocId       | 01234567-89ab-cdef-0123-456789abcdef |
| guestDeckDocId     | string    | ゲストのデッキの deckDocId       | 01234567-89ab-cdef-0123-456789abcdef |
| hostSideDeckDocId  | string    | ホストのサイドデッキの deckDocId | 01234567-89ab-cdef-0123-456789abcdef |
| guestSideDeckDocId | string    | ゲストのサイドデッキの deckDocId | 01234567-89ab-cdef-0123-456789abcdef |

# 10. 画面遷移図

[![Image from Gyazo](https://i.gyazo.com/72efaf0b98cafe84c937403ae4c5af45.png)](https://gyazo.com/72efaf0b98cafe84c937403ae4c5af45)

# 11. 開発環境

バックエンド：Firebase  
フロントエンド：Next.js、React.js

# 12. 工夫したポイント

1. ドラック＆ドロップでカードを動かせる
2. データベースとを介したやり取りが早い
3. MUI によるモダンな UI

# 改善点

データベースの構造を、usersDataBase と cardsDataBase とを纏めて、  
usersDataBase/  
　　　 └{uid}/  
 　　　　 ┣cardList/  
 　　　　 ┣deckList/  
 　　　　 └roomList/  
というような形にする。

# 製作期間

6 週間
