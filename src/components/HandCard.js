import React, { useState } from 'react';
import styles from "@/styles/HandCard.module.css";
import CardDetails from './CardDetails';

const HandCard = ({ 
  card, 
  addFieldCard, 
  onRightClick,
  addToTrash,
  isOpponent 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showOrientation, setShowOrientation] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (!isOpponent) {
      setShowContextMenu(true);
    }
  };

  const handleOptionClick = (action) => {
    switch(action) {
      case 'returnToDeck':
        onRightClick(card);
        break;
      case 'addToTrash':
        addToTrash(card);
        break;
      case 'cancel':
        break;
    }
    setShowContextMenu(false);
  };

  const handleClick = (e) => {
    if (!isOpponent && !showOrientation && !showContextMenu) {
      setShowOrientation(true);
    }
  };

  const handleOrientation = (isVertical, isFaceUp) => {
    if (addFieldCard) {
      addFieldCard(card, isVertical, isFaceUp);
    }
    setShowOrientation(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setShowOrientation(false);
  };

  return (
    <div 
      className={`${styles.card} ${isOpponent ? styles.opponentCard : ''}`}
      draggable={!isOpponent}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => {setShowDetails(false);}}
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
              {showContextMenu && (
                <div className={styles.contextMenu} onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => handleOptionClick('returnToDeck')}>デッキに戻す</button>
                  <button onClick={() => handleOptionClick('addToTrash')}>捨て札に置く</button>
                  <button onClick={() => handleOptionClick('cancel')}>キャンセル</button>
                </div>
              )}
              {!showContextMenu && showOrientation && (
                <div className={styles.orientationChoice} onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => handleOrientation(true, true)}>縦向き(表)</button>
                  <button onClick={() => handleOrientation(true, false)}>縦向き(裏)</button>
                  <button onClick={() => handleOrientation(false, true)}>横向き(表)</button>
                  <button onClick={() => handleOrientation(false, false)}>横向き(裏)</button>
                  <button onClick={handleCancel}>キャンセル</button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HandCard;