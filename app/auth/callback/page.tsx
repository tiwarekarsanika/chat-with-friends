'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '~/lib/supabase-browser'

export default function OAuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.getSession()

      if (error) {
        console.error('OAuth error:', error)
        router.replace('/auth/error')
      } else {
        router.replace('/')
      }
    }

    handleOAuthRedirect()
  }, [router])

  return <p>Signing you in...</p>
}
