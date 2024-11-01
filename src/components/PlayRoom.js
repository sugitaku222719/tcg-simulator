import React from 'react'
import _Header from './_Header'
import _PlayRoom from './_PlayRoom'

function PlayRoom({roomId, roomData}) {
  return (
    <div className="page-container">
      <_Header />
      <main className="main-content">
        <h1 className="page-title">プレイルーム</h1>
        <_PlayRoom 
          roomId={roomId}
          roomData={roomData}
        />
      </main>
    </div>
  )
}

export default PlayRoom