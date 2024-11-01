import { auth, db } from '@/lib/Firebase';
import React from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@mui/material';
import styles from '@/styles/_DeckEditButton.module.css';

function _DeckEditButton({ deckCards, deckDocId }) {
  const router = useRouter();

  const deckEditButton = async () => {
    if (!deckDocId) {  // deckDocIDをdeckDocIdに変更
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
        .doc(deckDocId);

      // デッキの基本情報を更新（更新日時）
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
        const cardDocId = card.deckCardId || uuidv4();  // deckCardIdを使用
        newCardIds.add(cardDocId);
        const cardRef = deckRef.collection('cards').doc(cardDocId);
        batch.set(cardRef, {
          cardRef: db.collection('cardsDataBase')
                     .doc(auth.currentUser.uid)
                     .collection('userCardList')
                     .doc(card.cardId),
          uuid: cardDocId,
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
    <div className={styles.buttonContainer}>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={deckEditButton}
        className={styles.updateButton}
      >
        更新
      </Button>
    </div>
  );
}

export default _DeckEditButton;