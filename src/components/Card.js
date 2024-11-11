import React, { useState } from 'react';
import styles from "@/styles/Card.module.css";
import CardDetails from './CardDetails';
import { Modal, Box, TextField, Button } from '@mui/material';

const Card = ({ 
  card, 
  onDragStart, 
  changeCardOrientation, 
  changeCardFace, 
  returnToHand, 
  addToTrash, 
  returnToSideDeck,
  returnToDeckFromField, // 追加
  isVertical, 
  isFaceUp, 
  isOpponent, 
  onCardUpdate 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedCard, setEditedCard] = useState({
    cardName: '',
    cardType: '',
    cardStats: '',
    cardText: ''
  });

  const handleDoubleClick = (e) => {
    if (!isOpponent) {
      e.preventDefault();
      setEditedCard({
        cardName: card.cardName,
        cardType: card.cardType,
        cardStats: card.cardStats,
        cardText: card.cardText
      });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    onCardUpdate(card.uuid, editedCard);
    setShowEditModal(false);
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (!isOpponent) {
      setShowContextMenu(true);
    }
  };

  const handleDragStart = (e) => {
    if (onDragStart) {
      onDragStart(e, card);
    }
  };

  const handleOptionClick = (action) => {
    switch (action) {
      case 'vertical':
        changeCardOrientation(card, true);
        break;
      case 'horizontal':
        changeCardOrientation(card, false);
        break;
      case 'faceUp':
        changeCardFace(card, true);
        break;
      case 'faceDown':
        changeCardFace(card, false);
        break;
      case 'returnToHand':
        returnToHand(card);
        break;
      case 'addToTrash':
        addToTrash(card);
        break;
      case 'returnToDeck':
        returnToDeckFromField(card);
        break;
      case 'returnToSideDeck':
        returnToSideDeck(card);
        break;
      default:
        break;
    }
    setShowContextMenu(false);
  };

  const shouldShowDetails = () => {
    if (!isOpponent) {
      return true; // 自分のカードは常に詳細を表示
    }
    return isFaceUp; // 相手のカードは表向きの場合のみ詳細を表示
  };

  return (
    <div 
      className={`${styles.cardWrapper} ${isVertical ? '' : styles.horizontal}`}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className={`${styles.card} ${!isFaceUp ? styles.cardBack : ''}`}
        draggable={onDragStart ? true : false}
        onDragStart={handleDragStart}
        onContextMenu={handleContextMenu}
      >
        {isFaceUp ? (
          <>
            <div>{card.cardName}</div>
            <div>
              <img src={card.cardImageUrl || ""} alt={card.cardName} width="100" height="120" />
            </div>
          </>
        ) : (
          <div className={styles.cardBackContent}></div>
        )}
      </div>
      {showDetails && shouldShowDetails() && (
        <div className={`${styles.detailsWrapper} ${isVertical ? '' : styles.horizontalDetails}`}>
          <div className={`${isOpponent ? styles.opponentDetails : ''}`}>
            <CardDetails card={card} />
            {showContextMenu && (
              <div className={styles.contextMenu}>
              <button onClick={() => handleOptionClick('vertical')}>縦にする</button>
              <button onClick={() => handleOptionClick('horizontal')}>横にする</button>
              <button onClick={() => handleOptionClick('faceUp')}>表にする</button>
              <button onClick={() => handleOptionClick('faceDown')}>裏にする</button>
              <button onClick={() => handleOptionClick('returnToHand')}>手札に戻す</button>
              <button onClick={() => handleOptionClick('addToTrash')}>捨て札に置く</button>
              <button onClick={() => handleOptionClick('returnToDeck')}>デッキに戻す</button>
              <button onClick={() => handleOptionClick('returnToSideDeck')}>サイドデッキに戻す</button>
              <button onClick={() => setShowContextMenu(false)}>キャンセル</button>
            </div>
            )}
          </div>
        </div>
      )}
      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
      >
        <Box sx={modalStyle}>
          <TextField
            label="カード名"
            value={editedCard.cardName}
            onChange={(e) => setEditedCard({...editedCard, cardName: e.target.value})}
            fullWidth
          />
          <TextField
            label="タイプ"
            value={editedCard.cardType}
            onChange={(e) => setEditedCard({...editedCard, cardType: e.target.value})}
            fullWidth
          />
          <TextField
            label="スタッツ"
            value={editedCard.cardStats}
            onChange={(e) => setEditedCard({...editedCard, cardStats: e.target.value})}
            fullWidth
          />
          <TextField
            label="テキスト"
            value={editedCard.cardText}
            onChange={(e) => setEditedCard({...editedCard, cardText: e.target.value})}
            multiline
            rows={4}
            fullWidth
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button onClick={() => setShowEditModal(false)} variant="outlined">
              キャンセル
            </Button>
            <Button onClick={handleSaveEdit} variant="contained">
              保存
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Card;