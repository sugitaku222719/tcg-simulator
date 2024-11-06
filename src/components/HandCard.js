import React, { useState } from 'react';
import styles from "@/styles/HandCard.module.css";
import CardDetails from './CardDetails';

const HandCard = ({ card, addFieldCard, onRightClick, isOpponent }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showOrientation, setShowOrientation] = useState(false);

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (onRightClick) {
      onRightClick(card);
    }
  };

  const handleClick = () => {
    if (!isOpponent) {
      setShowOrientation(true);
    }
  };

  const handleOrientation = (isVertical) => {
    if (addFieldCard) {
      addFieldCard(card, isVertical);
    }
    setShowOrientation(false);
  };

  return (
    <div className={`${styles.card} ${isOpponent ? styles.opponentCard : ''}`}
         draggable={!isOpponent}
         onClick={handleClick}
         onContextMenu={isOpponent ? null : handleContextMenu}
         onMouseEnter={() => setShowDetails(true)}
         onMouseLeave={() => setShowDetails(false)}>
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
          {showOrientation && (
            <div className={styles.orientationChoice}>
              <button onClick={() => handleOrientation(true)}>縦向き</button>
              <button onClick={() => handleOrientation(false)}>横向き</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HandCard;