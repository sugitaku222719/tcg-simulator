import React from 'react'
import _Header from './_Header'
import _RoomCreate from './_RoomCreate'

function RoomCreate() {
  return (
    <div className="page-container">
      <_Header />
      <main className="main-content">
        <h1 className="page-title">ルーム作成</h1>
        <_RoomCreate />
      </main>
    </div>
  )
}

export default RoomCreate