import React, { useState } from 'react';
import styles from '../styles/PlayRoom.module.css';
import { useDrag, useDrop } from 'react-dnd';

const CARD_TYPE = 'CARD';

// カードコンポーネント（手札と場のカードを表示）
const Card = ({ id, content, index, moveCard }) => {
  const [, drag] = useDrag(() => ({
    type: CARD_TYPE,
    item: { id, index },
  }));

  return (
    <div ref={drag} className={styles.card}>
      {content}
    </div>
  );
};

// フィールドスロット（場のカードが配置される場所）
const FieldSlot = ({ index, card, moveCard }) => {
  const [, drop] = useDrop({
    accept: CARD_TYPE,
    drop: (item) => {
      moveCard(item.index, index);
    },
  });

  return (
    <div ref={drop} className={styles.fieldSlot}>
      {card ? <Card id={card.id} content={card.content} index={index} moveCard={moveCard} /> : null}
    </div>
  );
};

// フィールド（場全体を管理）
const Field = ({ cards, moveCard }) => {
  return (
    <div className={styles.field}>
      {cards.map((card, index) => (
        <FieldSlot key={index} index={index} card={card} moveCard={moveCard} />
      ))}
    </div>
  );
};

// 手札コンポーネント（手札のカードを管理）
const Hand = ({ cards, moveCard }) => {
  return (
    <div className={styles.hand}>
      {cards.map((card, index) => (
        card && <Card key={index} id={card.id} content={card.content} index={index} moveCard={moveCard} />
      ))}
    </div>
  );
};

const PlayRoom = () => {
  const initialPlayerHand = [
    { id: 1, content: 'Player Hand Card 1' },
    { id: 2, content: 'Player Hand Card 2' },
    { id: 3, content: 'Player Hand Card 3' },
  ];

  const initialOpponentHand = [
    { id: 4, content: 'Opponent Hand Card 1' },
    { id: 5, content: 'Opponent Hand Card 2' },
    { id: 6, content: 'Opponent Hand Card 3' },
  ];

  const initialFieldCards = [null, null, null]; // 場は初期では空

  const [playerField, setPlayerField] = useState([...initialFieldCards]);
  const [opponentField, setOpponentField] = useState([...initialFieldCards]);
  const [playerHand, setPlayerHand] = useState([...initialPlayerHand]);
  const [opponentHand, setOpponentHand] = useState([...initialOpponentHand]);

  // プレイヤーの手札から場にカードを移動
  const moveCardToPlayerField = (fromIndex, toIndex) => {
    setPlayerHand((prevHand) => {
      const updatedHand = [...prevHand];
      const movedCard = updatedHand[fromIndex];

      setPlayerField((prevField) => {
        const updatedField = [...prevField];
        updatedField[toIndex] = movedCard;
        return updatedField;
      });

      updatedHand[fromIndex] = null;
      return updatedHand;
    });
  };

  // 相手の手札から場にカードを移動
  const moveCardToOpponentField = (fromIndex, toIndex) => {
    setOpponentHand((prevHand) => {
      const updatedHand = [...prevHand];
      const movedCard = updatedHand[fromIndex];

      setOpponentField((prevField) => {
        const updatedField = [...prevField];
        updatedField[toIndex] = movedCard;
        return updatedField;
      });

      updatedHand[fromIndex] = null;
      return updatedHand;
    });
  };

  return (
    <div className={styles.playRoom}>
      {/* 相手のフィールド */}
      <div className={styles.opponentField}>
        <Field cards={opponentField} moveCard={moveCardToOpponentField} />
        <Hand cards={opponentHand} moveCard={moveCardToOpponentField} />
        <div className={styles.opponentDeck}>Opponent Deck</div>
      </div>

      {/* プレイヤーのフィールド */}
      <div className={styles.playerField}>
        <Field cards={playerField} moveCard={moveCardToPlayerField} />
        <Hand cards={playerHand} moveCard={moveCardToPlayerField} />
        <div className={styles.playerDeck}>Player Deck</div>
      </div>
    </div>
  );
};

export default PlayRoom;
