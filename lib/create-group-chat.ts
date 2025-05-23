// lib/get-or-create-chat.ts
import { createSupabaseBrowserClient } from './supabase-browser'

export async function createGroupChat(participantIds: string[], creator_id: string, group_name: string) {
    const supabase = createSupabaseBrowserClient()
    
    // console.log("creator id is ", creator_id)
    // console.log("group name is ", group_name)

    // Sort the IDs so the order doesn't affect uniqueness
    const sortedIds = [...participantIds, creator_id].sort()
    // console.log("chat ids are ", sortedIds)

    // Check if chat exists
    const { data: existingChats, error } = await supabase
        .from('chats')
        .select('*')
        .contains('participant_ids', sortedIds) // assumes array column

    if (error) throw error

    if (existingChats && existingChats.length > 0) {
        // console.log("found existing chat")
        return existingChats[0]
    }

    // Create chat if not exists
    const insertPayload = {
        participant_ids: sortedIds,
        created_by: creator_id,
        group_name,
        is_group: true,
    }
    // console.log('Insert payload:', insertPayload)
    // console.log("made it to insert call")
    const { data: newChat, error: insertError } = await supabase
        .from('chats')
        .insert([insertPayload])
        .select()
        .single()
        // console.log("insert result", newChat, insertError)
    if (insertError) {
        // console.error('Insert Error:', insertError)
        throw insertError
    }

    return newChat
}
