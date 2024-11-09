import React, { useEffect, useState } from 'react'
import styles from "../styles/_PlayRoom.module.css"
import Cell from './Cell';
import { auth, db } from '../lib/Firebase';
import HandCard from './HandCard';
import { Modal } from '@mui/material';
import { NetworkCellSharp } from '@mui/icons-material';
import CardDetails from './CardDetails';
// import DeckOptions from './DeckOptions';
import DeckModal from './DeckModal';
import TrashModal from './TrashModal';

function _PlayRoom({roomId, roomData}) {
  const [myField, setMyField] = useState(Array(20).fill().map(() => Array(60).fill(null)));
  const [opponentField, setOpponentField] = useState(Array(20).fill().map(() => Array(60).fill(null)));
  const [myCards, setMyCards] = useState([]);
  const [opponentCards, setOpponentCards] = useState([]);
  const [myDeckCards, setMyDeckCards] = useState([]);
  const [opponentDeckCards, setOpponentDeckCards] = useState([]);
  const [myHandCards, setMyHandCards] = useState([]);
  const [opponentHandCards, setOpponentHandCards] = useState([]);
  const [myTrashCards, setMyTrashCards] = useState([]);
  const [opponentTrashCards, setOpponentTrashCards] = useState([]);
  const [mySideDeckCards, setMySideDeckCards] = useState([]);
  const [opponentSideDeckCards, setOpponentSideDeckCards] = useState([]);
  const hostUserUid = roomData.hostUserId;
  const guestUserUid = roomData.guestUserId;
  const isHost = roomData.hostUserId === auth.currentUser.uid;
  const isGuest = roomData.guestUserId === auth.currentUser.uid;

  const myUserUid = isHost ? hostUserUid : guestUserUid;
  const opponentUserUid = isHost ? guestUserUid : hostUserUid;

  const myDeckRef = db.collection('roomsDataBase').doc(roomId).collection(myUserUid).doc("deck");
  const myFieldRef = db.collection('roomsDataBase').doc(roomId).collection(myUserUid).doc("field");
  const myHandRef = db.collection('roomsDataBase').doc(roomId).collection(myUserUid).doc("hand");
  const myTrashRef = db.collection('roomsDataBase').doc(roomId).collection(myUserUid).doc("trash");
  const mySideDeckRef = db.collection('roomsDataBase').doc(roomId).collection(myUserUid).doc("sideDeck");
  const opponentDeckRef = db.collection('roomsDataBase').doc(roomId).collection(opponentUserUid).doc("deck");
  const opponentFieldRef = db.collection('roomsDataBase').doc(roomId).collection(opponentUserUid).doc("field");
  const opponentHandRef = db.collection('roomsDataBase').doc(roomId).collection(opponentUserUid).doc("hand");
  const opponentTrashRef = db.collection('roomsDataBase').doc(roomId).collection(opponentUserUid).doc("trash");
  const opponentSideDeckRef = db.collection('roomsDataBase').doc(roomId).collection(opponentUserUid).doc("sideDeck");
  const [showDeckOptions, setShowDeckOptions] = useState(false);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [deckModalPosition, setDeckModalPosition] = useState({ x: 0, y: 0 });
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [showMyTrashModal, setShowMyTrashModal] = useState(false);
  const [showOpponentTrashModal, setShowOpponentTrashModal] = useState(false);
  const [showSideDeckModal, setShowSideDeckModal] = useState(false);
  const [selectedSideDeckCard, setSelectedSideDeckCard] = useState(null);
  const [showOrientationModal, setShowOrientationModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

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

    const unsubscribeMyTrash = myTrashRef.onSnapshot((doc) => {
      if (doc.exists) {
        setMyTrashCards(doc.data().cards || []);
      }
    });

    const unsubscribeMySideDeck = mySideDeckRef.onSnapshot((doc) => {
      if (doc.exists) {
        setMySideDeckCards(doc.data().cards || []);
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

    const unsubscribeOpponentTrash = opponentTrashRef.onSnapshot((doc) => {
      if (doc.exists) {
        setOpponentTrashCards(doc.data().cards || []);
      }
    });

    const unsubscribeOpponentSideDeck = opponentSideDeckRef.onSnapshot((doc) => {
      if (doc.exists) {
        setOpponentSideDeckCards(doc.data().cards || []);
      }
    });

    return () => {
      unsubscribeMyDeck();
      unsubscribeMyField();
      unsubscribeMyHand();
      unsubscribeMyTrash();
      unsubscribeMySideDeck();
      unsubscribeOpponentDeck();
      unsubscribeOpponentField();
      unsubscribeOpponentHand();
      unsubscribeOpponentTrash();
      unsubscribeOpponentSideDeck();
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

  const handleDeckRightClick = (e) => {
    e.preventDefault();
    setDeckModalPosition({ x: e.clientX, y: e.clientY });
    setShowDeckOptions(true);
  };

  const handleDeckOptionClick = (option) => {
    switch(option) {
      case 'draw':
        addHandCard();
        break;
      case 'search':
        setShowDeckModal(true);
        break;
      case 'shuffle':
        shuffleDeck();
        break;
      default:
        break;
    }
    setShowDeckOptions(false);
  };

  const handleCardSearch = (card) => {
    addHandCard(card);
    setShowDeckModal(false);
  };

  const addHandCard = async (selectedCard = null) => {
    if (!myDeckCards || myDeckCards.length === 0) return;
    
    let newCard;
    let updatedDeckCards;
    
    if (selectedCard && typeof selectedCard === 'object' && !('_reactName' in selectedCard)) {
      // selectedCardがカードオブジェクトの場合
      newCard = { ...selectedCard };
      updatedDeckCards = myDeckCards.filter(card => card.uuid && card.uuid !== selectedCard.uuid);
    } else {
      // デッキから1枚引く場合
      newCard = { ...myDeckCards[0] };
      updatedDeckCards = myDeckCards.slice(1);
    }
    
    console.log("New card:", newCard);
    
    const updatedHandCards = [...myHandCards, newCard];
    await setMyHandCards(updatedHandCards);
    await setMyDeckCards(updatedDeckCards);
    
    // Firestoreに保存する前にデータを整形
    const deckData = { cards: updatedDeckCards.map(card => ({...card, cardRef: null})) };
    const handData = { cards: updatedHandCards.map(card => ({...card, cardRef: null})) };
  
    await myDeckRef.set(deckData);
    await myHandRef.set(handData);
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

    const mySideDeckDocId = isHost ? roomData.hostSideDeckDocId : roomData.guestSideDeckDocId;
    if (mySideDeckDocId){
      const deckRef = db
      .collection('cardsDataBase')
      .doc(myUserUid)
      .collection('userDeckList')
      .doc(mySideDeckDocId)
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

      await setMySideDeckCards(initialDeck);
      mySideDeckRef.set({ cards: initialDeck });
    }else{
      await setMySideDeckCards([]);
      mySideDeckRef.set({ cards: [] });
    }
  
    await setMyDeckCards(initialDeck);
    await setMyCards([]);
    await setMyHandCards([]);
    await setMyTrashCards([]);
  
    myDeckRef.set({ cards: initialDeck });
    myFieldRef.set({ cards: [] });
    myHandRef.set({ cards: [] });
    myTrashRef.set({ cards: [] });
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

  const addToTrash = async (card) => {
    const updatedTrashCards = [...myTrashCards, card];
    await setMyTrashCards(updatedTrashCards);
    await setMyCards(myCards.filter((c) => c.uuid !== card.uuid));
    myTrashRef.set({ cards: updatedTrashCards });
    myFieldRef.set({ cards: myCards.filter((c) => c.uuid !== card.uuid) });
  };

  const handleTrashClick = (isOpponent) => {
    if (isOpponent) {
      setShowOpponentTrashModal(true);
    } else {
      setShowMyTrashModal(true);
    }
  };

  const handleTrashCardClick = async (card, isOpponent) => {
    if (isOpponent) return; // 相手の捨て札からカードを取ることはできない

    const updatedHandCards = [...myHandCards, card];
    await setMyHandCards(updatedHandCards);
    await setMyTrashCards(myTrashCards.filter((c) => c.uuid !== card.uuid));
    myHandRef.set({ cards: updatedHandCards });
    myTrashRef.set({ cards: myTrashCards.filter((c) => c.uuid !== card.uuid) });
    setShowMyTrashModal(false);
  };

  const handleSideDeckClick = () => {
    setShowSideDeckModal(true);
  };

  const handleSideDeckCardClick = (card) => {
    setSelectedSideDeckCard(card);
    setShowSideDeckModal(false);
    setShowOrientationModal(true);
  };

  const handleOrientationSelect = async (orientation) => {
    if (!selectedSideDeckCard) return;

    const [isVertical, isFaceUp] = orientation.split('-');
    const updatedCard = {
      ...selectedSideDeckCard,
      position: { row: 10, col: 30 }, // フィールドの中央付近に配置
      isVertical: isVertical === 'vertical',
      isFaceUp: isFaceUp === 'up'
    };

    const updatedCards = [...myCards, updatedCard];
    const updatedSideDeckCards = mySideDeckCards.filter((c) => c.uuid !== selectedSideDeckCard.uuid);

    await setMyCards(updatedCards);
    await setMySideDeckCards(updatedSideDeckCards);

    myFieldRef.set({ cards: updatedCards });
    mySideDeckRef.set({ cards: updatedSideDeckCards });

    setSelectedSideDeckCard(null);
    setShowOrientationModal(false);
  };

  const returnToSideDeck = async (card) => {
    const updatedSideDeckCards = [...mySideDeckCards, card];
    await setMySideDeckCards(updatedSideDeckCards);
    await setMyCards(myCards.filter((c) => c.uuid !== card.uuid));
    mySideDeckRef.set({ cards: updatedSideDeckCards });
    myFieldRef.set({ cards: myCards.filter((c) => c.uuid !== card.uuid) });
  };

  const renderField = (field, cards, handCards, deckCards, trashCards, sideDeckCards, isOpponent) => (
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
                addToTrash={isOpponent ? null : addToTrash}
                returnToSideDeck={isOpponent ? null : returnToSideDeck} // この行を追加
                isOpponent={isOpponent}
              />
            );
          })}
        </div>
      ))}
      <div className={styles.deckAndHand}>
        <div 
          className={styles.sideDeck} 
          onClick={isOpponent ? null : handleSideDeckClick}
        >
          サイドデッキ<br />{sideDeckCards.length}
        </div>
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
        <div className={styles.deckWrapper}>
          <div 
            className={styles.deck}
            onClick={() => addHandCard()}  // 引数なしで呼び出す
            onContextMenu={isOpponent ? null : handleDeckRightClick}
            onDrop={isOpponent ? null : deckOnDrop}
            onDragOver={isOpponent ? null : onDragOver}
          >
            デッキ{deckCards.length}
          </div>
          {!isOpponent && showDeckOptions && (
            <div
              className={styles.deckOptions}
            >
              <button onClick={() => handleDeckOptionClick('draw')}>カードを上から1枚引く</button>
              <button onClick={() => handleDeckOptionClick('search')}>カードを探す</button>
              <button onClick={() => handleDeckOptionClick('shuffle')}>シャッフルする</button>
              <button onClick={() => setShowDeckOptions(false)}>キャンセル</button>
            </div>
          )}
        </div>
        <div 
          className={styles.trashBox} 
          onClick={() => handleTrashClick(isOpponent)}
        >
          捨て札 {trashCards.length}
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
        {renderField(opponentField, opponentCards, opponentHandCards, opponentDeckCards, opponentTrashCards, opponentSideDeckCards, true)}
      </div>
      <div className={styles.myPlayRoom}>
        {renderField(myField, myCards, myHandCards, myDeckCards, myTrashCards, mySideDeckCards, false)}
      </div>
      <DeckModal 
        showDeckModal={showDeckModal}
        setShowDeckModal={setShowDeckModal}
        myDeckCards={myDeckCards}
        handleCardSearch={handleCardSearch}
        hoveredCard={hoveredCard}
        setHoveredCard={setHoveredCard}
      />
      <TrashModal 
        showModal={showMyTrashModal}
        setShowModal={setShowMyTrashModal}
        trashCards={myTrashCards}
        handleTrashCardClick={handleTrashCardClick}
        isOpponent={false}
        hoveredCard={hoveredCard}
        setHoveredCard={setHoveredCard}
      />

      <TrashModal 
        showModal={showOpponentTrashModal}
        setShowModal={setShowOpponentTrashModal}
        trashCards={opponentTrashCards}
        handleTrashCardClick={handleTrashCardClick}
        isOpponent={true}
        hoveredCard={hoveredCard}
        setHoveredCard={setHoveredCard}
      />

      <Modal open={showSideDeckModal} onClose={() => setShowSideDeckModal(false)} aria-labelledby="サイドデッキの中身">
        <div className={styles.deckModal}>
          <h2 id="サイドデッキの中身">サイドデッキの中身</h2>
          <div className={styles.deckCards}>
            {mySideDeckCards.map(card => (
              <div
                key={card.uuid}
                onClick={() => handleSideDeckCardClick(card)}
                onMouseEnter={() => setHoveredCard(card)}
                onMouseLeave={() => setHoveredCard(null)}
                className={styles.deckCardWrapper}
              >
                <div className={styles.cardDetails}>
                  {hoveredCard && hoveredCard.uuid === card.uuid && (
                    <CardDetails card={card} />
                  )}
                </div>
                <div className={styles.deckCard}>
                  <div>{card.cardName}</div>
                  <div>
                    <img src={card.cardImageUrl || ""} alt={card.cardName} width="100" height="120" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setShowSideDeckModal(false)}>閉じる</button>
        </div>
      </Modal>
      <Modal
        open={showOrientationModal}
        onClose={() => setShowOrientationModal(false)}
        aria-labelledby="カードの向きを選択"
      >
        <div className={styles.orientationModal}>
          <h2 id="カードの向きを選択">カードの向きを選択</h2>
          <div className={styles.orientationOptions}>
            <button onClick={() => handleOrientationSelect('vertical-up')}>縦（表）</button>
            <button onClick={() => handleOrientationSelect('vertical-down')}>縦（裏）</button>
            <button onClick={() => handleOrientationSelect('horizontal-up')}>横（表）</button>
            <button onClick={() => handleOrientationSelect('horizontal-down')}>横（裏）</button>
          </div>
          <button onClick={() => setShowOrientationModal(false)}>キャンセル</button>
        </div>
      </Modal>
    </div>
  );
}

export default _PlayRoom