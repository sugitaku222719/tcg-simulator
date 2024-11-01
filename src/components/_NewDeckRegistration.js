import { auth, db } from '@/lib/Firebase';
import React, { useEffect, useState } from 'react';
import _NewDeckRegistrationForm from './_NewDeckRegistrationForm';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Button, List, ListItem } from '@mui/material';
import styles from '@/styles/_NewDeckRegistration.module.css';

function _NewDeckRegistration() {
  const [allCards, setAllCards] = useState([]);
  const [deckCards, setDeckCards] = useState([]);

  useEffect(() => {
    const cardsRef = db
      .collection('cardsDataBase')
      .doc(auth.currentUser.uid)
      .collection('userCardList')
      .orderBy("cardName", "asc");

    const unsubscribe = cardsRef.onSnapshot(async (querySnapshot) => {
      const _cards = querySnapshot.docs.map((doc) => ({
        cardId: doc.id,
        ...doc.data(),
      }));
      setAllCards(_cards);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const addCardToDeck = (card) => {
    setDeckCards([...deckCards, card]);
  };

  const removeCardFromDeck = (index) => {
    setDeckCards(deckCards.filter((_, i) => i !== index));
  };

  return (
    <Container maxWidth="lg" className={styles.container}>
      <_NewDeckRegistrationForm deckCards={deckCards} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>デッキの中身</Typography>
          <List className={styles.cardList}>
            {deckCards.map((card, index) => (
              <ListItem key={`${card.cardId}-${index}`}>
                <Card className={styles.card}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={card.cardImageUrl || ""}
                    alt={card.cardName}
                  />
                  <CardContent>
                    <Typography variant="body2">ID: {card.cardId}</Typography>
                    <Typography variant="body1">{card.cardName}</Typography>
                    <Button variant="contained" color="secondary" onClick={() => removeCardFromDeck(index)}>削除</Button>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>すべてのカード</Typography>
          <List className={styles.cardList}>
            {allCards.map((card) => (
              <ListItem key={card.cardId}>
                <Card className={styles.card}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={card.cardImageUrl || ""}
                    alt={card.cardName}
                  />
                  <CardContent>
                    <Typography variant="body2">ID: {card.cardId}</Typography>
                    <Typography variant="body1">{card.cardName}</Typography>
                    <Button variant="contained" color="primary" onClick={() => addCardToDeck(card)}>追加</Button>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
}

export default _NewDeckRegistration;