// 'use client'

// import React from 'react'
// import { useState } from 'react'
// import searchFriend from '~/lib/search-friend'
// import addFriend from '~/lib/add-friend'


// const AddFriend = () => {
//     const [searchEmail, setSearchEmail] = useState('')
//     const [foundUser, setFoundUser] = useState<null | { id: string, email: string }>(null)

//     const handleSearch = async () => {
//         const data = await searchFriend(searchEmail)
//         setFoundUser(data)
//     }

//     const addNewFriend = async (friendId: string) => {
//         await addFriend(friendId)
//         alert('Friend added successfully')
//         setSearchEmail('')
//         setFoundUser(null)
//     }

//     return (
//         <div className="p-4 border-t mt-4">
//             <input
//                 type="text"
//                 placeholder="Search by email"
//                 className="border px-2 py-1 rounded w-full mb-2"
//                 value={searchEmail}
//                 onChange={(e) => setSearchEmail(e.target.value)}
//             />
//             <button
//                 onClick={handleSearch}
//                 className="bg-blue-500 text-white px-4 py-1 rounded w-full"
//             >
//                 Search
//             </button>

//             {foundUser && (
//                 <div className="mt-2">
//                     <p>{foundUser.email}</p>
//                     <button
//                         onClick={() => addNewFriend(foundUser.id)}
//                         className="bg-green-500 text-white px-4 py-1 rounded mt-1"
//                     >
//                         Add Friend
//                     </button>
//                 </div>
//             )}
//         </div>

//     )
// }

// export default AddFriend

// AddFriend.tsx
'use client'

import React, { useState } from 'react'
import { AiOutlineSearch, AiOutlineFilter } from 'react-icons/ai'
import searchFriend from '~/lib/search-friend'
import addFriend from '~/lib/add-friend'

const AddFriend = () => {
    const [searchEmail, setSearchEmail] = useState('')
    const [foundUser, setFoundUser] = useState<null | { id: string, email: string }>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSearch = async () => {
        if (!searchEmail.trim()) {
            setError('Please enter an email address')
            return
        }

        setIsSearching(true)
        setError(null)
        setFoundUser(null)

        try {
            const data = await searchFriend(searchEmail.trim().toLowerCase())
            if (data) {
                setFoundUser(data)
            } else {
                setError('User not found')
            }
        } catch (err) {
            setError('Error searching for user')
            console.error('Search error:', err)
        } finally {
            setIsSearching(false)
        }
    }

    const addNewFriend = async (friendId: string) => {
        setIsAdding(true)
        setError(null)

        try {
            await addFriend(friendId)
            setSearchEmail('')
            setFoundUser(null)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error adding friend'
            setError(errorMessage)
            console.error('Add friend error:', err)
        } finally {
            setIsAdding(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isSearching) {
            handleSearch()
        }
    }

    return (
        <div className="pt-4 border-t mt-4">
            <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                    <input
                        type="email"
                        placeholder="Search by email"
                        className="border px-2 py-1 rounded w-full"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isSearching || isAdding}
                    />
                </div>
                <button
                    onClick={handleSearch}
                    disabled={isSearching || isAdding || !searchEmail.trim()}
                    className="text-white px-2 py-2 rounded-full disabled:bg-gray-400 cursor-pointer"
                    style={{ backgroundColor: isSearching || isAdding || !searchEmail.trim() ? undefined : 'var(--primary)' }}
                >
                    <AiOutlineSearch style={{ color: 'var(--primary-foreground)' }} size={16} />
                </button>
                <div className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:opacity-80 cursor-pointer transition-opacity" style={{ border: '1px solid var(--border)' }}>
                    <AiOutlineFilter size={16} style={{ color: 'var(--muted-foreground)' }} />
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Filtered</span>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div>
                </div>
            </div>

            {error && (
                <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {foundUser && (
                <div className="mt-2 p-2 border rounded">
                    <p className="font-medium">{foundUser.email}</p>
                    <button
                        onClick={() => addNewFriend(foundUser.id)}
                        disabled={isAdding}
                        className="bg-green-500 text-white px-4 py-1 rounded mt-1 disabled:bg-gray-400"
                    >
                        {isAdding ? 'Adding...' : 'Add Friend'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default AddFriend