import React from 'react';
import styles from "@/styles/HandCard.module.css";

const HandCard = ({ card, addFieldCard, onRightClick }) => {
  const handleContextMenu = (e) => {
    e.preventDefault();
    if (onRightClick) {
      onRightClick(card);
    }
  };

  const handleClick = () => {
    if (addFieldCard) {
      addFieldCard(card);
    }
  };

  return (
    <div
      className={styles.card}
      draggable={addFieldCard ? true : false}
      onClick={handleClick}
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

export default HandCard;