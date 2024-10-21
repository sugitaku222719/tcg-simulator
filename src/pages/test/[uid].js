import { useRouter } from 'next/router';
import React from 'react'

function test() {
  const router = useRouter();
  const {uid} = router.query;
  return (
    <div>
      {uid}
    </div>
  )
}

export default test
