
// import { createSupabaseBrowserClient } from './supabase-browser'

// export default async function searchFriend(searchEmail: string) {
//     const supabase = createSupabaseBrowserClient()

//     const { data, error } = await supabase
//         .from('users_public')
//         .select('id, email')
//         .eq('email', searchEmail)
//         .single()

//     if (error) throw error
//     if(!data)
//         alert("User not found!")

//     return (
//         data.id,
//         data.email
//     )
// }

import { createSupabaseBrowserClient } from './supabase-browser'

export default async function searchFriend(searchEmail: string) {
    const supabase = createSupabaseBrowserClient()
    
    const { data, error } = await supabase
        .from('users_public')
        .select('id, email')
        .eq('email', searchEmail)
        .single()
    
    if (error) {
        console.error('Search error:', error)
        return null
    }
    
    if (!data) {
        return null
    }
    
    return {
        id: data.id,
        email: data.email
    }
}
