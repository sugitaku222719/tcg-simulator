import React, { useEffect, useState } from 'react'
import styles from "../styles/_PlayRoom.module.css"

function _PlayRoom() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // 初期カードの設定
    setCards([
      { id: 1, name: 'デッキ(ホスト)', area: 'deckHost' },
      { id: 2, name: 'デッキ(ゲスト)', area: 'deckGuest' },
      { id: 3, name: 'カード(ホスト)1', area: 'handHost' },
      { id: 4, name: 'カード(ホスト)2', area: 'handHost' },
      { id: 5, name: 'カード(ホスト)3', area: 'handHost' },
      { id: 6, name: 'カード(ゲスト)1', area: 'handGuest' },
      { id: 7, name: 'カード(ゲスト)2', area: 'handGuest' },
      { id: 8, name: 'カード(ゲスト)3', area: 'handGuest' },
      { id: 9, name: 'カード(ゲスト)4', area: 'handGuest' },
      { id: 10, name: 'カード(ホスト)4', area: 'mainHost' },
      { id: 11, name: 'カード(ホスト)5', area: 'mainHost' },
      { id: 12, name: 'カード(ホスト)6', area: 'mainHost' },
      { id: 13, name: 'カード(ホスト)7', area: 'mainHost' },
      { id: 14, name: 'カード(ホスト)8', area: 'mainHost' },
      { id: 15, name: 'カード(ゲスト)5', area: 'mainGuest' },
      { id: 16, name: 'カード(ゲスト)6', area: 'mainGuest' },
    ]);
  }, []);

  const handleDragStart = (e, cardId) => {
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handleDrop = (e, newArea) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === parseInt(cardId) ? { ...card, area: newArea } : card
      )
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const renderArea = (areaName) => (
    <div
      className={styles[areaName]}
      onDrop={(e) => handleDrop(e, areaName)}
      onDragOver={handleDragOver}
    >
      {cards
        .filter((card) => card.area === areaName)
        .map((card) => (
          <div
            key={card.id}
            className={styles.card}
            draggable
            onDragStart={(e) => handleDragStart(e, card.id)}
          >
            {card.name}
          </div>
        ))}
    </div>
  );

  return (
    <div className={styles.playRoom}>
      <div className={styles.topSection}>
        {renderArea('deckHost')}
        {renderArea('handHost')}
        {renderArea('mainHost')}
      </div>
      <div className={styles.bottomSection}>
        {renderArea('mainGuest')}
        {renderArea('handGuest')}
        {renderArea('deckGuest')}
      </div>
    </div>
  );
};

export default _PlayRoom
