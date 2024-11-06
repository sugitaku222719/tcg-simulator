import React, { useState } from 'react';
import styles from "@/styles/Card.module.css";
import CardDetails from './CardDetails';

const Card = ({ card, onDragStart, onRightClick, isVertical }) => {
  const [showDetails, setShowDetails] = useState(false);

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
    <div className={`${styles.cardWrapper} ${isVertical ? '' : styles.horizontal}`}>
      <div 
        className={`${styles.card} ${!card.isFaceUp ? styles.cardBack : ''}`}
        draggable={onDragStart ? true : false}
        onDragStart={handleDragStart}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
      >
        {card.isFaceUp ? (
          <>
            <div>{card.cardName}</div>
            <div>
              <img src={card.cardImageUrl || ""} alt={card.cardName} width="100" height="120" />
            </div>
          </>
        ) : (
          <div className={styles.cardBackContent}></div>
        )}
      </div>
      {showDetails && card.isFaceUp && (
        <div className={`${styles.detailsWrapper} ${isVertical ? '' : styles.horizontalDetails}`}>
          <CardDetails card={card} />
        </div>
      )}
    </div>
  );
};

export default Card;