import { useRouter } from 'next/router'
import React from 'react'

function deckNamePage() {
  const router = useRouter()
  const { deckName } = router.query
  return (
    <div>
      <h1>{ deckName }</h1>
    </div>
  )
}

export default deckNamePage
