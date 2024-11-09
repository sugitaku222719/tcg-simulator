import React from 'react';
import styles from "../styles/_PlayRoom.module.css";
import CardDetails from './CardDetails';
import { Modal } from '@mui/material';

const TrashModal = ({ showModal, setShowModal, trashCards, handleTrashCardClick, isOpponent, hoveredCard, setHoveredCard }) => {
  const title = isOpponent ? "相手の捨て札の中身" : "自分の捨て札の中身";

  return (
    <Modal open={showModal} onClose={() => setShowModal(false)} aria-labelledby={title}>
      <div className={styles.deckModal}>
        <h2 id={title}>{title}</h2>
        <div className={styles.deckCards}>
          {trashCards.map(card => (
            <div key={card.uuid} 
                 onClick={() => !isOpponent && handleTrashCardClick(card, isOpponent)}
                 onMouseEnter={() => setHoveredCard(card)}
                 onMouseLeave={() => setHoveredCard(null)}
                 className={styles.deckCardWrapper}>
              <div className={styles.cardDetails}>
                {hoveredCard && hoveredCard.uuid === card.uuid && (
                  <CardDetails card={card} />
                )}
              </div>
              <div className={styles.deckCard}>
                <div>{card.cardName}</div>
                <div>
                  <img src={card.cardImageUrl || ""} alt={card.cardName} width="100" height="120" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setShowModal(false)}>閉じる</button>
      </div>
    </Modal>
  );
};

export default TrashModal;