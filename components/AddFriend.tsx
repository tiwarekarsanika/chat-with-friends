'use client'

import React, { useState, useEffect } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import searchFriend from '~/lib/search-friend'
import addFriend from '~/lib/add-friend'
import { createGroupChat } from '~/lib/create-group-chat'
import { useUser } from '@supabase/auth-helpers-react'
import getAllFriends from '~/lib/get-all-friends'
import { IoIosPeople } from "react-icons/io";
import { Modal, Input, Checkbox } from 'antd'

const AddFriend = ({ onFriendAdded }: { onFriendAdded?: () => void }) => {
    const user = useUser()
    const [searchEmail, setSearchEmail] = useState('')
    const [foundUser, setFoundUser] = useState<null | { id: string, email: string }>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isGroupModalOpen, setGroupModalOpen] = useState(false)
    const [groupName, setGroupName] = useState('')
    const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([])
    const [allFriends, setAllFriends] = useState<{ id: string, email: string }[]>([])
    const [isCreatingGroup, setIsCreatingGroup] = useState(false)

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
        onFriendAdded?.() // Refresh the friends list
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isSearching) {
            handleSearch()
        }
    }

    async function showFriendsToAdd(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): Promise<void> {
        event.preventDefault()

        try {
            const friends = await getAllFriends(user.id) 
            setAllFriends(friends)
            setGroupModalOpen(true)
        } catch (err) {
            console.error('Failed to fetch friends', err)
        }
    }

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setGroupModalOpen(false)
            }
        }
        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [])


    const handleCreateGroup = async () => {
        if (!groupName.trim() || selectedFriendIds.length < 2) {
            setError('Group name and at least 2 participants required')
            return
        }

        setIsCreatingGroup(true)
        try {
            const creatorId = user.id // Replace with actual current user ID
            const chat = await createGroupChat(selectedFriendIds, creatorId, groupName)
            alert(`Group "${chat.group_name}" created!`)
            console.log('Group chat created:', chat)
            
            setGroupModalOpen(false)
            setGroupName('')
            setSelectedFriendIds([])
            onFriendAdded?.()
        } catch (err) {
            setError('Failed to create group')
            console.error(err)
        } finally {
            setIsCreatingGroup(false)
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
                    <IoIosPeople size={16} style={{ color: 'var(--muted-foreground)' }} />
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }} onClick={showFriendsToAdd}>Create Group</span>
                </div>
            </div>

            {isGroupModalOpen && (
                <Modal
                    title="Create Group"
                    open={isGroupModalOpen}
                    onOk={handleCreateGroup}
                    confirmLoading={isCreatingGroup}
                    onCancel={() => setGroupModalOpen(false)}
                    okText="Create"
                    cancelText="Cancel"
                >
                    <Input
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Group Name"
                        className="mb-3"
                    />
                    <div className="h-40 flex flex-col overflow-y-auto mb-3">
                        {allFriends.map(friend => (
                            <Checkbox
                                key={friend.id}
                                checked={selectedFriendIds.includes(friend.id)}
                                onChange={(e) => {
                                    setSelectedFriendIds(prev =>
                                        e.target.checked
                                            ? [...prev, friend.id]
                                            : prev.filter(id => id !== friend.id)
                                    )
                                }}
                            >
                                {friend.email}
                            </Checkbox>
                        ))}
                    </div>
                </Modal>
            )}


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