import { auth } from '@/lib/Firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useEffect, useState } from 'react'
import CardRegistration from '@/components/CardRegistration';
import Entrance from '@/components/Entrance';
import { useRouter } from 'next/router';

function cardRegistration() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [isAlertShown, setIsAlertShown] = useState(false);

  useEffect(() => {
    if (!loading && !user && !isAlertShown) {
      setIsAlertShown(true);
      alert("ログインしてください");
    }
  }, [user, loading, isAlertShown]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? <CardRegistration /> : <Entrance />}
    </div>
  )
}

export default cardRegistration