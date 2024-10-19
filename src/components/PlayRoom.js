import React, { useState, useEffect } from 'react';
import styles from '../styles/PlayRoom.module.css';

const PlayRoom = () => {
  const [myField, setMyField] = useState(Array(10).fill().map(() => Array(50).fill(null)));
  const [opponentField, setOpponentField] = useState(Array(10).fill().map(() => Array(50).fill(null)));
  const [hand, setHand] = useState([]);
  const [playZone, setPlayZone] = useState([]);

  useEffect(() => {
    // 初期カードの設定
    setHand([
      { id: 1, name: 'カード1' },
      { id: 2, name: 'カード2' },
      { id: 3, name: 'カード3' },
    ]);
    setPlayZone([
      { id: 4, name: 'カード4', position: { row: 0, col: 0 } },
      { id: 5, name: 'カード5', position: { row: 1, col: 1 } },
      { id: 6, name: 'カード6', position: { row: 2, col: 2 } },
    ]);
  }, []);

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(card));
  };

  const handleDrop = (e, rowIndex, colIndex) => {
    e.preventDefault();
    const card = JSON.parse(e.dataTransfer.getData('text/plain'));
    const newPlayZone = playZone.map(c => 
      c.id === card.id ? { ...c, position: { row: rowIndex, col: colIndex } } : c
    );
    setPlayZone(newPlayZone);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const renderField = (field, isOpponent) => (
    <div className={`${styles.field} ${isOpponent ? styles.opponentField : ''}`}>
      <div className={styles.playZone}>
        {field.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((_, colIndex) => {
              const card = playZone.find(c => c.position.row === rowIndex && c.position.col === colIndex);
              return (
                <div
                  key={colIndex}
                  className={styles.cell}
                  onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                  onDragOver={handleDragOver}
                >
                  {card && (
                    <div
                      className={styles.card}
                      draggable
                      onDragStart={(e) => handleDragStart(e, card)}
                    >
                      {card.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {!isOpponent && (
        <>
          <div className={styles.hand}>
            {hand.map((card) => (
              <div key={card.id} className={styles.card}>{card.name}</div>
            ))}
          </div>
          <div className={styles.deck}>デッキ1</div>
        </>
      )}
    </div>
  );

  return (
    <div className={styles.playRoom}>
      {renderField(opponentField, true)}
      {renderField(myField, false)}
    </div>
  );
};

export default PlayRoom;