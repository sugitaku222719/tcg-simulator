import React from 'react';
import _Header from './_Header';
import _DeckIndex from './_DeckIndex';
import Link from 'next/link';
import { Container, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import styles from '@/styles/DeckIndex.module.css';

function DeckIndex() {
  return (
    <div className="page-container">
      <_Header />
      <main className={`main-content ${styles.deckIndexPage}`}>
        <Container maxWidth="lg" className={styles.container}>
          <Typography variant="h2" component="h1" className={`page-title ${styles.title}`}>
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
      </main>
    </div>
  );
}

export default DeckIndex;