
// lib/get-or-create-chat.ts
import { createSupabaseBrowserClient } from './supabase-browser'

export async function getOrCreateChat(participantIds: string[]) {
  const supabase = createSupabaseBrowserClient()

  // Sort the IDs so the order doesn't affect uniqueness
  const sortedIds = [...participantIds].sort()
  
  // Determine if it's a group chat (more than 2 participants)
  const isGroup = sortedIds.length > 2

  // Check if chat exists with exact participant match
  // For exact array matching, we need to filter by array length and contents
  const { data: allChats, error } = await supabase
    .from('chats')
    .select('*')
    .contains('participant_ids', sortedIds)

  if (error) throw error

  // Filter for exact match (same length and same elements)
  const existingChats = allChats?.filter(chat => 
    chat.participant_ids?.length === sortedIds.length &&
    sortedIds.every(id => chat.participant_ids.includes(id))
  ) || []

  if (existingChats && existingChats.length > 0) {
    return existingChats[0]
  }

  // Create chat if not exists
  const { data: newChat, error: insertError } = await supabase
    .from('chats')
    .insert([{ 
      participant_ids: sortedIds,
      is_group: isGroup 
    }])
    .select()
    .single()

  if (insertError) throw insertError

  return newChat
}