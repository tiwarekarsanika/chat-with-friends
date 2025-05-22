import { createSupabaseBrowserClient } from './supabase-browser'

export async function getLastMessage(chatId: string) {
    const supabase = createSupabaseBrowserClient()

    const { data, error } = await supabase
        .from('messages')
        .select('content, created_at')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (error) {
        console.error(error)
        return null
    }

    // console.log("this is data from last message ", data)
    return data
}

