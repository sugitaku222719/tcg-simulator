import React, { useState } from 'react'

function CardRegistrationForm() {
  const [cards, setCards] = useState([]);
  const [cardName, setCardName] = useState("");
  return (
    <div>
      <label htmlFor="cardName" >cardName:</label>
      <input
        type="text"
        id="cardName"
        value={cardName}
        onChange={(event) => {setCardName(event.target.value)}}
      />
    </div>
  )
}

export default CardRegistrationForm
