import SignIn from '@/components/SignIn'
import { auth } from '@/lib/Firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import React from 'react'
import DeckEdit from '@/components/DeckEdit';
import { useRouter } from 'next/router';

function DeckNamePage({ decDocId }) {
  const [user] = useAuthState(auth);
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {user ? <DeckEdit decDocId={decDocId} /> : <SignIn />}
    </div>
  )
}

export default DeckNamePage