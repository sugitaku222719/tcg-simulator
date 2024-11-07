import { auth, db } from '@/lib/Firebase';
import React, { useEffect, useState } from 'react';
import _DeckEditButton from './_DeckEditButton';
import { useRouter } from 'next/router';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Button, List, ListItem, Modal, Box, Pagination, TextField } from '@mui/material';
import styles from '@/styles/_DeckEdit.module.css';

function _DeckEdit() {
  const [allCards, setAllCards] = useState([]);
  const [deckCards, setDeckCards] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerms, setSearchTerms] = useState({
    cardName: '',
    cardText: '',
    cardType: '',
    cardStats: ''
  });
  const cardsPerPage = 12;
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

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%', // 幅を固定値から割合に変更
    maxWidth: 1000, // 最大幅を設定
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    height: '80vh', // 高さを設定
    display: 'flex', // フレックスボックスを使用
    flexDirection: 'column', // 縦方向に並べる
  };

  const handleSearchChange = (field) => (event) => {
    setSearchTerms(prev => ({ ...prev, [field]: event.target.value }));
    setPage(1); // 検索時にページを1に戻す
  };

  const filteredCards = allCards.filter(card => 
    card.cardName.toLowerCase().includes(searchTerms.cardName.toLowerCase()) &&
    (card.cardText || '').toLowerCase().includes(searchTerms.cardText.toLowerCase()) &&
    (card.cardType || '').toLowerCase().includes(searchTerms.cardType.toLowerCase()) &&
    (card.cardStats || '').toLowerCase().includes(searchTerms.cardStats.toLowerCase())
  );

  const indexOfLastCard = page * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);

  return (
    <Container maxWidth="lg" className={styles.container}>
      <_DeckEditButton deckCards={deckCards} deckDocId={deckDocId} />
      <div className={styles.deckInfoContainer}>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          デッキ確認
        </Button>
        <Typography variant="body1" className={styles.deckCount}>
          デッキ枚数: {deckCards.length}
        </Typography>
      </div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="deck-modal-title"
        aria-describedby="deck-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="deck-modal-title" variant="h6" component="h2">
            デッキの中身
          </Typography>
          <List className={`${styles.cardList} ${styles.modalCardList}`}>
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
        </Box>
      </Modal>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>すべてのカード</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="カード名で検索"
                value={searchTerms.cardName}
                onChange={handleSearchChange('cardName')}
                className={styles.searchBar}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="テキストで検索"
                value={searchTerms.cardText}
                onChange={handleSearchChange('cardText')}
                className={styles.searchBar}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="タイプで検索"
                value={searchTerms.cardType}
                onChange={handleSearchChange('cardType')}
                className={styles.searchBar}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="スタッツで検索"
                value={searchTerms.cardStats}
                onChange={handleSearchChange('cardStats')}
                className={styles.searchBar}
              />
            </Grid>
          </Grid>
          <List className={styles.cardList}>
            {currentCards.map((card) => (
              <ListItem key={card.cardId} className={styles.cardItem}>
                <Card className={styles.card}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={card.cardImageUrl || ""}
                    alt={card.cardName}
                  />
                  <CardContent>
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
          <Pagination
            count={Math.ceil(filteredCards.length / cardsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
            className={styles.pagination}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default _DeckEdit;