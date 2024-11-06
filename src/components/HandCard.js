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

  const handleOrientation = (isVertical, isFaceUp) => {
    if (addFieldCard) {
      addFieldCard(card, isVertical, isFaceUp);
    }
    setShowOrientation(false);
  };

  const handleCancel = () => {
    setShowOrientation(false);
  };

  return (
    <div 
      className={`${styles.card} ${isOpponent ? styles.opponentCard : ''}`}
      draggable={!isOpponent}
      onClick={handleClick}
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
          {showOrientation && (
            <div className={styles.orientationChoice}>
              <button onClick={() => handleOrientation(true, true)}>縦向き(表)</button>
              <button onClick={() => handleOrientation(true, false)}>縦向き(裏)</button>
              <button onClick={() => handleOrientation(false, true)}>横向き(表)</button>
              <button onClick={() => handleOrientation(false, false)}>横向き(裏)</button>
              <button onClick={handleCancel}>キャンセル</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HandCard;