import React from 'react'
import SignOut from './SignOut'
import Link from 'next/link'

function _Header() {
  return (
    <div 
    style={{ display:'flex', justifyContent:'space-between' }
    }>
      <div>
        <h1 style={{color:'red'}}>TCG</h1>
        <h1 style={{color:'red'}}>SIMULATOR</h1>
      </div>
      <Link href="/" style={{fontSize:'30px'}}>エントランス</Link>
      <Link href="/cardRegistration" style={{fontSize:'30px'}}>カード登録画面</Link>
      <Link href="/deckRegistration/deckIndex" style={{fontSize:'30px'}}>デッキ登録画面</Link>
      <Link href="/" style={{fontSize:'30px'}}>対戦部屋</Link>
      <SignOut />
    </div>
  )
}

export default _Header
