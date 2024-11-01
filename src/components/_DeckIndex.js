import { auth, db } from '@/lib/Firebase';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography, Paper } from '@mui/material';
import styles from '@/styles/_DeckIndex.module.css';

function _DeckIndex() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const cardsRef = db
      .collection('cardsDataBase')
      .doc(auth.currentUser.uid)
      .collection('userDeckList')
      .orderBy("name", "asc");

    const unsubscribe = cardsRef.onSnapshot(async (querySnapshot) => {
      const _decks = querySnapshot.docs.map((doc) => {
        return {
          deckId: doc.id,
          ...doc.data(),
        };
      });
      setDecks(_decks);
    })

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className={styles.deckIndexContainer}>
      <Typography variant="h4" component="h2" className={styles.deckListTitle}>
        デッキリスト
      </Typography>
      <Paper elevation={3} className={styles.deckListPaper}>
        <List>
          {decks.map((deck) => (
            <ListItem key={deck.deckId} className={styles.deckListItem}>
              <Link href={`/deckRegistration/${deck.deckId}`} passHref>
                <ListItemText
                  primary={deck.name}
                  secondary={`Deck ID: ${deck.deckId}`}
                  className={styles.deckListItemText}
                />
              </Link>
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
}

export default _DeckIndex;