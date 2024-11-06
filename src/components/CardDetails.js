import React from 'react';
import styles from "@/styles/CardDetails.module.css";

const CardDetails = ({ card }) => {
  return (
    <div className={styles.cardDetails}>
      <h3>{card.cardName}</h3>
      <p>Type: {card.cardType}</p>
      <p>Stats: {card.cardStats}</p>
      <p>Text: {card.cardText}</p>
    </div>
  );
};

export default CardDetails;