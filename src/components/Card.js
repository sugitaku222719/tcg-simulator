import React from 'react';
import styles from "@/styles/Card.module.css";

const Card = ({ card, onDragStart, onRightClick }) => {
  const handleContextMenu = (e) => {
    e.preventDefault(); // 右クリックのデフォルトメニューを無効化
    onRightClick(card); // カード情報を渡して関数を呼び出す
  };

  return (
    <div
      className={styles.card}
      draggable={true}
      onDragStart={(e) => onDragStart(e, card)}
      onContextMenu={handleContextMenu} // 右クリック時のイベント
    >
      {card.name}
    </div>
  );
};

export default Card;