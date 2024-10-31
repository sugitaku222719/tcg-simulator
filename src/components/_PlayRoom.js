import React, { useEffect, useState } from 'react'
import styles from "../styles/_PlayRoom.module.css"
import Cell from './Cell';
import { auth, db } from '../lib/Firebase';
import HandCard from './HandCard';

function _PlayRoom({roomId, roomData}) {
  const [myField, setMyField] = useState(Array(20).fill().map(() => Array(60).fill(null)));
  const [cards, setCards] = useState([]);
  const [deckCards, setDeckCards] = useState([]);
  const [handCards, setHandCards] = useState([]);
  const hostUserUid = roomData.hostUserId;
  const hostDeckRef = db.collection('roomsDataBase').doc(roomId).collection(hostUserUid).doc("deck");
  const hostFieldRef = db.collection('roomsDataBase').doc(roomId).collection(hostUserUid).doc("field");
  const hostHandRef = db.collection('roomsDataBase').doc(roomId).collection(hostUserUid).doc("hand");

  useEffect(() => {
    const unsubscribeDeck = hostDeckRef.onSnapshot((doc) => {
        if (doc.exists) {
          setDeckCards(doc.data().cards || []);
          // console.log("Deck data updated:", doc.data().cards);
        }
      });

    const unsubscribeField = hostFieldRef.onSnapshot((doc) => {
        if (doc.exists) {
          setCards(doc.data().cards || []);
          // console.log("Field data updated:", doc.data().cards);
        }
      });

      const unsubscribeHand = hostHandRef.onSnapshot((doc) => {
        if (doc.exists) {
          setHandCards(doc.data().cards || []);
          // console.log("Hand data updated:", doc.data().cards);
        }
      });

    return () => {
      unsubscribeDeck();
      unsubscribeField();
      unsubscribeHand();
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

  const addFieldCard = async (card) => {
    if (!handCards || handCards.length === 0) return;

    
    const updatedCards = [...cards, card];
    await setCards(updatedCards);
    await setHandCards(handCards.filter((c) => c.uuid !== card.uuid));
    
    hostHandRef.set({ cards: handCards.filter((c) => c.uuid !== card.uuid) });
    hostFieldRef.set({ cards: updatedCards });
  };

  const addHandCard = async () => {
    if (!deckCards || deckCards.length === 0) return;

    const newCard = deckCards[0];
    const updatedHandCards = [...handCards, newCard];
    await setHandCards(updatedHandCards);
    await setDeckCards(deckCards.slice(1));
    
    hostDeckRef.set({ cards: deckCards.slice(1) });
    hostHandRef.set({ cards: updatedHandCards });
  };

  const onDragStart = (e, card) => {
    e.dataTransfer.setData('application/json', JSON.stringify(card));
  };

  const onDrop = async (e, rowIndex, colIndex) => {
    e.preventDefault();
    const cardData = e.dataTransfer.getData('application/json');
    if (cardData) {
      const card = JSON.parse(cardData);
      const updatedCards = cards.map(c =>
        c.uuid === card.uuid ? { ...c, position: { row: rowIndex, col: colIndex } } : c
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
    await setCards(cards.filter((c) => c.uuid !== card.uuid));
  
    hostDeckRef.set({ cards: updatedDeckCards });
    hostFieldRef.set({ cards: cards.filter((c) => c.uuid !== card.uuid) });
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const resetDeckAndFieldAndHand = async () => {
    const hostDecDocId = roomData.hostDeckDocId
    const deckRef = db
      .collection('cardsDataBase')
      .doc(hostUserUid)
      .collection('userDeckList')
      .doc(hostDecDocId)
      .collection("cards");
    const snapshot = await deckRef.get();
    const _cards = snapshot.docs.map((doc) => ({
      cardDocId: doc.id,
      ...doc.data(),
    }));
    const initialDeck = _cards.map(card => {
      return{
        ...card,
        position: {row: 3, col: 3}
      };
    });

    await setDeckCards(initialDeck);
    await setCards([]);
    await setHandCards([]);

    hostDeckRef.set({ cards: initialDeck });
    hostFieldRef.set({ cards: [] });
    hostHandRef.set({ cards: [] });
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
      <div className={styles.deckAndHand}>
        <div className={styles.handZone}>
          {handCards.map(card => (
            <HandCard
              key={card.uuid}
              card={card}
              addFieldCard={addFieldCard}
              onRightClick={returnDeckCard}
            />
          ))}
        </div>
        <div 
          className={styles.deck} 
          onClick={addHandCard}
          onDrop={(e) => deckOnDrop(e)}
          onDragOver={onDragOver}
        >デッキ1</div>
      </div>
      <button onClick={resetDeckAndFieldAndHand}>リセット</button>
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
