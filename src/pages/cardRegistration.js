import SignIn from '@/components/SignIn'
import { auth } from '@/lib/Firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import React from 'react'
import CardRegistration from '@/components/CardRegistration';

function cardRegistration() {
  const [user] = useAuthState(auth);
  return (
    <div>
      {user ? <CardRegistration /> : <SignIn />}
    </div>
  )
}

export default cardRegistration
