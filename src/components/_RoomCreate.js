import { auth, db } from '@/lib/Firebase'
import { useRouter } from 'next/router';
import React, { useState } from 'react'

function _RoomCreate() {
  const [deckDocId, setDeckDocId] = useState("");
  const [gestUid, setGestUid] = useState("");
  const [hostUid, setHostUid] = useState("");
  const [deckCards, setDeckCards] = useState([]);
  const router = useRouter();

  const roomCreateButton = async () => {
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

      const roomID = `${auth.currentUser.uid}-${gestUid}`

      const roomRef = db
      .collection("roomsDataBase")
      .doc(roomID)
      await roomRef.set({
        hostUserId: auth.currentUser.uid,
        gestUserId: gestUid,
        hostDeckId: deckDocId,
      });

      const roomDeckRef = db
        .collection("roomsDataBase")
        .doc(roomID)
        .collection("Users")
        .doc(auth.currentUser.uid)
        .collection("playDeck")

      const batch = db.batch();
      _cards.forEach((card, index) => {
        batch.set(roomDeckRef.doc(card.cardDocId), {
          cardId: card.cardId,
          cardName: card.cardName,
          cardImageUrl: card.cardImageUrl,
          uuid: card.cardDocId,
          index: index,
        });
      });

      await batch.commit();
      alert("部屋が作成されました");
      
      // 成功後の処理（例：ページ遷移）
      router.push(`/playRoom/${roomID}`);
    } catch (error) {
      alert("エラーが発生しました");
      console.error('エラーが発生しました: ', error);
      
    }
  };
  const roomEnteringButton = async () => {
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

      const roomID = `${auth.currentUser.uid}-${gestUid}`

      const roomRef = db
      .collection("roomsDataBase")
      .doc(roomID)
      await roomRef.set({
        gestUserId: auth.currentUser.uid,
        hostUserId: gestUid,
        gestDeckId: deckDocId,
      });

      const roomDeckRef = db
        .collection("roomsDataBase")
        .doc(roomID)
        .collection("Users")
        .doc(auth.currentUser.uid)
        .collection("playDeck")

      const batch = db.batch();
      _cards.forEach((card, index) => {
        batch.set(roomDeckRef.doc(card.cardDocId), {
          cardId: card.cardId,
          cardName: card.cardName,
          cardImageUrl: card.cardImageUrl,
          uuid: card.cardDocId,
          index: index,
        });
      });

      await batch.commit();
      console.log('バッチ書き込みが成功しました。');
      
      // 成功後の処理（例：ページ遷移）
      router.push(`/playRoom/${roomID}`);
    } catch (error) {
      console.error('エラーが発生しました: ', error);
    }
  };


  return (
    <div>
      <h2>あなたのuid　:　{auth.currentUser.uid}</h2>
      <h3>あなたがホストの場合</h3>
      <div>あなたが使用するデッキのIDと対戦相手のuidを入力してください</div>
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
