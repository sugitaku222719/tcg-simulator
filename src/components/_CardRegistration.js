import { auth, db, storage } from '@/lib/Firebase';
import React, { useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import styles from "@/styles/_CardRegistration.module.css";
import { TextField, Button, Box, Typography, Modal } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function _CardRegistration() {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [cardName, setCardName] = useState("");
  const [cardText, setCardText] = useState("");
  const [cardType, setCardType] = useState("");
  const [cardStats, setCardStats] = useState("");
  const [cardImage, setCardImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const cardsRef = db
      .collection('cardsDataBase')
      .doc(auth.currentUser.uid)
      .collection('userCardList')
      .orderBy("cardName", "asc");

    const unsubscribe = cardsRef.onSnapshot(async (querySnapshot) => {
      const _cards = querySnapshot.docs.map((doc) => {
        return {
          cardId: doc.id,
          ...doc.data(),
        };
      });
      setCards(_cards);
    })

    return () => {
      unsubscribe();
    };
  }, []);

  const convertNewlinesToBr = (text) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index !== text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const deleteCard = async (cardId) => {
    try {
      await db
        .collection('cardsDataBase')
        .doc(auth.currentUser.uid)
        .collection('userCardList')
        .doc(cardId)
        .delete();
      alert("カードが削除されました");
      setModalOpen(false);
    } catch (error) {
      console.error("カードの削除中にエラーが発生しました:", error);
      alert("カードの削除中にエラーが発生しました");
    }
  };

  const startEditing = (card) => {
    setEditingCard(card);
    setCardName(card.cardName);
    setCardText(card.cardText);
    setCardType(card.cardType);
    setCardStats(card.cardStats);
  };

  const cancelEditing = () => {
    setEditingCard(null);
    setCardName("");
    setCardText("");
    setCardType("");
    setCardStats("");
    setCardImage(null);
  };

  const saveCard = async () => {
    if (!cardName) {
      alert("Card Nameは入力してください");
      return;
    }
    try {
      let url = editingCard.cardImageUrl;
      if (cardImage) {
        const storageRef = ref(storage, 'image/' + auth.currentUser.uid + '/' + cardImage.name);
        await uploadBytes(storageRef, cardImage);
        url = await getDownloadURL(storageRef);
      }
      await db.collection('cardsDataBase')
        .doc(auth.currentUser.uid)
        .collection('userCardList')
        .doc(editingCard.cardId)
        .update({
          cardName: cardName,
          cardText: cardText,
          cardType: cardType,
          cardStats: cardStats,
          cardImageUrl: url
        });
      alert("カードが更新されました");
      cancelEditing();
      setModalOpen(false);
    } catch (error) {
      alert('エラーが発生しました');
      console.error('エラーが発生しました: ', error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setCardImage(file);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCard(null);
    setEditingCard(null);
  };

  const cardListItems = cards.map((card) => (
    <li key={card.cardId} className={styles.cardItem} onClick={() => handleCardClick(card)}>
      <img className={styles.cardThumbnail} src={card.cardImageUrl || ""} alt={card.cardName} />
      <div className={styles.cardName}>{card.cardName}</div>
    </li>
  ));
  
  return (
    <div className={styles.cardRegistration}>
      <ul className={styles.cardList}>{cardListItems}</ul>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="card-details-modal"
        aria-describedby="card-details-description"
      >
        <Box className={styles.modalContent}>
          {selectedCard && !editingCard && (
            <>
              <div className={styles.cardDetails}>
                <div className={styles.cardImageContainer}>
                  <img className={styles.cardImage} src={selectedCard.cardImageUrl || ""} alt={selectedCard.cardName} />
                </div>
                <div className={styles.cardInfo}>
                  <Typography variant="h5" className={styles.cardTitle}>Name: {selectedCard.cardName}</Typography>
                  <Typography className={styles.cardType}>Type: {selectedCard.cardType}</Typography>
                  <Typography className={styles.cardStats}>Stats: {selectedCard.cardStats}</Typography>
                </div>
                <div className={styles.cardTextBox}>
                  <Typography className={styles.cardText}>Text: {convertNewlinesToBr(selectedCard.cardText)}</Typography>
                </div>
              </div>
              <div className={styles.buttonContainer}>
                <Button variant="contained" color="primary" className={styles.editButton} onClick={() => startEditing(selectedCard)}>編集</Button>
                <Button variant="contained" color="secondary" className={styles.deleteButton} onClick={() => deleteCard(selectedCard.cardId)}>削除</Button>
              </div>
            </>
          )}
          {editingCard && (
            <Box component="form" noValidate autoComplete="off" className={styles.editForm}>
              <TextField label="Card Name" variant="outlined" fullWidth required value={cardName} onChange={(e) => setCardName(e.target.value)} className={styles.input} />
              <TextField label="Card Text" variant="outlined" fullWidth multiline rows={4} value={cardText} onChange={(e) => setCardText(e.target.value)} className={styles.input} />
              <TextField label="Card Type" variant="outlined" fullWidth value={cardType} onChange={(e) => setCardType(e.target.value)} className={styles.input} />
              <TextField label="Card Stats" variant="outlined" fullWidth value={cardStats} onChange={(e) => setCardStats(e.target.value)} className={styles.input} />
              <Button variant="contained" component="label" startIcon={<CloudUploadIcon />} className={styles.uploadButton}>
                Upload Image
                <input type="file" hidden accept=".png,.jpeg, .jpg" onChange={handleImageChange} />
              </Button>
              <div className={styles.buttonContainer}>
                <Button variant="contained" color="primary" onClick={saveCard} className={styles.saveButton}>
                  保存
                </Button>
                <Button variant="contained" color="secondary" onClick={cancelEditing} className={styles.cancelButton}>
                  キャンセル
                </Button>
              </div>
            </Box>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default _CardRegistration;