import React from 'react'
import SignOut from './SignOut'
import CardRegistrationForm from './CardRegistrationForm'


function CardRegistration() {
  return (
    <div>
      <SignOut />
      <h1>カード登録画面</h1>
      <CardRegistrationForm/>
    </div>
  )
}

export default CardRegistration
