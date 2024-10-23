import { auth, db } from '@/lib/Firebase';
import React, { useEffect, useState } from 'react';
import DeckRegistrationForm from './DeckRegistrationForm';

function DeckRegistrationCardIndex() {
  const [allCards, setAllCards] = useState([]);
  const [deckCards, setDeckCards] = useState([]);

  useEffect(() => {
    const cardsRef = db
      .collection('cardsDataBase')
      .doc(auth.currentUser.uid)
      .collection('userCardList');

    const unsubscribe = cardsRef.onSnapshot(async (querySnapshot) => {
      const _cards = querySnapshot.docs.map((doc) => ({
        cardId: doc.id,
        ...doc.data(),
      }));
      setAllCards(_cards);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const addCardToDeck = (card) => {
    setDeckCards([...deckCards, card]);
  };

  const removeCardFromDeck = (index) => {
    setDeckCards(deckCards.filter((_, i) => i !== index));
  };

  return (
    <div>
      <DeckRegistrationForm deckCards={deckCards} />
      <div style={{ display: 'flex' }}>
        {/* 左側：デッキの中身 */}
        <div style={{ flex: 1, marginRight: '20px' }}>
          <h2>デッキの中身</h2>
          <ul>
            {deckCards.map((card, index) => (
              <li key={`${card.cardId}-${index}`}>
                <ul>
                  <li>ID: {card.cardId}</li>
                  <li>Name: {card.cardName}</li>
                  <li>
                    <img
                      src={card.cardImageUrl || ""}
                      alt={card.cardName}
                      width="100"
                      height="140"
                    />
                  </li>
                  <li>
                    <button onClick={() => removeCardFromDeck(index)}>削除</button>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </div>

        {/* 右側：すべてのカード一覧 */}
        <div style={{ flex: 1 }}>
          <h2>すべてのカード</h2>
          <ul>
            {allCards.map((card) => (
              <li key={card.cardId}>
                <ul>
                  <li>ID: {card.cardId}</li>
                  <li>Name: {card.cardName}</li>
                  <li>
                    <img
                      src={card.cardImageUrl || ""}
                      alt={card.cardName}
                      width="100"
                      height="140"
                    />
                  </li>
                  <li>
                    <button onClick={() => addCardToDeck(card)}>追加</button>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DeckRegistrationCardIndex;