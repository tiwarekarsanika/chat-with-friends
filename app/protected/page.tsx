'use client'
import { useRouter } from 'next/navigation'
import { LogoutButton } from '~/components/logout-button'
import { ChatBox } from '~/components/ChatBox'
import { useEffect, useState } from 'react'
import { useUser, useSessionContext } from '@supabase/auth-helpers-react'
import { getOrCreateChat } from '~/lib/get-or-create-chat'

export default function ProtectedPage() {
  const router = useRouter()
  const user = useUser()
  const { isLoading, session, error } = useSessionContext()
  const [chatId, setChatId] = useState<string | null>(null)

  const otherUserId = 'ab91d78c-f406-44c4-9103-eee86114eba9'

  useEffect(() => {
    console.log("Auth state:", { isLoading, user, session, error })
    
    // Only redirect if we've finished loading the session and there's no user
    if (!isLoading && user === null) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router, session, error])

  useEffect(() => {
    if (user?.id) {
      getOrCreateChat([user.id, otherUserId])
        .then((id) => setChatId(id))
        .catch(console.error)
    }
  }, [user])

  // Show loading state with debug info
  if (isLoading || !user) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <p>Loading...</p>
        <p className="text-sm text-gray-500 mt-2">
          Auth state: {isLoading ? "Loading" : user ? "Authenticated" : "Not authenticated"}
        </p>
        {error && <p className="text-sm text-red-500 mt-2">Error: {error.message}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-white shadow flex justify-between items-center">
        <p>
          Hello <span className="font-medium">{user.email}</span>
        </p>
        <LogoutButton />
      </header>

      <main className="flex-1 p-4">
        <ChatBox chatId={chatId} />
      </main>
    </div>
  )
}