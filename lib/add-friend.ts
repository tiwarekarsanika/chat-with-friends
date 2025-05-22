// import { createSupabaseBrowserClient } from './supabase-browser'

// export default async function addFriend(friendId: string) {
//     const supabase = createSupabaseBrowserClient()
//     const user = await supabase.auth.getUser()

//     if (!user.data.user?.id) return

//     const currentUserId = user.data.user.id

//     const { error } = await supabase.from('friends').insert([
//         { user_id: currentUserId, friend_id: friendId },
//         { user_id: friendId, friend_id: currentUserId },
//     ])

//     if (error) {
//         console.error(error)
//         alert('Error adding friend')
//         return
//     }
// }

import { createSupabaseBrowserClient } from './supabase-browser'

export default async function addFriend(friendId: string) {
    const supabase = createSupabaseBrowserClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()
    
    if (userError || !userData.user?.id) {
        throw new Error('User not authenticated')
    }
    
    const currentUserId = userData.user.id
    
    // Check if friendship already exists
    const { data: existingFriendship } = await supabase
        .from('friends')
        .select('*')
        .or(`and(user_id.eq.${currentUserId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${currentUserId})`)
        .limit(1)
    
    if (existingFriendship && existingFriendship.length > 0) {
        throw new Error('Already friends with this user')
    }
    
    // Prevent adding self as friend
    if (currentUserId === friendId) {
        throw new Error('Cannot add yourself as a friend')
    }
    
    const { error } = await supabase.from('friends').insert([
        { user_id: currentUserId, friend_id: friendId },
        { user_id: friendId, friend_id: currentUserId },
    ])
    
    if (error) {
        console.error('Add friend error:', error)
        throw new Error('Failed to add friend')
    }
}