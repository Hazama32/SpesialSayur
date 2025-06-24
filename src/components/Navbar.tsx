'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Beranda', href: '/', icon: '/icons/home.png' },
    { name: 'Notifikasi', href: '/notifikasi', icon: '/icons/notif.png' },
    { name: 'Favorit', href: '/favorit', icon: '/icons/favorit.png' },
    { name: 'Keranjang', href: '/cart', icon: '/icons/cart.png' },
    { name: 'Akun', href: '/profile', icon: '/icons/akun 2.png' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white pb-3 border-t shadow-xl flex justify-around py-4 z-60">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center text-xs ${
            pathname === item.href ? 'text-green-600 font-bold' : 'text-gray-500'
          }`}
        >
          <Image src={item.icon} alt={item.name} width={24} height={24} />
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  )
}
