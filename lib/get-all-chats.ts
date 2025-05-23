import { createSupabaseBrowserClient } from './supabase-browser'

export default async function getAllChats(userId: string) {
  const supabase = createSupabaseBrowserClient()

  // Fetch individual friends from the view
  const { data: individualFriends, error: friendError } = await supabase
    .from('user_friends_view')
    .select('friend_id, friend_email')
    .eq('user_id', userId)

  // Fetch group chats where user is a participant and is_group is TRUE
  const { data: groupChats, error: groupError } = await supabase
    .from('chats')
    .select('id, group_name, is_group')
    .eq('is_group', true)
    .contains('participant_ids', [userId])

  if (friendError || groupError) {
    console.error('Error fetching friends or group chats:', friendError || groupError)
    throw new Error('Failed to fetch friends or groups')
  }

  // For friends, add is_group: false explicitly
  const friendsList = (individualFriends || []).map((row) => ({
    id: row.friend_id,
    email: row.friend_email,
    is_group: false,
  }))

  // Group chats already have is_group: true from DB
  const groupsList = (groupChats || []).map((row) => ({
    id: row.id,
    email: row.group_name || 'Unnamed Group',
    is_group: true,
  }))

  return [...friendsList, ...groupsList]
}
