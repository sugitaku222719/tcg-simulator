import React from 'react'
import _CardRegistrationForm from './_CardRegistrationForm'
import _CardRegistration from './_CardRegistration'
import _Header from './_Header'


function CardRegistration() {
  return (
    <div>
      <_Header />
      <h1>カード登録画面</h1>
      <_CardRegistrationForm/>
      <_CardRegistration/>
    </div>
  )
}

export default CardRegistration
