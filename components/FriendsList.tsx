'use client'
import { useState, useEffect } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import getAllFriends from '../lib/get-all-friends'
import { FaUserCircle } from 'react-icons/fa'
import { ChatBox } from './ChatBox'
import { getOrCreateChat } from '~/lib/get-or-create-chat'
import {
  AiOutlineMessage,
  AiOutlineFilter,
  AiOutlineSearch,
  AiOutlineRest
} from 'react-icons/ai'
import AddFriend from './AddFriend'

type Friend = {
  id: string
  email: string
}

const FriendsList = () => {
  const [chatId, setChatId] = useState<string | null>(null)
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null)
  const [friendsList, setFriendsList] = useState<Friend[]>([])
  const user = useUser()

  useEffect(() => {
    if (user?.id) {
      getAllFriends(user.id)
        .then(setFriendsList)
        .catch(console.error)
    }
  }, [user, friendsList])

  useEffect(() => {
    if (user?.id && selectedFriend) {
      getOrCreateChat([user.id, selectedFriend])
        .then(setChatId)
        .catch(console.error)
    }
  }, [selectedFriend, user])

  return (
    <div className="flex h-full" style={{ backgroundColor: 'var(--grey-light)' }}>
      {/* Friends List Panel */}
      <div className="w-80 flex flex-col" style={{
        backgroundColor: 'var(--background)',
        borderRight: '1px solid var(--border)'
      }}>
        {/* Header */}
        <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Chats</h2>
            <div className="flex items-center space-x-2">
              <button className="p-1.5 rounded-lg hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
                <AiOutlineRest size={16} />
              </button>
              <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Refresh</span>
            </div>
          </div>

          {/* Search and Filter */}
          <AddFriend />
        </div>
        

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto">
          {friendsList.map((friend) => (
            <div
              key={friend.id}
              className={`flex items-center p-4 hover:opacity-80 cursor-pointer transition-opacity ${selectedFriend === friend.id ? 'border-l-4' : ''
                }`}
              style={{
                backgroundColor: selectedFriend === friend.id ? 'var(--muted)' : 'transparent',
                borderBottom: '1px solid var(--border)',
                borderLeftColor: selectedFriend === friend.id ? 'var(--primary)' : 'transparent'
              }}
              onClick={() => {
                setSelectedFriend(friend.id)
              }}
            >
              <div className="relative">
                <FaUserCircle size={40} style={{ color: 'var(--muted-foreground)' }} />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2" style={{
                  backgroundColor: 'var(--primary)',
                  borderColor: 'var(--background)'
                }}></div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
                    {friend.email.split('@')[0]}
                  </p>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>12:07</span>
                </div>
                <p className="text-sm truncate" style={{ color: 'var(--muted-foreground)' }}>
                  Click to start chatting...
                </p>
              </div>
            </div>
          ))}

          {/* Demo entries to match the design */}
          <div className="flex items-center p-4 hover:opacity-80 cursor-pointer transition-opacity" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--primary-foreground)' }}>TS</span>
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Test Skope Final 5</p>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Yesterday</span>
              </div>
              <p className="text-sm truncate" style={{ color: 'var(--muted-foreground)' }}>
                Support2: This does not go on Tuesday...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {chatId ? (
          <ChatBox chatId={chatId} />
        ) : (
          <div className="flex-1 flex items-center justify-center" style={{
            color: 'var(--muted-foreground)',
            backgroundColor: 'var(--grey-light)'
          }}>
            <div className="text-center">
              <AiOutlineMessage size={48} className="mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
              <p className="text-lg">Select a friend to start chatting</p>
              <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>Choose a conversation from the sidebar to begin messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FriendsList;
