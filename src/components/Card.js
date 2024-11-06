import React, { useState } from 'react';
import styles from "@/styles/Card.module.css";
import CardDetails from './CardDetails';

const Card = ({ card, onDragStart, onRightClick }) => {
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
    <div 
      className={styles.card}
      draggable={onDragStart ? true : false}
      onDragStart={handleDragStart}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <div>{card.cardName}</div>
      <div>
        <img src={card.cardImageUrl || ""} alt={card.cardName} width="100" height="120" />
      </div>
      {showDetails && <CardDetails card={card} />}
    </div>
  );
};

export default Card;