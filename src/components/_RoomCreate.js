import { auth, db } from '@/lib/Firebase'
import { useRouter } from 'next/router';
import React, { useState } from 'react'

function _RoomCreate() {
  const [deckName, setDeckName] = useState("");
  const [gestUid, setGestUid] = useState("");
  const [hostUid, setHostUid] = useState("");
  const [deckCards, setDeckCards] = useState([]);
  const router = useRouter();

  const roomCreateButton = async () => {
    try{
      const deckRef = db
        .collection('cardsDataBase')
        .doc(auth.currentUser.uid)
        .collection('userDeckList')
        .doc(deckName)
        .collection("cars");
      const _cards = deckRef.docs.map((doc) => ({
        cardId: doc.id,
        ...doc.data(),
      }));
      setDeckCards(_cards);
      const roomID = `${auth.currentUser.uid}-${gestUid}`
      const roomDeckRef = db
      .collection(roomsDataBase)
      .doc(roomID)
      .collection(Users)
      .doc(auth.currentUser.uid)

    } catch(error){};
  };
  const roomEnteringButton = () => {};
  return (
    <div>
      <h2>あなたのuid　:　{auth.currentUser.uid}</h2>
      <h3>あなたがホストの場合</h3>
      <div>あなたが使用するデッキ名と対戦相手のuidを入力してください</div>
      <div>
        <label htmlFor="gestUid">ゲストのuid:</label>
        <input
          type="text"
          id="gestUid"
          value={gestUid}
          onChange={(event) => setGestUid(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="deckName">deckName:</label>
        <input
          type="text"
          id="deckName"
          value={deckName}
          onChange={(event) => setDeckName(event.target.value)}
        />
        <button onClick={roomCreateButton}>部屋作成</button>
      </div>
      <h3>あなたがゲストの場合</h3>
      <div>あなたが使用するデッキ名と対戦相手のuidを入力してください</div>
      <div>
        <label htmlFor="hostUid">ホストのuid:</label>
        <input
          type="text"
          id="hostUid"
          value={hostUid}
          onChange={(event) => setHostUid(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="deckName">deckName:</label>
        <input
          type="text"
          id="deckName"
          value={deckName}
          onChange={(event) => setDeckName(event.target.value)}
        />
        <button onClick={roomEnteringButton}>部屋入室</button>
      </div>
    </div>
  )
}

export default _RoomCreate
