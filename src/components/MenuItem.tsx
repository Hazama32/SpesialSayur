'use client'
import Link from 'next/link'

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  href: string
}

export default function MenuItem({ icon, label, href }: MenuItemProps) {
  return (
    <Link
      href={href}
     className="flex items-center px-4 py-3 border-b last:border-none"
     >
      <div className="text-green-600 text-xl mr-3">{icon}</div>
      <span className="font-medium">{label}</span>
    </Link>
  )
}
