import SignIn from '@/components/SignIn'
import { auth } from '@/lib/Firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import React from 'react'
import Entrance from '@/components/Entrance';

function index() {
  const [user] = useAuthState(auth);
  return (
    <div>
      {user ? <Entrance /> : <SignIn />}
    </div>
  )
}

export default index
