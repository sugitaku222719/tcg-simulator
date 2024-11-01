import { auth, db, storage } from '@/lib/Firebase';
import React, { useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import styles from "@/styles/_CardRegistration.module.css"

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

  const cardListItems = cards.map((card) => {
    if (editingCard && editingCard.cardId === card.cardId) {
      return (
        <li key={card.cardId} className={styles.editingCard}>
          <input
            className={styles.input}
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Card Name"
          />
          <input
            className={styles.input}
            type="text"
            value={cardText}
            onChange={(e) => setCardText(e.target.value)}
            placeholder="Card Text"
          />
          <input
            className={styles.input}
            type="text"
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
            placeholder="Card Type"
          />
          <input
            className={styles.input}
            type="text"
            value={cardStats}
            onChange={(e) => setCardStats(e.target.value)}
            placeholder="Card Stats"
          />
          <input
            className={styles.fileInput}
            type="file"
            accept=".png, .jpeg, .jpg"
            onChange={(e) => setCardImage(e.target.files[0])}
          />
          <button className={styles.saveButton} onClick={saveCard}>保存</button>
          <button className={styles.cancelButton} onClick={cancelEditing}>キャンセル</button>
        </li>
      );
    }

    return (
      <li key={card.cardId} className={styles.cardItem}>
        <ul className={styles.cardDetails}>
          <div>
            <li>
              <img
                className={styles.cardImage}
                src={card.cardImageUrl || ""}
                alt={card.cardName}
              />
            </li>
          </div>
          <div className={styles.cardNameAndMore}>
            <li>Name: {card.cardName}</li>
            <li>Type: {card.cardType}</li>
            <li>Stats: {card.cardStats}</li>
          </div>
          <div className={styles.cardTextBox}>
            <li>{card.cardText || "No text"}</li>
          </div>
        </ul>
        <button className={styles.editButton} onClick={() => startEditing(card)}>編集</button>
        <button className={styles.deleteButton} onClick={() => deleteCard(card.cardId)}>削除</button>
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