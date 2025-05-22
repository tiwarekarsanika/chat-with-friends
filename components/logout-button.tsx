'use client'

import { createClient } from '~/lib/client'
import { useRouter } from 'next/navigation'
import { RiLogoutBoxRLine } from "react-icons/ri";

export function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return <RiLogoutBoxRLine onClick={logout} />
}
