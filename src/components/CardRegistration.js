import React from 'react'
import CardRegistrationForm from './CardRegistrationForm'
import CardIndex from './CardIndex'
import Header from './Header'


function CardRegistration() {
  return (
    <div>
      <Header />
      <h1>カード登録画面</h1>
      <CardRegistrationForm/>
      <CardIndex/>
    </div>
  )
}

export default CardRegistration
