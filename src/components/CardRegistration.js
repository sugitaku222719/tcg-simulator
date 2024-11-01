import React from 'react'
import _CardRegistrationForm from './_CardRegistrationForm'
import _CardRegistration from './_CardRegistration'
import _Header from './_Header'

function CardRegistration() {
  return (
    <div className="page-container">
      <_Header />
      <main className="main-content">
        <h1 className="page-title">カード登録画面</h1>
        <_CardRegistrationForm/>
        <_CardRegistration/>
      </main>
    </div>
  )
}

export default CardRegistration