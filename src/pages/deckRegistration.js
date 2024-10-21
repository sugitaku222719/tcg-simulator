import SignIn from '@/components/SignIn'
import { auth } from '@/lib/Firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import React from 'react'
import DeckRegistration from '@/components/DeckRegistration';

function deckRegistration() {
  const [user] = useAuthState(auth);
  return (
    <div>
      {user ? <DeckRegistration /> : <SignIn />}
    </div>
  )
}

export default deckRegistration
