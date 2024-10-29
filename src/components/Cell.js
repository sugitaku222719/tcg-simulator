import React from 'react';
import Card from './Card';
import styles from "@/styles/Cell.module.css";

const Cell = ({ rowIndex, colIndex, card, onDrop, onDragOver, onDragStart, onRightClick }) => {
  return (
    <div
      className={styles.cell}
      onDrop={(e) => onDrop(e, rowIndex, colIndex)}
      onDragOver={onDragOver}
    >
      {card && (
        <Card
          card={card}
          onDragStart={onDragStart}
          onRightClick={onRightClick} // 右クリック用のプロップを追加
        />
      )}
    </div>
  );
};

export default Cell;