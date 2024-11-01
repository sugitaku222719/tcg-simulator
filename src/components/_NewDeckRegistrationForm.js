import { auth, db } from '@/lib/Firebase';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TextField, Button, Box } from '@mui/material';
import styles from '@/styles/_NewDeckRegistrationForm.module.css';

function _NewDeckRegistrationForm({ deckCards }) {
  const [deckName, setDeckName] = useState("");
  const router = useRouter();

  const deckRegistrationButton = async () => {
    if (!deckName) {
      alert("Deck Nameを入力してください");
      return;
    }
    if (deckCards.length === 0) {
      alert("デッキにカードがありません");
      return;
    }

    try {
      const deckDocId = uuidv4()
      const deckRef = db
        .collection('cardsDataBase')
        .doc(auth.currentUser.uid)
        .collection('userDeckList')
        .doc(deckDocId);

      await deckRef.set({
        name: deckName,
        createdAt: new Date(),
      });

      const batch = db.batch();
      deckCards.forEach((card) => {
        const cardDocId = uuidv4();
        const cardRef = deckRef.collection('cards').doc(cardDocId);
        batch.set(cardRef, {
          cardRef: db.collection('cardsDataBase').doc(auth.currentUser.uid).collection('userCardList').doc(card.cardId),
          uuid: cardDocId,
        });
      });

      await batch.commit();
      alert("デッキが保存されました");
      router.push(`/deckRegistration/${deckDocId}`);
    } catch (error) {
      console.error('エラーが発生しました: ', error);
    }
  };

  return (
    <Box className={styles.formContainer}>
      <TextField
        label="Deck Name"
        variant="outlined"
        fullWidth
        value={deckName}
        onChange={(event) => setDeckName(event.target.value)}
        className={styles.input}
      />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={deckRegistrationButton}
        className={styles.button}
      >
        追加
      </Button>
    </Box>
  );
}

export default _NewDeckRegistrationForm;