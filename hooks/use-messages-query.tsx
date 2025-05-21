import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '../lib/supabase-browser'

export function useMessagesQuery(chatId: string) {
  const [messages, setMessages] = useState<any[]>([])
  const [supabase] = useState(() => createSupabaseBrowserClient())

  useEffect(() => {
    if (!chatId) return

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (!error) setMessages(data!)
    }

    fetchMessages()

    const channel = supabase
      .channel('chat-room')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          setMessages((msgs) => [...msgs, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId, supabase])

  return messages
}
