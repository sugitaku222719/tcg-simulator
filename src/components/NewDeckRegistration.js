import React from 'react'
import _Header from './_Header'
import _NewDeckRegistration from './_NewDeckRegistration'

function NewDeckRegistration() {
  return (
    <div>
      <_Header />
      <h1>デッキ登録画面</h1>
      <_NewDeckRegistration />
    </div>
  )
}

export default NewDeckRegistration
