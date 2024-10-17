import { Button } from '@mui/material';
import React from 'react';
import firebase from"firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { auth } from '@/lib/Firebase.js';


function SignIn() {
  function signInWithGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <div>
      <Button onClick={signInWithGoogle}>Googleでログインする</Button>
    </div>
  )
}

export default SignIn
