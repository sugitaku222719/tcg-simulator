import SignIn from '@/components/SignIn'
import { auth } from '@/lib/Firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import React from 'react'
import NewDeckRegistration from '@/components/NewDeckRegistration';

function newDeck() {
  const [user] = useAuthState(auth);
  return (
    <div>
      {user ? <NewDeckRegistration /> : <SignIn />}
    </div>
  )
}

export default newDeck
