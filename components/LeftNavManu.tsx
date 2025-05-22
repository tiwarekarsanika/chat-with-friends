'use client'
import { 
  AiOutlineHome, 
  AiOutlineMessage, 
  AiOutlinePhone, 
  AiOutlineSetting,
  AiOutlineTeam,
  AiOutlineBarChart
} from 'react-icons/ai'
import { BiCustomize } from 'react-icons/bi'

const LeftNavMenu = () => {
  return (
    <div className="w-16 flex flex-col items-center py-4 space-y-6" style={{ 
      backgroundColor: 'var(--background)', 
      borderRight: '1px solid var(--border)' 
    }}>
      {/* Logo/Profile */}
      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
        <span className="font-bold text-sm" style={{ color: 'var(--primary-foreground)' }}>P</span>
      </div>
      
      {/* Navigation Icons */}
      <nav className="flex flex-col space-y-4">
        <button className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
          <AiOutlineHome size={20} />
        </button>
        <button className="p-2 rounded-lg" style={{ 
          backgroundColor: 'var(--primary)', 
          color: 'var(--primary-foreground)' 
        }}>
          <AiOutlineMessage size={20} />
        </button>
        <button className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
          <AiOutlinePhone size={20} />
        </button>
        <button className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
          <AiOutlineTeam size={20} />
        </button>
        <button className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
          <AiOutlineBarChart size={20} />
        </button>
        <button className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
          <BiCustomize size={20} />
        </button>
      </nav>
      
      {/* Bottom Settings */}
      <div className="flex-1"></div>
      <button className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
        <AiOutlineSetting size={20} />
      </button>
    </div>
  )
}

export default LeftNavMenu