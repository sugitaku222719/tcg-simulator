import React, { useState } from 'react';
import styles from "@/styles/Card.module.css";
import CardDetails from './CardDetails';

const Card = ({ card, onDragStart, onRightClick, isVertical, isFaceUp, isOpponent }) => {
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

  const shouldShowDetails = () => {
    if (!isOpponent) {
      return true; // 自分のカードは常に詳細を表示
    }
    return isFaceUp; // 相手のカードは表向きの場合のみ詳細を表示
  };

  return (
    <div
      className={`${styles.cardWrapper} ${isVertical ? '' : styles.horizontal}`}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <div
        className={`${styles.card} ${!isFaceUp ? styles.cardBack : ''}`}
        draggable={onDragStart ? true : false}
        onDragStart={handleDragStart}
        onContextMenu={handleContextMenu}
      >
        {isFaceUp ? (
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
      {showDetails && shouldShowDetails() && (
        <div className={`${styles.detailsWrapper} ${isVertical ? '' : styles.horizontalDetails}`}>
          <CardDetails card={card} />
        </div>
      )}
    </div>
  );
};

export default Card;