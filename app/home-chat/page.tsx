'use client'

import { useRouter } from 'next/navigation'
import { LogoutButton } from '~/components/logout-button'
import FriendsList from '~/components/FriendsList'
import { useEffect, useState } from 'react'
import { useUser, useSessionContext } from '@supabase/auth-helpers-react'
import LeftNavMenu from '~/components/LeftNavManu'

export default function ProtectedPage() {
  const router = useRouter()
  const user = useUser()
  const { isLoading, session, error } = useSessionContext()

  // Dark mode toggle state
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (!isLoading && user === null) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  // Apply dark mode class to HTML
  useEffect(() => {
    const root = window.document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDarkMode])

  if (isLoading || !user) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <p>Loading...</p>
        <p className="text-sm text-gray-500 mt-2">
          Auth state: {isLoading ? 'Loading' : 'Not authenticated'}
        </p>
        {error && <p className="text-sm text-red-500 mt-2">Error: {error.message}</p>}
      </div>
    )
  }

  return (
    <div className="h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Top Header */}
      <header
        className="shadow-sm px-4 py-3 flex justify-between items-center border-b"
        style={{
          backgroundColor: 'var(--background)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--primary)]">
              <span className="font-bold text-sm text-[var(--primary-foreground)]">P</span>
            </div>
            <span className="font-semibold text-[var(--foreground)]">Periskope</span>
          </div>
          <div className="text-sm text-[var(--muted-foreground)]">
            5 / 6 phones
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-sm px-2 py-1 border rounded-md bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          <span className="text-sm text-[var(--muted-foreground)]">
            Hello <span className="font-medium text-[var(--foreground)]">{user.email}</span>
          </span>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="h-full flex flex-row">
        <LeftNavMenu />
        <FriendsList />
      </main>
    </div>
  )
}
