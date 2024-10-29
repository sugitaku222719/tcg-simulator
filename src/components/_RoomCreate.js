import { auth, db } from '@/lib/Firebase'
import roomCreate from '@/pages/playRoom/roomCreate';
import { useRouter } from 'next/router';
import React, { useState } from 'react'

function _RoomCreate() {
  const [deckDocId, setDeckDocId] = useState("");
  const [guestUid, setGuestUid] = useState("");
  const [hostUid, setHostUid] = useState("");
  const [deckCards, setDeckCards] = useState([]);
  const router = useRouter();

  const roomCreateFunction = async (hostUid,guestUid) => {
    const roomId = `${hostUid}-${guestUid}`
    try {
      const deckRef = db
        .collection('cardsDataBase')
        .doc(auth.currentUser.uid)
        .collection('userDeckList')
        .doc(deckDocId)
        .collection("cards");
      const snapshot = await deckRef.get();
      const _cards = snapshot.docs.map((doc) => ({
        cardDocId: doc.id,
        ...doc.data(),
      }));
      const roomRef = db
      .collection("roomsDataBase")
      .doc(roomId)
      await roomRef.set({
        hostUserId: hostUid,
        guestUserId: guestUid,
        createdAt: new Date(),
      });
      const roomDeckRef = db
        .collection("roomsDataBase")
        .doc(roomId)
        .collection(auth.currentUser.uid)
        .doc("deck");
      const deck = _cards.map(card => {
        return{
          ...card,
          position: {row: 3, col: 3}
        };
      });
      await roomDeckRef.set({cards: deck});
      alert("部屋が作成されました");
      router.push(`/playRoom/${roomId}`);
    } catch (error) {
      alert("エラーが発生しました");
      console.error('エラーが発生しました: ', error);
    };
  };

  const roomCreateButton = () => {
    roomCreateFunction(auth.currentUser.uid, guestUid)
  }

  const roomEnteringButton = () => {
    roomCreateFunction(hostUid, auth.currentUser.uid)
  }

  return (
    <div>
      <h2>あなたのuid　:　{auth.currentUser.uid}</h2>
      <h3>あなたがホストの場合</h3>
      <div>あなたが使用するデッキのIDと対戦相手のuidを入力してください</div>
      <div>
        <label htmlFor="guestUid">ゲストのuid:</label>
        <input
          type="text"
          id="guestUid"
          value={guestUid}
          onChange={(event) => setGuestUid(event.target.value)}
        />
      </div>
      <div>
      <label htmlFor="deckDocId">deckId:</label>
        <input
          type="text"
          id="deckDocId"
          value={deckDocId}
          onChange={(event) => setDeckDocId(event.target.value)}
        />
        <button onClick={roomCreateButton}>部屋作成</button>
      </div>
      <h3>あなたがゲストの場合</h3>
      <div>あなたが使用するデッキのIDと対戦相手のuidを入力してください</div>
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
        <label htmlFor="deckDocId">deckId:</label>
        <input
          type="text"
          id="deckDocId"
          value={deckDocId}
          onChange={(event) => setDeckDocId(event.target.value)}
        />
        <button onClick={roomEnteringButton}>部屋入室</button>
      </div>
    </div>
  )
}

export default _RoomCreate
