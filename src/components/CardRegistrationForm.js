import React, { useState } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { auth, storage } from '@/lib/Firebase';
import { ref, uploadBytes } from "firebase/storage"

function CardRegistrationForm() {
  const [cards, setCards] = useState([]);
  const [cardName, setCardName] = useState("");
  const [cardImage, setCardImage] = useState([]);

  const cardRegistrationButton = async () => {
    const db = firebase.firestore();
    await db
    .collection("cards")
    .add({
      cardName: cardName,
      userID: auth.currentUser.uid
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
