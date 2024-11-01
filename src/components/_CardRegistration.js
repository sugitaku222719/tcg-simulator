import { auth, db, storage } from '@/lib/Firebase';
import React, { useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import styles from "@/styles/_CardRegistration.module.css";
import { TextField, Button, Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function _CardRegistration() {
  const [cards, setCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [cardName, setCardName] = useState("");
  const [cardText, setCardText] = useState("");
  const [cardType, setCardType] = useState("");
  const [cardStats, setCardStats] = useState("");
  const [cardImage, setCardImage] = useState(null);

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
    } catch (error) {
      alert('エラーが発生しました');
      console.error('エラーが発生しました: ', error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setCardImage(file);
  };

  const cardListItems = cards.map((card) => {
    if (editingCard && editingCard.cardId === card.cardId) {
      return (
        <li key={card.cardId} className={styles.editingCard}>
          <Box component="form" noValidate autoComplete="off" sx={{ '& > :not(style)': { m: 1 } }}>
            <TextField
              label="Card Name"
              variant="outlined"
              fullWidth
              required
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
            <TextField
              label="Card Text"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={cardText}
              onChange={(e) => setCardText(e.target.value)}
            />
            <TextField
              label="Card Type"
              variant="outlined"
              fullWidth
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
            />
            <TextField
              label="Card Stats"
              variant="outlined"
              fullWidth
              value={cardStats}
              onChange={(e) => setCardStats(e.target.value)}
            />
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept=".png, .jpeg, .jpg"
                onChange={handleImageChange}
              />
            </Button>
            <Button variant="contained" color="primary" onClick={saveCard}>
              保存
            </Button>
            <Button variant="contained" color="secondary" onClick={cancelEditing}>
              キャンセル
            </Button>
          </Box>
        </li>
      );
    }
    return (
      <li key={card.cardId} className={styles.cardItem}>
        <ul className={styles.cardDetails}>
          <div>
            <li>
              <img className={styles.cardImage} src={card.cardImageUrl || ""} alt={card.cardName} />
            </li>
          </div>
          <div className={styles.cardNameAndMore}>
            <li>Name: {card.cardName}</li>
            <li>Type: {card.cardType}</li>
            <li>Stats: {card.cardStats}</li>
          </div>
          <div className={styles.cardTextBox}>
            <li>{card.cardText ? convertNewlinesToBr(card.cardText) : "No text"}</li>
          </div>
        </ul>
        <Button variant="contained" color="primary" onClick={() => startEditing(card)}>編集</Button>
        <Button variant="contained" color="secondary" onClick={() => deleteCard(card.cardId)}>削除</Button>
      </li>
    );
  });

  return (
    <div className={styles.cardRegistration}>
      <ul className={styles.cardList}>{cardListItems}</ul>
    </div>
  );
}

export default _CardRegistration;