import { auth } from '@/lib/Firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useEffect, useState } from 'react'
import DeckEdit from '@/components/DeckEdit';
import Entrance from '@/components/Entrance';
import { useRouter } from 'next/router';

function DeckNamePage({ decDocId }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [isAlertShown, setIsAlertShown] = useState(false);

  useEffect(() => {
    if (!loading && !user && !isAlertShown) {
      setIsAlertShown(true);
      alert("ログインしてください");
    }
  }, [user, loading, isAlertShown]);

  if (loading || router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? <DeckEdit decDocId={decDocId} /> : <Entrance />}
    </div>
  )
}

export default DeckNamePage