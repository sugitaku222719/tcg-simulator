import { auth, db } from '@/lib/Firebase';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

function DeckRegistrationForm({ deckCards }) {
  const [deckName, setDeckName] = useState("");
  const router = useRouter();

  const deckRegistrationButton = async () => {
    if (!deckName) {
      alert("Deck Nameを入力してください");
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
      router.push(`/deckRegistration/${deckName}`);
    } catch (error) {
      console.error('エラーが発生しました: ', error);
    }
  };

  return (
    <div>
      <label htmlFor="deckName">deckName:</label>
      <input
        type="text"
        id="deckName"
        value={deckName}
        onChange={(event) => setDeckName(event.target.value)}
      />
      <button onClick={deckRegistrationButton}>追加</button>
    </div>
  );
}

export default DeckRegistrationForm;