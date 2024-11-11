import { auth } from '@/lib/Firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useEffect, useState } from 'react'
import Entrance from '@/components/Entrance';
import { useRouter } from 'next/router';
import RoomCreate from '@/components/RoomCreate';

function roomCreate() {
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
      {user ? <RoomCreate /> : <Entrance />}
    </div>
  )
}

export default roomCreate
