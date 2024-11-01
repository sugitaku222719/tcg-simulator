import React, { useState } from 'react'
import 'firebase/compat/firestore';
import { auth, db, storage } from '@/lib/Firebase';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import styles from '@/styles/_CardRegistrationForm.module.css';

function _CardRegistrationForm() {
  const [cardName, setCardName] = useState("");
  const [cardText, setCardText] = useState("");
  const [cardType, setCardType] = useState("");
  const [cardStats, setCardStats] = useState("");
  const [cardImage, setCardImage] = useState(null);

  const cardRegistrationButton = async () => {
    if (!cardName || !cardImage) {
      alert("Card NameとCard Imageは入力してください");
      return;
    }
    try{
      const storageRef = ref(storage, 'image/' + auth.currentUser.uid + '/' + cardImage.name);
      await uploadBytes(storageRef, cardImage);  // 画像のアップロードを待機
      const url = await getDownloadURL(storageRef);  // URLの取得を待機

      await db.collection('cardsDataBase')
        .doc(auth.currentUser.uid)
        .collection('userCardList')
        .add({
          cardName: cardName,
          cardText: cardText,
          cardType: cardType,
          cardStats: cardStats,
          cardImage: cardImage.name,
          cardImageUrl: url  // 解決されたURLを保存
        });
        alert("カードが登録されました");
        setCardName("");
        setCardText("");
        setCardType("");
        setCardStats("");
        setCardImage(null);
    } catch (error) {
      alert('エラーが発生しました');
      console.error('エラーが発生しました: ', error);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.inputGroup}>
        <label htmlFor="cardName" className={styles.label}>cardName:</label>
        <input
          type="text"
          id="cardName"
          className={styles.input}
          value={cardName}
          onChange={(event) => {setCardName(event.target.value)}}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="cardText" className={styles.label}>cardText:</label>
        <input
          type="text"
          id="cardText"
          className={styles.input}
          value={cardText}
          onChange={(event) => {setCardText(event.target.value)}}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="cardType" className={styles.label}>cardType:</label>
        <input
          type="text"
          id="cardType"
          className={styles.input}
          value={cardType}
          onChange={(event) => {setCardType(event.target.value)}}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="cardStats" className={styles.label}>cardStats:</label>
        <input
          type="text"
          id="cardStats"
          className={styles.input}
          value={cardStats}
          onChange={(event) => {setCardStats(event.target.value)}}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="cardImage" className={styles.label}>cardImage:</label>
        <input
          type="file"
          id="cardImage"
          className={styles.fileInput}
          accept=".png, .jpeg, .jpg"
          onChange={(event) => {
            const file = event.target.files[0]
            setCardImage(file)
          }}
        />
      </div>
      <button className={styles.button} onClick={cardRegistrationButton}>追加</button>
    </div>
  )
}

export default _CardRegistrationForm
