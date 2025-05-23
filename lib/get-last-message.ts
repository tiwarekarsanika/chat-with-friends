import { createSupabaseBrowserClient } from './supabase-browser'

export async function getLastMessage(chatId: string) {
    const supabase = createSupabaseBrowserClient()

    const { data, error } = await supabase
        .from('messages')
        .select('content, created_at')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()  // <- Use maybeSingle instead of single

    if (error) {
        console.error('Error fetching last message:', error)
        return null
    }

    return data // Can be null if no message exists
}
