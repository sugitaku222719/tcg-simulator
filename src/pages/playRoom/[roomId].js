import SignIn from '@/components/SignIn'
import { auth, db } from '@/lib/Firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useEffect, useState } from 'react'
import PlayRoom from '@/components/PlayRoom';
import { useRouter } from 'next/router';

function PlayRoomPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { roomId } = router.query;
  const [isAuthorizedPlayer, setIsAuthorizedPlayer] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (user && roomId) {
        try {
          const roomRef = db.collection('roomsDataBase').doc(roomId);
          const roomDoc = await roomRef.get();

          if (roomDoc.exists) {
            const roomData = roomDoc.data();
            const isHost = roomData.hostUserId === user.uid;
            const isGuest = roomData.gestUserId === user.uid;

            if (isHost || isGuest) {
              setIsAuthorizedPlayer(true);
            } else {
              router.push('/');
            }
          } else {
            console.error('Room does not exist');
            router.push('/');
          }
        } catch (error) {
          console.error('Error checking authorization:', error);
          router.push('/');
        }
      }
    };

    checkAuthorization();
  }, [user, roomId, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <SignIn />;
  }

  if (user && !isAuthorizedPlayer) {
    return <div>Checking authorization...</div>;
  }

  return <PlayRoom roomId={roomId} />;
}

export default PlayRoomPage;