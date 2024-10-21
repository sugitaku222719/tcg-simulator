import CardRegistration from '@/components/CardRegistration';
import { auth } from '@/lib/Firebase';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function UserPage() {
  const router = useRouter()
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid)
        if (router.query.id !== user.uid) {
          router.push(`/cardRegistration/${user.uid}`, undefined, { shallow: true })
        }
      } else {
        setError('User not authenticated')
        router.push('/') // ログインページにリダイレクト
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <CardRegistration />
    </div>
  )
}