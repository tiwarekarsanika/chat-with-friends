"use client"
// app/layout.tsx
import { createClient } from '../lib/client'
import { useState } from 'react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import './globals.css'

console.log("✅ Rendering layout.tsx start");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createClient())

  return (
    <html lang="en">
      <body>
        <SessionContextProvider supabaseClient={supabaseClient}>
          {children}
        </SessionContextProvider>
      </body>
    </html>
  )
}