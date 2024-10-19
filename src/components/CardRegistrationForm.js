import React, { useState } from 'react'
import 'firebase/compat/firestore';
import { auth, db, storage } from '@/lib/Firebase';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function CardRegistrationForm() {
  const [cardName, setCardName] = useState("");
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
          cardImage: cardImage.name,
          cardImageUrl: url  // 解決されたURLを保存
        });

        console.log('カードが正常に登録されました');
    } catch (error) {
      console.error('エラーが発生しました: ', error);
    }
  };

  return (
    <div>
      <label htmlFor="cardName" >cardName:</label>
      <input
        type="text"
        id="cardName"
        value={cardName}
        onChange={(event) => {setCardName(event.target.value)}}
      />
      <label htmlFor="cardImage" >cardImage:</label>
      <input
        type="file"
        id="cardImage"
        accept=".png, .jpeg, .jpg"
        onChange={(event) => {
          const file = event.target.files[0]
          setCardImage(file)
        }}
      />
      <button onClick={cardRegistrationButton}>追加</button>
    </div>
  )
}

export default CardRegistrationForm
