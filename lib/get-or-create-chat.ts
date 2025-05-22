// lib/get-or-create-chat.ts
import { createSupabaseBrowserClient } from './supabase-browser'

export async function getOrCreateChat(participantIds: string[]) {
  const supabase = createSupabaseBrowserClient()

  // Sort the IDs so the order doesn't affect uniqueness
  const sortedIds = [...participantIds].sort()

  // Check if chat exists
  const { data: existingChats, error } = await supabase
    .from('chats')
    .select('*')
    .contains('participant_ids', sortedIds) // assumes array column

  if (error) throw error

  if (existingChats && existingChats.length > 0) {
    // console.log(existingChats[0].id)
    return existingChats[0]
  }

  // Create chat if not exists
  const { data: newChat, error: insertError } = await supabase
    .from('chats')
    .insert([{ participant_ids: sortedIds }])
    .select()
    .single()

  if (insertError) throw insertError

  return newChat
}
