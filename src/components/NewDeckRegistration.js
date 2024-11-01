import React from 'react'
import _Header from './_Header'
import _NewDeckRegistration from './_NewDeckRegistration'

function NewDeckRegistration() {
  return (
    <div className="page-container">
      <_Header />
      <main className="main-content">
        <h1 className="page-title">デッキ登録画面</h1>
        <_NewDeckRegistration />
      </main>
    </div>
  )
}

export default NewDeckRegistration