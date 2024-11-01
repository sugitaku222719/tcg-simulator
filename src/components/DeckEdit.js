import React, { useState, useEffect } from 'react'
import _Header from './_Header'
import _DeckEdit from './_DeckEdit'
import { useRouter } from 'next/router'
import { auth, db } from '@/lib/Firebase'
import styles from '@/styles/DeckEdit.module.css'

function DeckEdit() {
  const router = useRouter()
  const { deckDocId } = router.query
  const [deckData, setDeckData] = useState(null)

  useEffect(() => {
    if (!deckDocId) return

    const getDeckData = async () => {
      try {
        const deckRef = await db
          .collection('cardsDataBase')
          .doc(auth.currentUser.uid)
          .collection('userDeckList')
          .doc(deckDocId)
          .get()

        if (deckRef.exists) {
          setDeckData(deckRef.data())
        } else {
          console.log("デッキが見つかりませんでした")
        }
      } catch (error) {
        console.error("データ取得中にエラーが発生しました:", error)
      }
    }

    getDeckData()
  }, [deckDocId])

  return (
    <div className="page-container">
      <_Header />
      <main className={`main-content ${styles.deckEditContainer}`}>
        <h1 className={`page-title ${styles.deckTitle}`}>
          {deckData ? deckData.name : "ローディング中..."}
        </h1>
        <div className={styles.deckEditContent}>
          <_DeckEdit />
        </div>
      </main>
    </div>
  )
}

export default DeckEdit