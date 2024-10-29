import React from 'react'
import _Header from './_Header'
import _DeckIndex from './_DeckIndex'
import Link from 'next/link'

function DeckIndex() {
  return (
    <div>
      <_Header />
      <h1>デッキ登録画面</h1>
      <Link href = "/deckRegistration/newDeck" ><button>New deck create</button></Link>
      <_DeckIndex />
    </div>
  )
}

export default DeckIndex
