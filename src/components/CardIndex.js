import { storage } from '@/lib/Firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import React, { useState } from 'react'

function CardIndex() {
  const [cardImageUrl, setCardImageUrl] = useState("");
  const cardIndexButton = async () => {
    const gsReference = ref(storage, 'gs://tcg-simulator-2dfd2.appspot.com/image/MUVw0ZYuifgmK0l8p2PnKJLah712/design.jpg');
    const url = await getDownloadURL(gsReference)
    setCardImageUrl(url)
  }
  return (
    <div>
      <button onClick={cardIndexButton}>表示</button>
      <div>
        <img src={cardImageUrl} alt="" width="100" height="160"/>
      </div>
    </div>
    
  )
}

export default CardIndex
