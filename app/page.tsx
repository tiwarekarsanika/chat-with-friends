'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@supabase/auth-helpers-react'
import { LogoutButton } from '~/components/logout-button'
import { useMessagesQuery } from '../hooks/use-messages-query'
import { storeMessage } from '../lib/store-messages'

export default function HomePage() {
  const [input, setInput] = useState('')
  const user = useUser()
  const router = useRouter()
  const [chatId, setChatId] = useState('general') // Default chat room
  const messages = useMessagesQuery(chatId)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  const sendMessage = async () => {
    if (!input.trim() || !user) return
    await storeMessage({ chatId, senderId: user.id, content: input })
    setInput('')
  }

  // Show loading state while checking authentication
  if (!user) {
    return <div>Loading...</div>
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
        <div className="flex flex-col h-full border rounded shadow p-4">
          <div className="flex-1 overflow-y-auto space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded ${
                  msg.sender_id === user.id ? 'bg-blue-200 self-end' : 'bg-gray-100'
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
          <div className="mt-4 flex">
            <input
              className="flex-1 border p-2 rounded-l"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              className="bg-blue-500 text-white px-4 rounded-r"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

