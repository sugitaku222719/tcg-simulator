import { auth, db } from '@/lib/Firebase';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

function _DeckEditButton({ deckCards }) {
  const router = useRouter();
  const { deckName } = router.query

  const deckEditButton = async () => {
    if (deckCards.length === 0) {
      alert("デッキにカードがありません");
      return;
    }

    try {
      const deckRef = db
        .collection('cardsDataBase')
        .doc(auth.currentUser.uid)
        .collection('userDeckList')
        .doc(deckName);

      await deckRef.set({
        name: deckName,
        createdAt: new Date(),
      });

      const batch = db.batch();
      deckCards.forEach((card, index) => {
        const cardRef = deckRef.collection('cards').doc(`${card.cardId}-${index}`);
        batch.set(cardRef, {
          cardId: card.cardId,
          cardName: card.cardName,
          cardImageUrl: card.cardImageUrl,
        });
      });

      await batch.commit();
      alert("デッキが保存されました");
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