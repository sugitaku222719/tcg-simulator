import Link from 'next/link'
import React from 'react'
import SignOut from './SignOut'

function Entrance() {
  return (
    <div>
      <SignOut />
      <Link href="/cardRegistration">カード登録画面へ遷移</Link>
    </div>
  )
}

export default Entrance
