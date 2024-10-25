import { auth } from '@/lib/Firebase'
import React from 'react'

function _RoomCreate() {
  return (
    <div>
      <div>あなたのuid　:　{auth.currentUser.uid}</div>
      <div>あなたが使用するデッキ名と対戦相手のuidを入力してください</div>
      <div></div>
      <div></div>
    </div>
  )
}

export default _RoomCreate
