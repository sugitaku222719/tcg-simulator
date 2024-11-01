import React from 'react';
import _Header from './_Header';
import _DeckIndex from './_DeckIndex';
import Link from 'next/link';
import { Container, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import styles from '@/styles/DeckIndex.module.css';

function DeckIndex() {
  return (
    <div className={styles.deckIndexPage}>
      <_Header />
      <Container maxWidth="lg" className={styles.container}>
        <Typography variant="h2" component="h1" className={styles.title}>
          デッキ登録画面
        </Typography>
        <Link href="/deckRegistration/newDeck" passHref>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            className={styles.newDeckButton}
          >
            New deck create
          </Button>
        </Link>
        <_DeckIndex />
      </Container>
    </div>
  );
}

export default DeckIndex;