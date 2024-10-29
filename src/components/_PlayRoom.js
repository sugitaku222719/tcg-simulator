import React, { useEffect, useState } from 'react'
import styles from "../styles/_PlayRoom.module.css"
import Cell from './Cell';
import { auth, db } from '../lib/Firebase';

function _PlayRoom({roomId, roomData}) {
  const [myField, setMyField] = useState(Array(20).fill().map(() => Array(50).fill(null)));
  const [cards, setCards] = useState([]);
  const [deckCards, setDeckCards] = useState([]);
  const [handCards, setHandCards] = useState([]);
  const hostUserUid = roomData.hostUserId
  const hostDeckRef = db.collection('roomsDataBase').doc(roomId).collection(hostUserUid).doc("deck")
  const hostFieldRef = db.collection('roomsDataBase').doc(roomId).collection(hostUserUid).doc("field")

  useEffect(() => {
    const unsubscribeDeck = hostDeckRef.onSnapshot((doc) => {
        if (doc.exists) {
          setDeckCards(doc.data().cards || []);
          console.log("Deck data updated:", doc.data().cards);
        }
      });

    const unsubscribeField = hostFieldRef.onSnapshot((doc) => {
        if (doc.exists) {
          setCards(doc.data().cards || []);
          console.log("Field data updated:", doc.data().cards);
        }
      });

    return () => {
      unsubscribeDeck();
      unsubscribeField();
    };
  }, []);

  const shuffleDeck = async () => {
    let deck = [...deckCards];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    await setDeckCards(deck);
    hostDeckRef.set({ cards: deck });
  };

  const addCard = async () => {
    if (!deckCards || deckCards.length === 0) return;

    const newCard = deckCards[0];
    const updatedCards = [...cards, newCard];
    await setCards(updatedCards);
    await setDeckCards(deckCards.slice(1));
    
    hostDeckRef.set({ cards: deckCards.slice(1) });
    hostFieldRef.set({ cards: updatedCards });
  };

  // const addCard = async () => {
  //   if (!deckCards || deckCards.length === 0) return;

  //   const newCard = deckCards[0];
  //   const updatedHandCards = [...handCards, newCard];
  //   await setHandCards(updatedHandCards);
  //   await setDeckCards(deckCards.slice(1));
    
  //   db.collection('decks').doc('myDeck').set({ cards: deckCards.slice(1) });
  //   db.collection('hands').doc('myHand').set({ cards: updatedHandCards });
  // };

  const onDragStart = (e, card) => {
    e.dataTransfer.setData('application/json', JSON.stringify(card));
  };

  const onDrop = async (e, rowIndex, colIndex) => {
    e.preventDefault();
    const cardData = e.dataTransfer.getData('application/json');
    if (cardData) {
      const card = JSON.parse(cardData);
      const updatedCards = cards.map(c =>
        c.id === card.id ? { ...c, position: { row: rowIndex, col: colIndex } } : c
      );
      await setCards(updatedCards);
      hostFieldRef.set({ cards: updatedCards });
    }
  };

  const deckOnDrop = (e) => {
    e.preventDefault();
    const cardData = e.dataTransfer.getData('application/json');
    if (cardData) {
      const newDeckCard = JSON.parse(cardData);
      returnDeckCard(newDeckCard)
    }
  }

  const returnDeckCard = async (card) => {
    const updatedDeckCards = [...deckCards, card];
    await setDeckCards(updatedDeckCards);
    await setCards(cards.filter((c) => c.id !== card.id));
  
    hostDeckRef.set({ cards: updatedDeckCards });
    hostFieldRef.set({ cards: cards.filter((c) => c.id !== card.id) });
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const resetDeckAndField = async () => {
    const initialDeck = [
      { id: 1, name: 'カード1', position: { row: 10, col: 10 } },
      { id: 2, name: 'カード2', position: { row: 11, col: 11 } },
      { id: 3, name: 'カード3', position: { row: 12, col: 12 } },
      { id: 4, name: 'カード4', position: { row: 3, col: 10 } },
      { id: 5, name: 'カード5', position: { row: 3, col: 11 } },
      { id: 6, name: 'カード6', position: { row: 3, col: 12 } },
      { id: 7, name: 'カード7', position: { row: 3, col: 13 } },
      { id: 8, name: 'カード8', position: { row: 3, col: 14 } },
      { id: 9, name: 'カード9', position: { row: 3, col: 15 } },
    ];

    await setDeckCards(initialDeck);
    await setCards([]);
    
    db.collection('decks').doc('myDeck').set({ cards: initialDeck });
    db.collection('fields').doc('myField').set({ cards: [] });
  }

  const renderField = () => (
    <div className={styles.field}>
      {myField.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((_, colIndex) => {
            const card = cards.find(c => c.position.row === rowIndex && c.position.col === colIndex);
            return (
              <Cell
                key={colIndex}
                rowIndex={rowIndex}
                colIndex={colIndex}
                card={card}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragStart={onDragStart} 
                onRightClick={returnDeckCard} 
              />
            );
          })}
        </div>
      ))}
      <div 
        className={styles.deck} 
        onClick={addCard}
        onDrop={(e) => deckOnDrop(e)}
        onDragOver={onDragOver}
      >デッキ1</div>
      {/* <div className={styles.handZone}>
        {handCards.map(card => (
          <Card
            key={card.id}
            card={card}
            onDragStart={onDragStart}
            onRightClick={returnDeckCard}
          />
        ))}
      </div> */}
      <button onClick={resetDeckAndField}>リセット</button>
      <button onClick={shuffleDeck}>シャッフル</button>
    </div>
  );
   

  return (
    <div className={styles.playRoom}>
      {renderField()}
    </div>
  );
};

export default _PlayRoom
