import { auth, db } from '@/lib/Firebase';
import React, { useEffect, useState } from 'react';
import _DeckEditButton from './_DeckEditButton';
import { useRouter } from 'next/router';

function _DeckEdit() {
  const [allCards, setAllCards] = useState([]);
  const [deckCards, setDeckCards] = useState([]);
  const router = useRouter()
  const { deckName } = router.query

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

  useEffect(() => {
    const deckCardsRef = db
        .collection('cardsDataBase')
        .doc(auth.currentUser.uid)
        .collection('userDeckList')
        .doc(deckName)
        .collection('cards');

      const unsubscribe = deckCardsRef.onSnapshot(async (querySnapshot) => {
        const _cards = querySnapshot.docs.map((doc) => ({
          cardId: doc.id,
          ...doc.data(),
        }));
        setDeckCards(_cards);
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
      <_DeckEditButton deckCards={deckCards} />
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

export default _DeckEdit
