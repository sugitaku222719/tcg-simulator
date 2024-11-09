import React from 'react';
import styles from "../styles/_PlayRoom.module.css";
import CardDetails from './CardDetails';
import { Modal } from '@mui/material';

const DeckModal = ({ showDeckModal, setShowDeckModal, myDeckCards, handleCardSearch, hoveredCard, setHoveredCard }) => {
  return (
    <Modal open={showDeckModal} onClose={() => setShowDeckModal(false)} aria-labelledby="デッキの中身">
      <div className={styles.deckModal}>
        <h2 id="デッキの中身">デッキの中身</h2>
        <div className={styles.deckCards}>
          {myDeckCards.map(card => (
            <div key={card.uuid} 
                 onClick={() => handleCardSearch(card)}
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
        <button onClick={() => setShowDeckModal(false)}>閉じる</button>
      </div>
    </Modal>
  );
};

export default DeckModal;