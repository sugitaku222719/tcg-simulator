import { auth, db } from '@/lib/Firebase';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

function _DeckIndex() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const cardsRef = db
      .collection('cardsDataBase')
      .doc(auth.currentUser.uid)
      .collection('userDeckList')
      .orderBy("name", "asc");;

    const unsubscribe = cardsRef.onSnapshot(async (querySnapshot) => {
      const _decks = querySnapshot.docs.map((doc) => {
        return {
          deckId: doc.id,
          ...doc.data(),
        };
      });
      setDecks(_decks);
    })

    return () => {
      unsubscribe();
    };
  }, []);
  const deckListItems = decks.map((deck) => {
    return (
      <li key={deck.deckId}>
        <ul>
          <li>
            <Link href = {`/deckRegistration/${deck.deckId}`} >
              <p>Name: {deck.name}</p>
            </Link>
            <p>Deck ID: {deck.deckId}</p>
          </li>
        </ul>
      </li>
    );
  });

  return (
    <div>
      <h4>デッキリスト</h4>
      <ul>{deckListItems}</ul>
    </div>
  );
}

export default _DeckIndex
