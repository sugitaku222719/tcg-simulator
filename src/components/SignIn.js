import React from 'react';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { auth } from '@/lib/Firebase.js';

const LoginButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: theme.palette.primary.main,
  padding: '8px 24px',
  borderRadius: '20px',
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#f5f5f5',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
}));

function SignIn() {
  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <LoginButton
        variant="contained"
        onClick={signInWithGoogle}
        startIcon={<GoogleIcon />}
      >
        Googleでログイン
      </LoginButton>
    </Box>
  );
}

export default SignIn;