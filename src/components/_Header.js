import React from 'react';
import SignOut from './SignOut';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import styles from '@/styles/_Header.module.css';

function _Header() {
  return (
    <AppBar position="static" className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        <Box className={styles.logoContainer}>
          <Typography variant="h4" className={styles.logoText}>
            TCG
          </Typography>
          <Typography variant="h4" className={styles.logoText}>
            SIMULATOR
          </Typography>
        </Box>
        <Box className={styles.navContainer}>
          <Link href="/" passHref>
            <Button color="inherit" className={styles.navButton}>エントランス</Button>
          </Link>
          <Link href="/cardRegistration" passHref>
            <Button color="inherit" className={styles.navButton}>カード登録画面</Button>
          </Link>
          <Link href="/deckRegistration/deckIndex" passHref>
            <Button color="inherit" className={styles.navButton}>デッキ登録画面</Button>
          </Link>
          <Link href="/playRoom/roomCreate" passHref>
            <Button color="inherit" className={styles.navButton}>対戦部屋</Button>
          </Link>
        </Box>
        <SignOut />
      </Toolbar>
    </AppBar>
  );
}

export default _Header;