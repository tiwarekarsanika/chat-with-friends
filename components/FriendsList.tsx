'use client'
import { useState, useEffect } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import getAllFriends from '../lib/get-all-friends'
import { FaUserCircle } from 'react-icons/fa'
import { ChatBox } from './ChatBox'
import { getOrCreateChat } from '~/lib/get-or-create-chat'
import {
  AiOutlineMessage,
  AiOutlineRest
} from 'react-icons/ai'
import AddFriend from './AddFriend'
import { getUserDetailsById } from '~/lib/get-user-details'
import { getLastMessage } from '~/lib/get-last-message'

type Friend = {
  id: string
  name?: string
  lastMessage?: string
  lastMessageTime?: string
}

const FriendsList = () => {
  const [chat, setChat] = useState<any | null>(null)
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null)
  const [friendsList, setFriendsList] = useState<Friend[]>([])
  const user = useUser()

  const refreshFriendsList = async () => {
    if (!user?.id) return

    try {
      const friends = await getAllFriends(user.id)

      const enrichedFriends = await Promise.all(friends.map(async (friend) => {
        const userDetails = await getUserDetailsById(friend.id)
        const chat = await getOrCreateChat([user.id!, friend.id])
        const lastMsg = await getLastMessage(chat.id)
        // console.log("this was the last message ", lastMsg)
        return {
          id: friend.id,
          name: userDetails?.full_name || friend.email.split('@')[0],
          lastMessage: lastMsg?.content || 'Click to start chatting...',
          lastMessageTime: lastMsg?.created_at ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
        }
      }))

      setFriendsList(enrichedFriends)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (user?.id) {
      refreshFriendsList()
    }
  }, [user])


  useEffect(() => {
    if (user?.id && selectedFriend) {
      // console.log("user and selected friend are ", user, selectedFriend)
      getOrCreateChat([user.id, selectedFriend])
        .then(setChat)
        .catch(console.error)
    }
    // console.log("the chat is ", chat)
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
          <AddFriend onFriendAdded={refreshFriendsList} />
        </div>


        {/* Friends List */}
        <div className="flex-1 overflow-y-auto">
          {friendsList.length > 0 ? (
            friendsList.map((friend) => (
              <div
                key={friend.id}
                className={`flex items-center p-4 hover:opacity-80 cursor-pointer transition-opacity ${selectedFriend === friend.id ? 'border-l-4' : ''}`}
                style={{
                  backgroundColor: selectedFriend === friend.id ? 'var(--muted)' : 'transparent',
                  borderBottom: '1px solid var(--border)',
                  borderLeftColor: selectedFriend === friend.id ? 'var(--primary)' : 'transparent'
                }}
                onClick={() => setSelectedFriend(friend.id)}
              >
                <div className="relative w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-lg font-semibold">
                  {friend.name?.charAt(0).toUpperCase()}
                </div>

                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
                      {friend.name}
                    </p>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{friend.lastMessageTime || ''}</span>
                  </div>
                  <p className="text-sm truncate" style={{ color: 'var(--muted-foreground)' }}>
                    {friend.lastMessage}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full px-4 text-center text-sm text-muted-foreground">
              <p>
                👋 No chats yet!<br />
                Search for friends and start talking 🎉
              </p>
            </div>
          )
          }
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {chat ? (
          <ChatBox chatId={chat.id} participants={chat.participant_ids} />
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
