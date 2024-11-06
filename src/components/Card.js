import React, { useState } from 'react';
import styles from "@/styles/Card.module.css";
import CardDetails from './CardDetails';

const Card = ({ card, onDragStart, changeCardOrientation, changeCardFace, returnToHand, isVertical, isFaceUp, isOpponent }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (!isOpponent) {
      setShowContextMenu(true);
    }
  };

  const handleDragStart = (e) => {
    if (onDragStart) {
      onDragStart(e, card);
    }
  };

  const handleOptionClick = (action) => {
    switch (action) {
      case 'vertical':
        changeCardOrientation(card, true);
        break;
      case 'horizontal':
        changeCardOrientation(card, false);
        break;
      case 'faceUp':
        changeCardFace(card, true);
        break;
      case 'faceDown':
        changeCardFace(card, false);
        break;
      case 'returnToHand':
        returnToHand(card);
        break;
      default:
        break;
    }
    setShowContextMenu(false);
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
          {showContextMenu && (
            <div className={styles.contextMenu}>
              <button onClick={() => handleOptionClick('vertical')}>縦にする</button>
              <button onClick={() => handleOptionClick('horizontal')}>横にする</button>
              <button onClick={() => handleOptionClick('faceUp')}>表にする</button>
              <button onClick={() => handleOptionClick('faceDown')}>裏にする</button>
              <button onClick={() => handleOptionClick('returnToHand')}>手札に戻す</button>
              <button onClick={() => setShowContextMenu(false)}>キャンセル</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;