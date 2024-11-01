import { auth, db } from '@/lib/Firebase'
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import _DeckIndex from './_DeckIndex';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import styles from '@/styles/_RoomCreate.module.css';

function _RoomCreate() {
  const [deckDocId, setDeckDocId] = useState("");
  const router = useRouter();
  const [opponentUid, setOpponentUid] = useState("");

  const roomCreateFunction = async (hostUid, guestUid, isHost) => {
    const roomId = `${hostUid}-${guestUid}`
    try {
      const roomRef = db.collection("roomsDataBase").doc(roomId)
      if (isHost) {
        await roomRef.set({
          hostUserId: hostUid,
          guestUserId: guestUid,
          hostDeckDocId: deckDocId,
          createdAt: new Date(),
        }, { merge: true });
      } else {
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
      const deck = await Promise.all(snapshot.docs.map(async (doc) => {
        const cardRef = doc.data().cardRef;
        const cardDoc = await cardRef.get();
        return {
          cardDocId: cardDoc.id,
          uuid: doc.id,
          ...cardDoc.data(),
          position: { row: 3, col: 3 }
        };
      }));

      const roomDeckRef = db
        .collection("roomsDataBase")
        .doc(roomId)
        .collection(auth.currentUser.uid)
        .doc("deck");
      await roomDeckRef.set({ cards: deck });

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
    <Container maxWidth="md" className={styles.container}>
      <Typography variant="h4" gutterBottom className={styles.title}>
        ルーム作成
      </Typography>
      <Typography variant="h6" gutterBottom>
        あなたのUID: {auth.currentUser.uid}
      </Typography>
      <Box className={styles.formContainer}>
        <TextField
          fullWidth
          label="対戦相手のUID"
          variant="outlined"
          value={opponentUid}
          onChange={(event) => setOpponentUid(event.target.value)}
          className={styles.input}
        />
        <TextField
          fullWidth
          label="Deck ID"
          variant="outlined"
          value={deckDocId}
          onChange={(event) => setDeckDocId(event.target.value)}
          className={styles.input}
        />
        <Box className={styles.buttonContainer}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={roomCreateButton}
            className={styles.button}
          >
            部屋作成
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={roomEnteringButton}
            className={styles.button}
          >
            部屋入室
          </Button>
        </Box>
      </Box>
      <_DeckIndex />
    </Container>
  );
};

export default _RoomCreate