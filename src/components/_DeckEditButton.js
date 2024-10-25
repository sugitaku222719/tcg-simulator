import { auth, db } from '@/lib/Firebase';
import React from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid'; // UUID生成ライブラリ

function _DeckEditButton({ deckCards }) {
  const router = useRouter();
  const { deckDocID } = router.query;

  const deckEditButton = async () => {
    if (!deckDocID) {
      alert("デッキ名が指定されていません");
      return;
    }

    if (deckCards.length === 0) {
      alert("デッキにカードがありません");
      return;
    }

    try {
      const deckRef = db
        .collection('cardsDataBase')
        .doc(auth.currentUser.uid)
        .collection('userDeckList')
        .doc(deckDocID);

      // デッキの基本情報を更新（名前と更新日時）
      await deckRef.set({
        updatedAt: new Date(),
      }, { merge: true });

      // 現在のデッキのカードを取得
      const currentCardsSnapshot = await deckRef.collection('cards').get();
      const currentCardIds = new Set(currentCardsSnapshot.docs.map(doc => doc.id));

      // バッチ処理でカード情報を更新または追加
      const batch = db.batch();
      const newCardIds = new Set();

      deckCards.forEach((card) => {
        // 一意なドキュメントIDとしてUUIDを使用
        const cardDocId = card.uuid || uuidv4(); // 既存ならそのまま使用、新規なら生成
        newCardIds.add(cardDocId);
        const cardRef = deckRef.collection('cards').doc(cardDocId);
        batch.set(cardRef, {
          cardId: card.cardId,
          cardName: card.cardName,
          cardImageUrl: card.cardImageUrl,
          uuid: cardDocId, // ドキュメントIDも保存しておく
        });
      });

      // 削除すべきカードを特定して削除
      currentCardIds.forEach(cardId => {
        if (!newCardIds.has(cardId)) {
          const cardRef = deckRef.collection('cards').doc(cardId);
          batch.delete(cardRef);
        }
      });

      await batch.commit();
      alert("デッキが更新されました");
    } catch (error) {
      console.error('エラーが発生しました: ', error);
    }
  };

  return (
    <div>
      <button onClick={deckEditButton}>更新</button>
    </div>
  );
}

export default _DeckEditButton;