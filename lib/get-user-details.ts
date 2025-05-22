import { createSupabaseBrowserClient } from './supabase-browser'

export async function getUserDetailsById(id: string) {
    const supabase = createSupabaseBrowserClient()

    const { data, error } = await supabase
        .from('users_public')
        .select('full_name, email, phone')
        .eq('id', id)
        .single()
    if(error) throw error

    return data
}

