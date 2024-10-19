import React from 'react';
import styles from './styles/PlayRoom.module.css';
import { useDrag, useDrop } from 'react-dnd';

const CARD_TYPE = 'CARD';

const Card = ({ id, content, moveCard }) => {
  const [, drag] = useDrag(() => ({
    type: CARD_TYPE,
    item: { id },
  }));

  return (
    <div ref={drag} className={styles.card}>
      {content}
    </div>
  );
};

const Field = ({ cards, moveCard }) => {
  const [, drop] = useDrop({
    accept: CARD_TYPE,
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      moveCard(item.id, delta);
    },
  });

  return (
    <div ref={drop} className={styles.field}>
      {cards.map((card, index) => (
        <Card key={index} id={card.id} content={card.content} moveCard={moveCard} />
      ))}
    </div>
  );
};

const PlayRoom = () => {
  const playerCards = [
    { id: 1, content: 'Player Card 1' },
    { id: 2, content: 'Player Card 2' },
    { id: 3, content: 'Player Card 3' },
  ];

  const opponentCards = [
    { id: 4, content: 'Opponent Card 1' },
    { id: 5, content: 'Opponent Card 2' },
    { id: 6, content: 'Opponent Card 3' },
  ];

  const moveCard = (id, delta) => {
    console.log(`Move card with id ${id} by delta`, delta);
    // ここでカードの位置を更新するロジックを追加します
  };

  return (
    <div className={styles.playRoom}>
      <div className={styles.opponentField}>
        <Field cards={opponentCards} moveCard={moveCard} />
        <div className={styles.opponentHand}>
          {opponentCards.map((card, index) => (
            <Card key={index} id={card.id} content={card.content} moveCard={moveCard} />
          ))}
        </div>
        <div className={styles.opponentDeck}>Opponent Deck</div>
      </div>

      <div className={styles.playerField}>
        <Field cards={playerCards} moveCard={moveCard} />
        <div className={styles.playerHand}>
          {playerCards.map((card, index) => (
            <Card key={index} id={card.id} content={card.content} moveCard={moveCard} />
          ))}
        </div>
        <div className={styles.playerDeck}>Player Deck</div>
      </div>
    </div>
  );
};

export default PlayRoom;