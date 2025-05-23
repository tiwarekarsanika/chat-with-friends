'use client'
import React, { useState, useRef, useEffect } from 'react'
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
import { getUserDetailsById } from '~/lib/get-user-details'

export function ChatBox({ 
  chatId, 
  participants, 
  isGroup = false, 
  chatName = null 
}: { 
  chatId: string, 
  participants: any[], 
  isGroup?: boolean,
  chatName?: string | null 
}) {
  const [input, setInput] = useState('')
  const messages = useMessagesQuery(chatId)
  const user = useUser()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [userDetails, setUserDetails] = useState<{ [id: string]: any }>({})

  // For group chats, we don't need to find a single recipient
  const recipient = !isGroup ? participants.find((p) => p !== user?.id) : null

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isGroup) {
        // For group chats, fetch details for all participants except current user
        const userParticipants = participants.filter(id => id !== user?.id)
        const detailsMap: { [id: string]: any } = {}

        for (const id of userParticipants) {
          if (!userDetails[id]) {
            try {
              const details = await getUserDetailsById(id)
              detailsMap[id] = details
            } catch (error) {
              console.error(`Failed to fetch details for user ${id}:`, error)
              // Set fallback details for failed fetches
              detailsMap[id] = { full_name: 'Unknown User', email: '', phone: '' }
            }
          }
        }

        setUserDetails((prev) => ({ ...prev, ...detailsMap }))
      } else {
        // For individual chats, fetch details for the recipient only
        if (recipient && !userDetails[recipient]) {
          try {
            const details = await getUserDetailsById(recipient)
            setUserDetails((prev) => ({ ...prev, [recipient]: details }))
          } catch (error) {
            console.error(`Failed to fetch details for recipient ${recipient}:`, error)
            setUserDetails((prev) => ({ 
              ...prev, 
              [recipient]: { full_name: 'Unknown User', email: '', phone: '' }
            }))
          }
        }
      }
    }

    fetchUserDetails()
  }, [participants, isGroup, recipient, user?.id])

  const sendMessage = async () => {
    if (!input.trim() || !user) return
    await storeMessage({ chatId, senderId: user.id, content: input })
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

  const getSenderDetails = (senderId: string) => {
    if (senderId === user?.id) {
      return {
        name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'You',
        email: user?.email,
        phone: user?.phone,
      }
    }

    const details = userDetails[senderId]
    return {
      name: details?.full_name || details?.email?.split('@')[0] || 'Unknown',
      email: details?.email,
      phone: details?.phone,
    }
  }

  // Get header details based on chat type
  const getHeaderDetails = () => {
    if (isGroup) {
      return {
        name: chatName || 'Group Chat',
        subtitle: `${participants.length} participants`,
      }
    } else {
      const recipientDetails = getSenderDetails(recipient)
      return {
        name: recipientDetails?.name || 'Chat',
        subtitle: recipientDetails?.email || '',
      }
    }
  }

  const headerDetails = getHeaderDetails()

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
            <h3 className="font-medium" style={{ color: 'var(--foreground)' }}>
              {headerDetails.name}
            </h3>
            <div>
              <span>{headerDetails.subtitle}</span>
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
        {messages.map((msg, index) => {
          const senderDetails = getSenderDetails(msg.sender_id)
          const isCurrentUser = msg.sender_id === user?.id

          const currentDate = new Date(msg.created_at).toLocaleDateString('en-GB')
          const prevDate = index > 0 ? new Date(messages[index - 1].created_at).toLocaleDateString('en-GB') : null

          const showDateSeparator = index === 0 || currentDate !== prevDate

          return (
            <React.Fragment key={msg.id}>
              {showDateSeparator && (
                <div className="flex items-center justify-center mb-4">
                  <div
                    className="px-3 py-1 rounded-full shadow-sm text-xs"
                    style={{
                      backgroundColor: 'var(--background)',
                      color: 'var(--muted-foreground)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {currentDate}
                  </div>
                </div>
              )}

              <div className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
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
                      color: 'var(--foreground)',
                    }}
                  >
                    <div className="flex justify-between items-center mb-2 gap-4">
                      <span className="text-xs font-medium" style={{ color: 'var(--secondary)' }}>
                        {senderDetails.name}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {senderDetails.phone || senderDetails.email}
                      </span>
                    </div>

                    <p className="text-sm break-words">{msg.content}</p>

                    <div className={`flex items-center mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <span
                        className={`text-xs ${isCurrentUser ? 'opacity-75' : ''}`}
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
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