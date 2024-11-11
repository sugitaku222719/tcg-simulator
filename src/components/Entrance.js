import React from 'react'
import _Header from './_Header'
import _Entrance from "@/components/_Entrance"

function Entrance() {
  return (
    <div className="page-container">
      <_Header />
      <main className="main-content">
        <_Entrance />
      </main>
    </div>
  )
}

export default Entrance