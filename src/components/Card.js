import React from 'react';
import styles from "@/styles/Card.module.css";

const Card = ({ card, onDragStart, onRightClick }) => {
  const handleContextMenu = (e) => {
    e.preventDefault();
    if (onRightClick) {
      onRightClick(card);
    }
  };

  const handleDragStart = (e) => {
    if (onDragStart) {
      onDragStart(e, card);
    }
  };

  return (
    <div
      className={styles.card}
      draggable={onDragStart ? true : false}
      onDragStart={handleDragStart}
      onContextMenu={handleContextMenu}
    >
      <div>{card.cardName}</div>
      <div>
        <img
          src={card.cardImageUrl || ""}
          alt={card.cardName}
          width="100"
          height="120"
        />
      </div>
    </div>
  );
};

export default Card;