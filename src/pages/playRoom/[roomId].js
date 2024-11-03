import SignIn from '@/components/SignIn';
import { auth, db } from '@/lib/Firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useEffect, useState } from 'react';
import PlayRoom from '@/components/PlayRoom';
import { useRouter } from 'next/router';

function PlayRoomPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { roomId } = router.query;
  const [isAuthorizedPlayer, setIsAuthorizedPlayer] = useState(false);
  const [roomData, setRoomData] = useState("");
  const [authorizationChecked, setAuthorizationChecked] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (user && roomId) {
        try {
          const roomRef = db.collection('roomsDataBase').doc(roomId);
          const roomDoc = await roomRef.get();

          if (roomDoc.exists) {
            const _roomData = roomDoc.data();
            setRoomData(_roomData);
            const isHost = _roomData.hostUserId === user.uid;
            const isGuest = _roomData.guestUserId === user.uid;

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
        } finally {
          setAuthorizationChecked(true);
        }
      } else if (!loading) {
        setAuthorizationChecked(true);
      }
    };

    checkAuthorization();
  }, [user, roomId, router, loading]);

  if (loading || (user && !authorizationChecked)) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <SignIn />;
  }

  if (user && !isAuthorizedPlayer) {
    return <div>Checking authorization...</div>;
  }

  if (typeof window === 'undefined') {
    return null; // サーバーサイドレンダリング時は何も表示しない
  }

  return (
    <PlayRoom
      roomId={roomId}
      roomData={roomData}
    />
  );
}

export default PlayRoomPage;

export async function getStaticProps({ params }) {
  return {
    props: { id: params.deckDocId || params.roomId },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}