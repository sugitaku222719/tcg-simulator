import React from 'react'
import _Header from './_Header'
import _DeckEdit from './_DeckEdit'
import { useRouter } from 'next/router'

function DeckEdit() {
  const router = useRouter()
  const { deckName } = router.query
  return (
    <div>
      <_Header />
      <h1>{ deckName }</h1>
      <_DeckEdit />
    </div>
  )
}

export default DeckEdit
