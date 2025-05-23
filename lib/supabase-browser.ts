// lib/supabase-browser.ts
// import { createBrowserClient } from '@supabase/ssr'

// export function createSupabaseBrowserClient() {
//   return createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )
// }

import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseBrowserClient() {
  console.log('Creating Supabase Client with:')
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('ANON KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

