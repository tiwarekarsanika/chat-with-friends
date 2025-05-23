// // lib/get-all-friends.ts
import { createSupabaseBrowserClient } from './supabase-browser'

export default async function getAllFriends(userId: string) {
  const supabase = createSupabaseBrowserClient()

  const { data, error } = await supabase
    .from('user_friends_view')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error

  // const { data: userData } = await supabase.auth.getUser()
  // console.log(userData.user?.user_metadata.full_name)

  return data.map((row) => ({
    id: row.friend_id,
    email: row.friend_email,
  }))
}
