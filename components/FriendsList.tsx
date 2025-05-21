// 'use client'
// import { useState, useEffect } from 'react'
// import { useUser } from '@supabase/auth-helpers-react'
// import getAllFriends from '../lib/get-all-friends'

// type Friend = {
//   id: string
//   email: string
// }

// const FriendsList = () => {
//   const [currChat, setCurrChat] = useState<string | null>(null)
//   const [friendsList, setFriendsList] = useState<Friend[]>([])
//   const user = useUser()

//   useEffect(() => {
//     if (user?.id) {
//       getAllFriends(user.id)
//         .then(setFriendsList)
//         .catch(console.error)
//     }
//   }, [user])

//   return (
//     <div className="flex flex-col w-1/3 p-4 bg-gray-100 border-r">
//       <h2 className="text-xl font-semibold mb-4">Your Friends</h2>
//       {friendsList.map((friend) => (
//         <div
//           key={friend.id}
//           className="p-2 rounded hover:bg-gray-200 cursor-pointer"
//           onClick={() => setCurrChat(friend.id)}
//         >
//           {friend.email}
//         </div>
//       ))}
//     </div>
//   )
// }

// export default FriendsList

'use client'
import { useState, useEffect } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import getAllFriends from '../lib/get-all-friends'
import { FaUserCircle } from 'react-icons/fa'
import { ChatBox } from './ChatBox'
import { getOrCreateChat } from '~/lib/get-or-create-chat'

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
  }, [user])

  // 🛠 Whenever friend is selected, get (or create) their chat
  useEffect(() => {
    if (user?.id && selectedFriend) {
      getOrCreateChat([user.id, selectedFriend])
        .then(setChatId)
        .catch(console.error)
    }
  }, [selectedFriend, user])

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/3 p-4 border-r bg-white">
        <h2 className="text-xl font-bold mb-4">Your Friends</h2>
        <div className="space-y-2 overflow-y-auto h-[80vh] pr-2">
          {friendsList.map((friend) => (
            <div
              key={friend.id}
              className={`flex items-center gap-2 p-3 rounded cursor-pointer hover:bg-gray-200 ${
                selectedFriend === friend.id ? 'bg-gray-200' : ''
              }`}
              onClick={() => {
                setSelectedFriend(friend.id)
              }}
            >
              <FaUserCircle size={40} />
              <span className="truncate">{friend.email}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Box */}
      {chatId ? (
        <ChatBox chatId={chatId} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a friend to start chatting
        </div>
      )}
    </div>
  )
}

export default FriendsList

