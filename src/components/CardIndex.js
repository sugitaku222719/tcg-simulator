import { auth, db, storage } from '@/lib/Firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import React, { useEffect, useState } from 'react';

function CardIndex() {
  const [cards, setCards] = useState([]);
  const [cardImageUrls, setCardImageUrls] = useState({});

  useEffect(() => {
    const cardsRef = db
      .collection('cardsDataBase')
      .doc(auth.currentUser.uid)
      .collection('userCardList');

    const unsubscribe = cardsRef.onSnapshot(async (querySnapshot) => {
      const _cards = querySnapshot.docs.map((doc) => {
        return {
          cardId: doc.id,
          ...doc.data(),
        };
      });
      setCards(_cards);

      const urls = {};
      await Promise.all(
        _cards.map(async (card) => {
          try {
            const gsReference = ref(
              storage,
              'gs://tcg-simulator-2dfd2.appspot.com/image/MUVw0ZYuifgmK0l8p2PnKJLah712/' + card.cardImage
            );
            const url = await getDownloadURL(gsReference);
            urls[card.cardId] = url;
          } catch (error) {
            console.error('Error fetching image URL:', error);
          }
        })
      );

      setCardImageUrls(urls);
    });

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
              src={cardImageUrls[card.cardId] || ""}
              alt={card.cardName}
              width="100"
              height="160"
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

export default CardIndex;