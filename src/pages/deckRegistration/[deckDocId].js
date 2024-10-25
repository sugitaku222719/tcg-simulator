import SignIn from '@/components/SignIn'
import { auth } from '@/lib/Firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import React from 'react'
import DeckEdit from '@/components/DeckEdit';

function deckNamePage() {
  const [user] = useAuthState(auth);
  return (
    <div>
      {user ? <DeckEdit /> : <SignIn />}
    </div>
  )
}

export default deckNamePage
