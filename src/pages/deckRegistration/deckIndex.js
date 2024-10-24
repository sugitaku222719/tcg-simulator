import SignIn from '@/components/SignIn'
import { auth } from '@/lib/Firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import React from 'react'
import DeckIndex from '@/components/DeckIndex';

function deckIndex() {
  const [user] = useAuthState(auth);
  return (
    <div>
      {user ? <DeckIndex /> : <SignIn />}
    </div>
  )
}

export default deckIndex
