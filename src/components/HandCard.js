import React from 'react';
import styles from "@/styles/HandCard.module.css";

const HandCard = ({ card, addFieldCard, onRightClick, isOpponent }) => {
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
      className={`${styles.card} ${isOpponent ? styles.opponentCard : ''}`}
      draggable={!isOpponent}
      onClick={isOpponent ? null : handleClick}
      onContextMenu={isOpponent ? null : handleContextMenu}
    >
      {isOpponent ? (
        <div className={styles.cardBack}></div>
      ) : (
        <>
          <div>{card.cardName}</div>
          <div>
            <img
              src={card.cardImageUrl || ""}
              alt={card.cardName}
              width="100"
              height="120"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default HandCard;