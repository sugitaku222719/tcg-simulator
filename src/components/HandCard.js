import React, { useState } from 'react';
import styles from "@/styles/HandCard.module.css";
import CardDetails from './CardDetails';

const HandCard = ({ card, addFieldCard, onRightClick, isOpponent }) => {
  const [showDetails, setShowDetails] = useState(false);

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
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {isOpponent ? (
        <div className={styles.cardBack}></div>
      ) : (
        <>
          <div>{card.cardName}</div>
          <div>
            <img src={card.cardImageUrl || ""} alt={card.cardName} width="100" height="120" />
          </div>
          {showDetails && (
            <div className={styles.detailsWrapper}>
              <CardDetails card={card} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HandCard;