'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Bell,
  ShoppingCart,
  Heart,
  User
} from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Notif', href: '/notifikasi', icon: Bell },
    { name: 'Cart', href: '/cart', icon: ShoppingCart },
    { name: 'Favourite', href: '/favorit', icon: Heart },
    { name: 'Account', href: '/profile', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl py-2 flex justify-around z-[999]">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const isCart = item.name === 'Cart'
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center transition-all duration-200 ${
              isActive ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            <div
              className={`relative flex items-center justify-center ${
                isCart
                  ? 'w-14 h-14 rounded-full bg-green-600 shadow-lg -mt-6'
                  : ''
              }`}
            >
              <Icon
                size={isCart ? 28 : 26}
                className={`transition duration-150 ${
                  isCart
                    ? 'text-white'
                    : isActive
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              />
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
