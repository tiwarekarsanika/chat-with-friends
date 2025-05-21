'use client'
import { useState } from 'react'
import { useMessagesQuery } from '../hooks/use-messages-query'
import { storeMessage } from '../lib/store-messages'
import { useUser } from '@supabase/auth-helpers-react'

export function ChatBox({ chatId }: { chatId: string }) {
  const [input, setInput] = useState('')
  const messages = useMessagesQuery(chatId)
  console.log("these are the messages: ", messages)
  console.log("this is the chatId: ", chatId)
  const user = useUser()
  console.log("this is the user: ", user)

  const sendMessage = async () => {
    if (!input.trim()) return
    await storeMessage({ chatId, senderId: user?.id!, content: input })
    setInput('')
  }

  return (
    <div className="flex flex-col h-full border rounded shadow p-4">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded ${
              msg.sender_id === user?.id ? 'bg-blue-200 self-end' : 'bg-gray-100'
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
        />
        <button
          className="bg-blue-500 text-white px-4 rounded-r"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  )
}
