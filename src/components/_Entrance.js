import React from 'react';
import styles from "@/styles/_Entrance.module.css"
import firebase from"firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { auth } from '@/lib/Firebase.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';

function _Entrance() {
  const [user] = useAuthState(auth);
  function signInWithGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>TCG Simulator</h1>
        <div className={styles.menuContainer}>
          {!user ? 
            <button onClick={signInWithGoogle} className={styles.menuButton}>ログイン</button>
            :<button onClick={() => auth.signOut()} className={styles.menuButton}>ログアウト</button>
          }
          <Link href="/cardRegistration" className={styles.menuButton}>カード登録</Link>
          <Link href="/deckRegistration/deckIndex" className={styles.menuButton}>デッキ登録</Link>
          <Link href="/playRoom/roomCreate" className={styles.menuButton}>対戦部屋</Link>
        </div>
      </div>
    </div>
  )
}

export default _Entrance