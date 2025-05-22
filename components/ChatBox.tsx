'use client'
import { useState, useRef, useEffect } from 'react'
import { useMessagesQuery } from '../hooks/use-messages-query'
import { storeMessage } from '../lib/store-messages'
import { useUser } from '@supabase/auth-helpers-react'
import { IoSend } from 'react-icons/io5'
import {
  AiOutlinePhone,
  AiOutlineVideoCamera,
  AiOutlineMore,
  AiOutlineSmile,
  AiOutlinePaperClip
} from 'react-icons/ai'
import { FaUserCircle, FaMicrophone } from 'react-icons/fa'

export function ChatBox({ chatId }: { chatId: string }) {
  const [input, setInput] = useState('')
  const messages = useMessagesQuery(chatId)
  const user = useUser()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const sendMessage = async () => {
    if (!input.trim()) return
    await storeMessage({ chatId, senderId: user?.id!, content: input })
    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Updated function to get sender details with fallback
  const getSenderDetails = (senderId: string) => {
    if (senderId === user?.id) {
      return {
        name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'You',
        email: user?.email || 'tiwarekarsanika@gmail.com',
        phone: user?.phone || '+91 99978 44008',
      }
    }

    // Fallback if no details found
    return {
      name: 'Periskope',
      email: 'email@hashlabz.dev',
      phone: '+91 98765 12345'
    }
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4" style={{
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--background)'
      }}>
        <div className="flex items-center space-x-3">
          <FaUserCircle size={36} style={{ color: 'var(--muted-foreground)' }} />
          <div>
            <h3 className="font-medium" style={{ color: 'var(--foreground)' }}>Test El Centro</h3>
            <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <span>Roshnag Airtel, Rohirag Jio, Bharat Kumar Ramesh, Periskope</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
            <AiOutlinePhone size={20} />
          </button>
          <button className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
            <AiOutlineVideoCamera size={20} />
          </button>
          <button className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
            <AiOutlineMore size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: 'var(--grey-light)' }}>
        {/* Date Separator */}
        <div className="flex items-center justify-center mb-4">
          <div className="px-3 py-1 rounded-full shadow-sm text-xs" style={{
            backgroundColor: 'var(--background)',
            color: 'var(--muted-foreground)',
            border: '1px solid var(--border)'
          }}>
            22-01-2025
          </div>
        </div>

        {/* User Messages */}
        {messages.map((msg) => {
          const senderDetails = getSenderDetails(msg.sender_id)
          const isCurrentUser = msg.sender_id === user?.id

          return (
            <div
              key={msg.id}
              className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isCurrentUser && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-2" style={{ backgroundColor: 'var(--muted-foreground)' }}>
                  <span className="text-xs font-medium" style={{ color: 'var(--background)' }}>
                    {senderDetails.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                <div
                  className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm relative"
                  style={{
                    backgroundColor: isCurrentUser ? 'var(--color-chat-user)' : 'var(--chat-other)',
                    color: 'var(--foreground)'
                  }}
                >
                  {/* Name and Phone inside message bubble */}
                  <div className="flex justify-between items-center mb-2 gap-4">
                    <span className="text-xs font-medium" style={{ color: 'var(--secondary)' }}>
                      {senderDetails.name}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {senderDetails.phone}
                    </span>
                  </div>


                  <p className="text-sm break-words">{msg.content}</p>

                  {/* Timestamp */}
                  <div className={`flex items-center mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <span
                      className={`text-xs ${isCurrentUser ? 'opacity-75' : ''}`}
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <AiOutlinePaperClip size={20} />
          </button>
          <div className="flex-1 relative">
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="Message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <AiOutlineSmile size={20} />
            </button>
          </div>
          {input.trim() ? (
            <button
              className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors"
              onClick={sendMessage}
            >
              <IoSend size={18} />
            </button>
          ) : (
            <button className="p-3 rounded-lg hover:bg-gray-100 text-gray-600">
              <FaMicrophone size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}