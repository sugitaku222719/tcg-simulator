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
  const [isAlertShown, setIsAlertShown] = useState(false)

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
          if (!isAlertShown) {
            setIsAlertShown(true)
            alert("デッキが見つかりませんでした")
            console.log("デッキが見つかりませんでした")
            setIsAlertShown(false)
          }
        }
      } catch (error) {
        if (!isAlertShown) {
          setIsAlertShown(true)
          alert("データ取得中にエラーが発生しました")
          console.error("データ取得中にエラーが発生しました:", error)
          setIsAlertShown(false)
        }
      }
    }

    getDeckData()
  }, [deckDocId, isAlertShown])

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