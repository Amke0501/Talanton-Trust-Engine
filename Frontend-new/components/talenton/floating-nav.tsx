'use client'

import { LayoutGrid, FileText, Settings, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type NavItem = 'home' | 'applications' | 'settings' | 'profile'

const NAV_ITEMS: { id: NavItem; icon: typeof LayoutGrid; label: string }[] = [
  { id: 'home', icon: LayoutGrid, label: 'Home' },
  { id: 'applications', icon: FileText, label: 'Applications' },
  { id: 'settings', icon: Settings, label: 'Settings' },
  { id: 'profile', icon: UserCircle, label: 'Profile' },
]

export function FloatingNav({
  active,
  onNavigate,
}: {
  active: NavItem
  onNavigate: (item: NavItem) => void
}) {
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-8 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-black/5 bg-white/90 p-1.5 shadow-2xl backdrop-blur-xl">
        {/* Logo */}
        <div className="flex items-center justify-center px-3">
          <span className="font-serif text-lg font-bold text-[#103a27]">
            T<span className="text-[#a4cc44]">.</span>
          </span>
        </div>

        <div className="w-px h-5 bg-black/10" />

        {/* Nav items */}
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              className={cn(
                'group flex items-center gap-2 rounded-full px-4 py-2.5 transition-all duration-300',
                isActive
                  ? 'bg-[#103a27] text-white'
                  : 'text-[#103a27]/60 hover:bg-[#dbead5] hover:text-[#103a27]',
              )}
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" strokeWidth={2.5} />
              <span className="text-xs font-semibold whitespace-nowrap">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
