import { auth, db } from '@/lib/Firebase';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

function DeckIndex() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const cardsRef = db
      .collection('cardsDataBase')
      .doc(auth.currentUser.uid)
      .collection('userDeckList');

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
            <Link href = {`/deckRegistration/${deck.name}`} >Name: {deck.name}</Link>
          </li>
        </ul>
      </li>
    );
  });

  return (
    <div>
      <ul>{deckListItems}</ul>
    </div>
  );
}

export default DeckIndex
