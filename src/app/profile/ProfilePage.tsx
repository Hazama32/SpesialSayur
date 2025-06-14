'use client'
import { CreditCard, Wallet, Heart, MapPin, HelpCircle, Settings, Package } from 'lucide-react'
import Image from 'next/image'
import HeaderSection from '@/components/HeaderSection'
import MenuItem from '@/components/MenuItem'
import Link from 'next/link'

export default function AccountPage() {

  return (
    <div className="min-h-screen bg-gray-300">
      <HeaderSection title="Akun" toHome={false} />

      {/* Profile */}
      <div className="bg-white px-4 py-5 flex items-center gap-4 shadow-sm text-black">
        <Image
          src="/icons/profile.png"
          alt="Profile"
          width={48}
          height={48}
          className="rounded-full"
        />
        <p className="font-semibold text-lg">Bintang</p>
      </div>

      {/* Metode Pembayaran */}
      <div className="bg-white mt-3 p-4 shadow-sm">
        <h2 className="font-medium mb-3 text-gray-700">Metode Pembayaran</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/pembayaran">
          <div className="flex flex-col items-center">
            <CreditCard className="w-6 h-6 text-green-600 mb-1"/>
            <p className="text-sm text-center text-gray-800">Kartu Debit<br />atau Kredit</p>
          </div>
          </Link>
          <Link href="/pembayaran">
          <div className="flex flex-col items-center">
            <Wallet className="w-6 h-6 text-green-600 mb-1"/>
            <p className="text-sm text-center text-gray-800">Tunai</p>
          </div>
          </Link>
        </div>
      </div>

      {/* Menu Akun */}
      <div className="bg-white mt-3 shadow-sm text-gray-800">
      <MenuItem icon={<Package />} label="Pesanan" href="/pesanan" />
      <MenuItem icon={<Heart />} label="Favorite Saya" href="/favorit" />
      <MenuItem icon={<MapPin />} label="Alamat" href="/alamat" />
      <MenuItem icon={<HelpCircle />} label="Bantuan & Laporan" href="/bantuan" />
      <MenuItem icon={<Settings />} label="Pengaturan Akun" href="/pengaturan" />
    </div>

      {/* Bottom nav placeholder */}
      <div className="h-16"></div>
    </div>
  )
}
