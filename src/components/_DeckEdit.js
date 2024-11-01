import { auth, db } from '@/lib/Firebase';
import React, { useEffect, useState } from 'react';
import _DeckEditButton from './_DeckEditButton';
import { useRouter } from 'next/router';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Button, List, ListItem } from '@mui/material';
import styles from '@/styles/_DeckEdit.module.css';

function _DeckEdit() {
  const [allCards, setAllCards] = useState([]);
  const [deckCards, setDeckCards] = useState([]);
  const router = useRouter()
  const { deckDocId } = router.query

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

  useEffect(() => {
    if (!deckDocId) return;

    const deckCardsRef = db
      .collection('cardsDataBase')
      .doc(auth.currentUser.uid)
      .collection('userDeckList')
      .doc(deckDocId)
      .collection('cards');

    const unsubscribe = deckCardsRef.onSnapshot(async (querySnapshot) => {
      const cardPromises = querySnapshot.docs.map(async (doc) => {
        const cardRef = doc.data().cardRef;
        const cardDoc = await cardRef.get();
        return {
          deckCardId: doc.id,
          ...cardDoc.data(),
          cardId: cardDoc.id
        };
      });

      const resolvedCards = await Promise.all(cardPromises);
      setDeckCards(resolvedCards);
    });

    return () => {
      unsubscribe();
    };
  }, [deckDocId]);

  const addCardToDeck = async (card) => {
    if (!deckDocId) return;

    const deckRef = db
      .collection('cardsDataBase')
      .doc(auth.currentUser.uid)
      .collection('userDeckList')
      .doc(deckDocId);

    const cardRef = db
      .collection('cardsDataBase')
      .doc(auth.currentUser.uid)
      .collection('userCardList')
      .doc(card.cardId);

    await deckRef.collection('cards').add({
      cardRef: cardRef
    });
  };

  const removeCardFromDeck = async (deckCardId) => {
    if (!deckDocId) return;

    await db
      .collection('cardsDataBase')
      .doc(auth.currentUser.uid)
      .collection('userDeckList')
      .doc(deckDocId)
      .collection('cards')
      .doc(deckCardId)
      .delete();
  };

  return (
    <Container maxWidth="lg" className={styles.container}>
      <_DeckEditButton deckCards={deckCards} deckDocId={deckDocId} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>デッキの中身</Typography>
          <List className={styles.cardList}>
            {deckCards.map((card) => (
              <ListItem key={card.deckCardId}>
                <Card className={styles.card}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={card.cardImageUrl || ""}
                    alt={card.cardName || "該当のカードが見つかりません"}
                  />
                  <CardContent>
                    <Typography variant="body2">ID: {card.cardId}</Typography>
                    <Typography variant="body1">{card.cardName || "該当のカードが見つかりません"}</Typography>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={() => removeCardFromDeck(card.deckCardId)}
                    >
                      削除
                    </Button>
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
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => addCardToDeck(card)}
                    >
                      追加
                    </Button>
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

export default _DeckEdit;