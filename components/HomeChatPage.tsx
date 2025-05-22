'use client'

import { useUser, useSessionContext } from '@supabase/auth-helpers-react'
import FriendsList from '~/components/FriendsList'
import LeftNavMenu from '~/components/LeftNavMenu'
import Image from 'next/image'

export default function HomeChatPage() {
  const user = useUser()
  const { isLoading, error } = useSessionContext()

  if (isLoading || !user) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-sm text-muted-foreground">Getting things ready for you...</p>
          {error && <p className="text-sm text-red-500 mt-2">Error: {error.message}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white dark:bg-black transition-colors duration-300 flex flex-col">
      <header
        className="shadow-sm px-4 py-2 flex justify-between items-center border-b flex-shrink-0"
        style={{
          background: 'linear-gradient(to right, var(--secondary), var(--primary))',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center space-x-4">
          <Image src="/periskope_logo.svg" alt="Logo" width={80} height={40} />
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <LeftNavMenu />
        <main className="flex-1 h-full overflow-hidden">
          <div className="h-full overflow-y-auto">
            <FriendsList />
          </div>
        </main>
      </div>
    </div>
  )
}
