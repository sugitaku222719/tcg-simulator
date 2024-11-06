import React, { useEffect, useState } from 'react'
import styles from "../styles/_PlayRoom.module.css"
import Cell from './Cell';
import { auth, db } from '../lib/Firebase';
import HandCard from './HandCard';

function _PlayRoom({roomId, roomData}) {
  const [myField, setMyField] = useState(Array(20).fill().map(() => Array(60).fill(null)));
  const [opponentField, setOpponentField] = useState(Array(20).fill().map(() => Array(60).fill(null)));
  const [myCards, setMyCards] = useState([]);
  const [opponentCards, setOpponentCards] = useState([]);
  const [myDeckCards, setMyDeckCards] = useState([]);
  const [opponentDeckCards, setOpponentDeckCards] = useState([]);
  const [myHandCards, setMyHandCards] = useState([]);
  const [opponentHandCards, setOpponentHandCards] = useState([]);
  const hostUserUid = roomData.hostUserId;
  const guestUserUid = roomData.guestUserId;
  const isHost = roomData.hostUserId === auth.currentUser.uid;
  const isGuest = roomData.guestUserId === auth.currentUser.uid;

  const myUserUid = isHost ? hostUserUid : guestUserUid;
  const opponentUserUid = isHost ? guestUserUid : hostUserUid;

  const myDeckRef = db.collection('roomsDataBase').doc(roomId).collection(myUserUid).doc("deck");
  const myFieldRef = db.collection('roomsDataBase').doc(roomId).collection(myUserUid).doc("field");
  const myHandRef = db.collection('roomsDataBase').doc(roomId).collection(myUserUid).doc("hand");
  const opponentDeckRef = db.collection('roomsDataBase').doc(roomId).collection(opponentUserUid).doc("deck");
  const opponentFieldRef = db.collection('roomsDataBase').doc(roomId).collection(opponentUserUid).doc("field");
  const opponentHandRef = db.collection('roomsDataBase').doc(roomId).collection(opponentUserUid).doc("hand");

  useEffect(() => {
    const unsubscribeMyDeck = myDeckRef.onSnapshot((doc) => {
      if (doc.exists) {
        setMyDeckCards(doc.data().cards || []);
      }
    });

    const unsubscribeMyField = myFieldRef.onSnapshot((doc) => {
      if (doc.exists) {
        setMyCards(doc.data().cards || []);
      }
    });

    const unsubscribeMyHand = myHandRef.onSnapshot((doc) => {
      if (doc.exists) {
        setMyHandCards(doc.data().cards || []);
      }
    });

    const unsubscribeOpponentDeck = opponentDeckRef.onSnapshot((doc) => {
      if (doc.exists) {
        setOpponentDeckCards(doc.data().cards || []);
      }
    });

    const unsubscribeOpponentField = opponentFieldRef.onSnapshot((doc) => {
      if (doc.exists) {
        setOpponentCards(doc.data().cards || []);
      }
    });

    const unsubscribeOpponentHand = opponentHandRef.onSnapshot((doc) => {
      if (doc.exists) {
        setOpponentHandCards(doc.data().cards || []);
      }
    });

    return () => {
      unsubscribeMyDeck();
      unsubscribeMyField();
      unsubscribeMyHand();
      unsubscribeOpponentDeck();
      unsubscribeOpponentField();
      unsubscribeOpponentHand();
    };
  }, []);

  const shuffleDeck = async () => {
    let deck = [...myDeckCards];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    await setMyDeckCards(deck);
    myDeckRef.set({ cards: deck });
  };

  const addFieldCard = async (card, isVertical, isFaceUp) => {
    if (!myHandCards || myHandCards.length === 0) return;
    const updatedCard = { 
      ...card, 
      position: { row: 3, col: 3 }, 
      isVertical: isVertical,
      isFaceUp: isFaceUp
    };
    const updatedCards = [...myCards, updatedCard];
    await setMyCards(updatedCards);
    await setMyHandCards(myHandCards.filter((c) => c.uuid !== card.uuid));
    myHandRef.set({ cards: myHandCards.filter((c) => c.uuid !== card.uuid) });
    myFieldRef.set({ cards: updatedCards });
  };

  const addHandCard = async () => {
    if (!myDeckCards || myDeckCards.length === 0) return;

    const newCard = myDeckCards[0];
    const updatedHandCards = [...myHandCards, newCard];
    await setMyHandCards(updatedHandCards);
    await setMyDeckCards(myDeckCards.slice(1));
    
    myDeckRef.set({ cards: myDeckCards.slice(1) });
    myHandRef.set({ cards: updatedHandCards });
  };

  const onDragStart = (e, card) => {
    e.dataTransfer.setData('application/json', JSON.stringify(card));
  };

  const onDrop = async (e, rowIndex, colIndex) => {
    e.preventDefault();
    const cardData = e.dataTransfer.getData('application/json');
    if (cardData) {
      const card = JSON.parse(cardData);
      const updatedCards = myCards.map(c => 
        c.uuid === card.uuid 
          ? { ...c, position: { row: rowIndex, col: colIndex } }
          : c
      );
      await setMyCards(updatedCards);
      myFieldRef.set({ cards: updatedCards });
    }
  };

  const deckOnDrop = (e) => {
    e.preventDefault();
    const cardData = e.dataTransfer.getData('application/json');
    if (cardData) {
      const newDeckCard = JSON.parse(cardData);
      returnToDeckFromField(newDeckCard)
    }
  }

  const returnToDeckFromField = async (card) => {
    const updatedDeckCards = [...myDeckCards, card];
    await setMyDeckCards(updatedDeckCards);
    await setMyCards(myCards.filter((c) => c.uuid !== card.uuid));
  
    myDeckRef.set({ cards: updatedDeckCards });
    myFieldRef.set({ cards: myCards.filter((c) => c.uuid !== card.uuid) });
  };

  const returnToHand = async (card) => {
    const updatedHandCards = [...myHandCards, card];
    await setMyHandCards(updatedHandCards);
    await setMyCards(myCards.filter((c) => c.uuid !== card.uuid));
  
    myHandRef.set({ cards: updatedHandCards });
    myFieldRef.set({ cards: myCards.filter((c) => c.uuid !== card.uuid) });
  };

  const returnToDeck = async (card) => {
    const updatedDeckCards = [...myDeckCards, card];
    await setMyDeckCards(updatedDeckCards);
    await setMyHandCards(myHandCards.filter((c) => c.uuid !== card.uuid));
  
    myDeckRef.set({ cards: updatedDeckCards });
    myHandRef.set({ cards: myHandCards.filter((c) => c.uuid !== card.uuid) });
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const resetDeckAndFieldAndHand = async () => {
    const myDeckDocId = isHost ? roomData.hostDeckDocId : roomData.guestDeckDocId;
    const deckRef = db
      .collection('cardsDataBase')
      .doc(myUserUid)
      .collection('userDeckList')
      .doc(myDeckDocId)
      .collection("cards");
    
    const snapshot = await deckRef.get();
    const cardPromises = snapshot.docs.map(async (doc) => {
      const cardRef = doc.data().cardRef;
      const cardDoc = await cardRef.get();
      return {
        cardDocId: cardDoc.id,
        uuid: doc.id,
        ...cardDoc.data(),
        cardRef: cardRef,
        position: {row: 3, col: 3}
      };
    });
  
    const initialDeck = await Promise.all(cardPromises);
  
    await setMyDeckCards(initialDeck);
    await setMyCards([]);
    await setMyHandCards([]);
  
    myDeckRef.set({ cards: initialDeck });
    myFieldRef.set({ cards: [] });
    myHandRef.set({ cards: [] });
  }

  const changeCardOrientation = async (card, isVertical) => {
    const updatedCards = myCards.map(c => 
      c.uuid === card.uuid ? { ...c, isVertical: isVertical } : c
    );
    await setMyCards(updatedCards);
    myFieldRef.set({ cards: updatedCards });
  };
  
  const changeCardFace = async (card, isFaceUp) => {
    const updatedCards = myCards.map(c => 
      c.uuid === card.uuid ? { ...c, isFaceUp: isFaceUp } : c
    );
    await setMyCards(updatedCards);
    myFieldRef.set({ cards: updatedCards });
  };

  const renderField = (field, cards, handCards, deckCards, isOpponent) => (
    <div className={styles.field}>
      {field.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((_, colIndex) => {
            const card = cards.find(c => c.position.row === rowIndex && c.position.col === colIndex);
            return (
              <Cell
                key={colIndex}
                rowIndex={rowIndex}
                colIndex={colIndex}
                card={card}
                onDrop={isOpponent ? null : onDrop}
                onDragOver={isOpponent ? null : onDragOver}
                onDragStart={isOpponent ? null : onDragStart}
                changeCardOrientation={isOpponent ? null : changeCardOrientation}
                changeCardFace={isOpponent ? null : changeCardFace}
                returnToHand={isOpponent ? null : returnToHand}
                isOpponent={isOpponent}
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
              addFieldCard={isOpponent ? null : addFieldCard}
              onRightClick={isOpponent ? null : returnToDeck}
              isOpponent={isOpponent}
            />
          ))}
        </div>
        <div
          className={styles.deck}
          onClick={isOpponent ? null : addHandCard}
          onDrop={isOpponent ? null : deckOnDrop}
          onDragOver={isOpponent ? null : onDragOver}
        >
          デッキ{deckCards.length}
        </div>
      </div>
      {!isOpponent && (
        <>
          <button onClick={resetDeckAndFieldAndHand}>リセット</button>
          <button onClick={shuffleDeck}>シャッフル</button>
        </>
      )}
    </div>
  );

  return (
    <div>
      <div className={styles.opponentPlayRoom}>
        {renderField(opponentField, opponentCards, opponentHandCards, opponentDeckCards, true)}
      </div>
      <div className={styles.myPlayRoom}>
        {renderField(myField, myCards, myHandCards, myDeckCards, false)}
      </div>
    </div>
  );
}

export default _PlayRoom