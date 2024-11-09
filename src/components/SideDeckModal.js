import React from 'react';
import { Modal } from '@mui/material';
import styles from "../styles/_PlayRoom.module.css";
import CardDetails from './CardDetails';

const SideDeckModal = ({ showModal, setShowModal, sideDeckCards, handleSideDeckCardClick, hoveredCard, setHoveredCard }) => {
  return (
    <Modal open={showModal} onClose={() => setShowModal(false)} aria-labelledby="サイドデッキの中身">
      <div className={styles.deckModal}>
        <h2 id="サイドデッキの中身">サイドデッキの中身</h2>
        <div className={styles.deckCards}>
          {sideDeckCards.map(card => (
            <div key={card.uuid} 
                 onClick={() => handleSideDeckCardClick(card)}
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

export default SideDeckModal;