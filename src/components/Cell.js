import React from 'react';
import Card from './Card';
import styles from "@/styles/Cell.module.css";

const Cell = ({ rowIndex, colIndex, card, onDrop, onDragOver, onDragStart, changeCardOrientation, changeCardFace, returnToHand, addToTrash, returnToSideDeck, isOpponent, onCardUpdate }) => {
  return (
    <div 
      className={styles.cell}
      onDrop={(e) => onDrop(e, rowIndex, colIndex)}
      onDragOver={onDragOver}
    >
      {card && (
        <Card
          card={card}
          onDragStart={onDragStart}
          changeCardOrientation={changeCardOrientation}
          changeCardFace={changeCardFace}
          returnToHand={returnToHand}
          addToTrash={addToTrash}
          returnToSideDeck={returnToSideDeck}
          isVertical={card.isVertical}
          isFaceUp={card.isFaceUp}
          isOpponent={isOpponent}
          onCardUpdate={onCardUpdate}
        />
      )}
    </div>
  );
};

export default Cell;