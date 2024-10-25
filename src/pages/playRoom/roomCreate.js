import SignIn from '@/components/SignIn'
import { auth } from '@/lib/Firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import React from 'react'
import RoomCreate from '@/components/RoomCreate';

function roomCreate() {
  const [user] = useAuthState(auth);
  return (
    <div>
      {user ? <RoomCreate /> : <SignIn />}
    </div>
  )
}

export default roomCreate
