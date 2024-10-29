import { auth, db } from '@/lib/Firebase'
import roomCreate from '@/pages/playRoom/roomCreate';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import _DeckIndex from './_DeckIndex';

function _RoomCreate() {
  const [deckDocId, setDeckDocId] = useState("");
  const router = useRouter();
  const [opponentUid, setOpponentUid] = useState("");

  const roomCreateFunction = async (hostUid,guestUid,isHost) => {
    const roomId = `${hostUid}-${guestUid}`
    try {
      const roomRef = db
      .collection("roomsDataBase")
      .doc(roomId)
      if (isHost){
        await roomRef.set({
          hostUserId: hostUid,
          guestUserId: guestUid,
          hostDeckDocId: deckDocId,
          createdAt: new Date(),
        }, { merge: true });
      }else{
        await roomRef.set({
          hostUserId: hostUid,
          guestUserId: guestUid,
          guestDeckDocId: deckDocId,
          createdAt: new Date(),
        }, { merge: true });
      }

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
      const deck = _cards.map(card => {
        return{
          ...card,
          position: {row: 3, col: 3}
        };
      });
      const roomDeckRef = db
        .collection("roomsDataBase")
        .doc(roomId)
        .collection(auth.currentUser.uid)
        .doc("deck");
      await roomDeckRef.set({cards: deck});

      alert("部屋が作成されました");
      router.push(`/playRoom/${roomId}`);
    } catch (error) {
      alert("エラーが発生しました");
      console.error('エラーが発生しました: ', error);
    };
  };

  const roomCreateButton = () => {
    roomCreateFunction(auth.currentUser.uid, opponentUid, true)
  }

  const roomEnteringButton = () => {
    roomCreateFunction(opponentUid, auth.currentUser.uid, false)
  }

  return (
    <div>
      <h2>あなたのuid　:　{auth.currentUser.uid}</h2>
      <div>
        <label htmlFor="opponentUid">対戦相手のuid:</label>
        <input
          type="text"
          id="opponentUid"
          value={opponentUid}
          onChange={(event) => setOpponentUid(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="deckDocId">Deck ID:</label>
          <input
            type="text"
            id="deckDocId"
            value={deckDocId}
            onChange={(event) => setDeckDocId(event.target.value)}
          />
        </div>
        <button onClick={roomCreateButton}>部屋作成</button>
        <button onClick={roomEnteringButton}>部屋入室</button>
      <_DeckIndex />
    </div>
  );
};

export default _RoomCreate
