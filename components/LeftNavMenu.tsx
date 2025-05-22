'use client'
import { AiFillHome } from "react-icons/ai";
import { BsChatDotsFill } from "react-icons/bs";
import { FaTicketAlt, FaCheckSquare } from "react-icons/fa";
import { BiLineChart } from "react-icons/bi";
import { HiOutlineViewList } from "react-icons/hi";
import { IoMdMegaphone } from "react-icons/io";
import { LuNetwork } from "react-icons/lu";
import { PiNotebookBold } from "react-icons/pi";
import { CgInpicture } from "react-icons/cg";
import { FiSettings, FiSun, FiMoon } from "react-icons/fi";
import React from "react";
import { useRouter } from 'next/navigation'
import { useUser, useSessionContext } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { LogoutButton } from '~/components/logout-button'

const LeftNavMenu = () => {
  const router = useRouter()
  const user = useUser()
  const {
    isLoading
  } = useSessionContext()
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Default selected: BsChatDotsFill
  const [selectedIcon, setSelectedIcon] = useState('BsChatDotsFill')

  useEffect(() => {
    if (!isLoading && user === null) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const root = window.document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDarkMode])

  const navIcons = [
    { name: 'AiFillHome', icon: AiFillHome },
    { name: 'BsChatDotsFill', icon: BsChatDotsFill },
    { name: 'FaTicketAlt', icon: FaTicketAlt },
    { name: 'BiLineChart', icon: BiLineChart },
    { name: 'HiOutlineViewList', icon: HiOutlineViewList },
    { name: 'IoMdMegaphone', icon: IoMdMegaphone },
    { name: 'LuNetwork', icon: LuNetwork },
    { name: 'PiNotebookBold', icon: PiNotebookBold },
    { name: 'CgInpicture', icon: CgInpicture },
    { name: 'FaCheckSquare', icon: FaCheckSquare },
    { name: 'FiSettings', icon: FiSettings }
  ]

  return (
    <div className="w-1/20 flex flex-col justify-between items-center py-4 ml-0 h-full"
      style={{
        backgroundColor: 'var(--background)',
        borderRight: '1px solid var(--border)'
      }}
    >
      {/* Top Icons */}
      <nav className="flex flex-col space-y-2">
        {navIcons.map(({ name, icon: Icon }) => {
          const isSelected = selectedIcon === name
          return (
            <button
              key={name}
              onClick={() => setSelectedIcon(name)}
              className={`p-2 rounded-lg transition-all duration-200 ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)] hover:text-[var(--primary)]'
                }`}
            >
              <Icon size={16} />
            </button>
          )
        })}
      </nav>

      {/* Bottom Icons */}
      <nav className="flex flex-col space-y-2">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-lg transition-all duration-200 text-[var(--muted-foreground)] hover:text-[var(--primary)]"
        >
          {isDarkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
        </button>
        <button
          className="p-2 rounded-lg transition-all duration-200 text-[var(--muted-foreground)] hover:text-[var(--primary)]"
        >
          <LogoutButton />
        </button>
      </nav>
    </div>
  )
}

export default LeftNavMenu
