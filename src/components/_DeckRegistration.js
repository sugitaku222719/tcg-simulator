import { useRouter } from 'next/router'
import React from 'react'

function _DeckRegistration() {
  const router = useRouter()
  const { deckName } = router.query
  return (
    <div>
      <h1>{ deckName }</h1>
    </div>
  )
}

export default _DeckRegistration
