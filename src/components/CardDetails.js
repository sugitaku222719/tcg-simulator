import React from 'react';
import styles from "@/styles/CardDetails.module.css";
import useNewlineToBr from '@/hooks/useNewlineToBr';

const CardDetails = ({ card }) => {
  const convertNewlinesToBr = useNewlineToBr();
  return (
    <div className={styles.cardDetails}>
      <h3>{card.cardName}</h3>
      <p>Type: {card.cardType}</p>
      <p>Stats: {card.cardStats}</p>
      <p>Text: {convertNewlinesToBr(card.cardText)}</p>
    </div>
  );
};

export default CardDetails;