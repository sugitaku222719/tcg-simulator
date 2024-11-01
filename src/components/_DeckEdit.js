import { auth, db } from '@/lib/Firebase';
import React, { useEffect, useState } from 'react';
import _DeckEditButton from './_DeckEditButton';
import { useRouter } from 'next/router';

function _DeckEdit() {
  const [allCards, setAllCards] = useState([]);
  const [deckCards, setDeckCards] = useState([]);
  const router = useRouter()
  const { deckDocId } = router.query

  useEffect(() => {
    const cardsRef = db
      .collection('cardsDataBase')
      .doc(auth.currentUser.uid)
      .collection('userCardList')
      .orderBy("cardName", "asc");

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
    if (!deckDocId) return;

    const deckCardsRef = db
      .collection('cardsDataBase')
      .doc(auth.currentUser.uid)
      .collection('userDeckList')
      .doc(deckDocId)
      .collection('cards');

    const unsubscribe = deckCardsRef.onSnapshot(async (querySnapshot) => {
      const cardPromises = querySnapshot.docs.map(async (doc) => {
        const cardRef = doc.data().cardRef;
        const cardDoc = await cardRef.get();
        return {
          deckCardId: doc.id,
          ...cardDoc.data(),
          cardId: cardDoc.id
        };
      });

      const resolvedCards = await Promise.all(cardPromises);
      setDeckCards(resolvedCards);
    });

    return () => {
      unsubscribe();
    };
  }, [deckDocId]);

  const addCardToDeck = async (card) => {
    if (!deckDocId) return;

    const deckRef = db
      .collection('cardsDataBase')
      .doc(auth.currentUser.uid)
      .collection('userDeckList')
      .doc(deckDocId);

    const cardRef = db
      .collection('cardsDataBase')
      .doc(auth.currentUser.uid)
      .collection('userCardList')
      .doc(card.cardId);

    await deckRef.collection('cards').add({
      cardRef: cardRef
    });
  };

  const removeCardFromDeck = async (deckCardId) => {
    if (!deckDocId) return;

    await db
      .collection('cardsDataBase')
      .doc(auth.currentUser.uid)
      .collection('userDeckList')
      .doc(deckDocId)
      .collection('cards')
      .doc(deckCardId)
      .delete();
  };

  return (
    <div>
      <_DeckEditButton deckCards={deckCards} deckDocId={deckDocId} />
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, marginRight: '20px' }}>
          <h2>デッキの中身</h2>
          <ul>
            {deckCards.map((card) => (
              <li key={card.deckCardId}>
                <ul>
                  <li>ID: {card.cardId}</li>
                  <li>Name: {card.cardName || "該当のカードが見つかりません"}</li>
                  <li>
                    <img src={card.cardImageUrl || ""} alt={card.cardName} width="100" height="140" />
                  </li>
                  <li>
                    <button onClick={() => removeCardFromDeck(card.deckCardId)}>削除</button>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          <h2>すべてのカード</h2>
          <ul>
            {allCards.map((card) => (
              <li key={card.cardId}>
                <ul>
                  <li>ID: {card.cardId}</li>
                  <li>Name: {card.cardName}</li>
                  <li>
                    <img src={card.cardImageUrl || ""} alt={card.cardName} width="100" height="140" />
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

export default _DeckEdit;