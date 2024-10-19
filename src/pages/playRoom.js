import SignIn from '@/components/SignIn'
import { auth } from '@/lib/Firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import React from 'react'
import PlayRoom from '@/components/PlayRoom';

function playRoom() {
  const [user] = useAuthState(auth);
  return (
    <div>
      {user ? <PlayRoom /> : <SignIn />}
    </div>
  )
}

export default playRoom
