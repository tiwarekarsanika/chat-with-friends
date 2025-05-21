import { createSupabaseBrowserClient } from '../lib/supabase-browser'

export async function storeMessage({
  chatId,
  senderId,
  content,
}: {
  chatId: string
  senderId: string
  content: string
}) {
  const supabase = createSupabaseBrowserClient()

  const { data, error } = await supabase.from('messages').insert([
    {
      chat_id: chatId,
      sender_id: senderId,
      content,
    },
  ])

  if (error) {
    console.error('Insert failed:', error.message)
  }

  return data
}
