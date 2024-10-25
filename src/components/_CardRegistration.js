import { auth, db } from '@/lib/Firebase';
import React, { useEffect, useState } from 'react';

function _CardRegistration() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const cardsRef = db
      .collection('cardsDataBase')
      .doc(auth.currentUser.uid)
      .collection('userCardList')
      .orderBy("cardName", "asc");

    const unsubscribe = cardsRef.onSnapshot(async (querySnapshot) => {
      const _cards = querySnapshot.docs.map((doc) => {
        return {
          cardId: doc.id,
          ...doc.data(),
        };
      });
      setCards(_cards);
    })

    return () => {
      unsubscribe();
    };
  }, []);
  const cardListItems = cards.map((card) => {
    return (
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
        </ul>
      </li>
    );
  });

  return (
    <div>
      <ul>{cardListItems}</ul>
    </div>
  );
}

export default _CardRegistration;