import React, { useState } from 'react'
import 'firebase/compat/firestore';
import { auth, db, storage } from '@/lib/Firebase';
import { ref, uploadBytes } from "firebase/storage";

function CardRegistrationForm() {
  const [cardName, setCardName] = useState("");
  const [cardImage, setCardImage] = useState(null);

  const cardRegistrationButton = async () => {
    if (!cardName || !cardImage) {
      alert("Card NameとCard Imageは入力してください");
      return;
    }
    await db
    .collection("cardsDataBase")
    .doc(auth.currentUser.uid)
    .collection("userCardList")
    .add({
      cardName: cardName,
      cardImage: cardImage.name
    });
    const storageRef = ref(storage, "image/" + auth.currentUser.uid + "/" + cardImage.name);
    uploadBytes(storageRef, cardImage).then((snapshot) => {
      console.log(cardImage);
    });
  }
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
