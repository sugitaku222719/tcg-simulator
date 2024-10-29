import React from 'react'
import _Header from './_Header'
import _PlayRoom from './_PlayRoom'


function PlayRoom({roomId, roomData}) {
  return (
    <div>
      <_Header />
      <h1>プレイルーム</h1>
      <_PlayRoom 
        roomId={roomId}
        roomData={roomData}
        />
    </div>
  )
}

export default PlayRoom
