import { auth, db, storage } from '@/lib/Firebase';
import React, { useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
        <li key={card.cardId}>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Card Name"
          />
          <input
            type="text"
            value={cardText}
            onChange={(e) => setCardText(e.target.value)}
            placeholder="Card Text"
          />
          <input
            type="text"
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
            placeholder="Card Type"
          />
          <input
            type="text"
            value={cardStats}
            onChange={(e) => setCardStats(e.target.value)}
            placeholder="Card Stats"
          />
          <input
            type="file"
            accept=".png, .jpeg, .jpg"
            onChange={(e) => setCardImage(e.target.files[0])}
          />
          <button onClick={saveCard}>保存</button>
          <button onClick={cancelEditing}>キャンセル</button>
        </li>
      );
    }

    return (
      <li key={card.cardId}>
        <ul>
          <li>ID: {card.cardId}</li>
          <li>Name: {card.cardName}</li>
          <li>Text: {card.cardText}</li>
          <li>Type: {card.cardType}</li>
          <li>Stats: {card.cardStats}</li>
          <li>
            <img
              src={card.cardImageUrl || ""}
              alt={card.cardName}
              width="100"
              height="140"
            />
          </li>
        </ul>
        <button onClick={() => startEditing(card)}>編集</button>
        <button onClick={() => deleteCard(card.cardId)}>削除</button>
      </li>
    );
  });

  return (
    <div>
      <ul>{cardListItems}</ul>
    </div>
  );
}

export default _CardRegistration;