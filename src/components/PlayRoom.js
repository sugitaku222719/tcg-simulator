import React, { useState } from 'react';
import styles from '../styles/PlayRoom.module.css';
import { useDrag, useDrop } from 'react-dnd';

const CARD_TYPE = 'CARD';

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

const FieldSlot = ({ index, card, moveCard }) => {
  const [, drop] = useDrop({
    accept: CARD_TYPE,
    drop: (item, monitor) => {
      moveCard(item.index, index);
    },
  });

  return (
    <div ref={drop} className={styles.fieldSlot}>
      {card ? <Card id={card.id} content={card.content} index={index} moveCard={moveCard} /> : null}
    </div>
  );
};

const Field = ({ cards, moveCard }) => {
  return (
    <div className={styles.field}>
      {cards.map((card, index) => (
        <FieldSlot key={index} index={index} card={card} moveCard={moveCard} />
      ))}
    </div>
  );
};

const PlayRoom = () => {
  const initialPlayerCards = [
    { id: 1, content: 'Player Card 1' },
    { id: 2, content: 'Player Card 2' },
    { id: 3, content: 'Player Card 3' },
  ];

  const initialOpponentCards = [
    { id: 4, content: 'Opponent Card 1' },
    { id: 5, content: 'Opponent Card 2' },
    { id: 6, content: 'Opponent Card 3' },
  ];

  const [playerField, setPlayerField] = useState([initialPlayerCards[0], initialPlayerCards[1], initialPlayerCards[2]]);
  const [opponentField, setOpponentField] = useState([initialOpponentCards[0], initialOpponentCards[1], initialOpponentCards[2]]);

  const moveCard = (fromIndex, toIndex) => {
    setPlayerField((prevField) => {
      const updatedField = [...prevField];
      const movedCard = updatedField[fromIndex];

      // 元の位置を空にして、新しい位置にカードを配置
      updatedField[fromIndex] = null;
      updatedField[toIndex] = movedCard;

      return updatedField;
    });
  };

  return (
    <div className={styles.playRoom}>
      <div className={styles.opponentField}>
        <Field cards={opponentField} moveCard={moveCard} />
        <div className={styles.opponentHand}>
          {opponentField.map((card, index) => (
            <Card key={index} id={card.id} content={card.content} index={index} moveCard={moveCard} />
          ))}
        </div>
        <div className={styles.opponentDeck}>Opponent Deck</div>
      </div>

      <div className={styles.playerField}>
        <Field cards={playerField} moveCard={moveCard} />
        <div className={styles.playerHand}>
          {playerField.map((card, index) => (
            <Card key={index} id={card.id} content={card.content} index={index} moveCard={moveCard} />
          ))}
        </div>
        <div className={styles.playerDeck}>Player Deck</div>
      </div>
    </div>
  );
};

export default PlayRoom;
