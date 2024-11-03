import SignIn from '@/components/SignIn'
import { auth } from '@/lib/Firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import React from 'react'
import DeckEdit from '@/components/DeckEdit';
import { useRouter } from 'next/router';

function DeckNamePage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { decDocId } = router.query;

  if (typeof window === 'undefined') {
    return null; // サーバーサイドレンダリング時は何も表示しない
  }

  return (
    <div>
      {user ? <DeckEdit decDocId={decDocId} /> : <SignIn />}
    </div>
  )
}

export default DeckNamePage

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
