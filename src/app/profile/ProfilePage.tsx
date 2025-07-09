'use client'

import { useEffect, useState } from 'react'
import { Heart, MapPin, HelpCircle, Settings, Package } from 'lucide-react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import MenuItem from '@/components/MenuItem'
import PaymentMethod from '@/components/PaymentMethod'

export default function AccountPage() {
  const [selectedMethod, setSelectedMethod] = useState('va')
  const [user, setUser] = useState<any>(null)

  // Ambil user dari localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)

      // Fetch metode pembayaran dari Strapi
      fetch(`https://spesialsayurdb-production-b3b4.up.railway.app/api/users/${parsedUser.id}`, {
        headers: {
          Authorization: `Bearer ${parsedUser.jwt}` // jika pakai token
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.metode_pembayaran) {
            setSelectedMethod(data.metode_pembayaran)
          }
        })
        .catch(err => console.error('Gagal mengambil metode pembayaran', err))
    }
  }, [])

  const handlePaymentChange = async (method: string) => {
    setSelectedMethod(method)
    localStorage.setItem('paymentMethod', method)

    // Update ke Strapi
    if (user) {
      try {
        await fetch(`https://spesialsayurdb-production-b3b4.up.railway.app/api/users/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.jwt}`
          },
          body: JSON.stringify({
            metode_pembayaran: method
          })
        })
      } catch (err) {
        console.error('Gagal update metode pembayaran ke Strapi', err)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-300 pb-16">
       <div className="bg-green-600 text-white p-4 pt-6 shadow">
        <h1 className="text-lg font-semibold text-center">Akun</h1>
      </div>
     <Navbar />

      {/* Profile */}
      <div className="bg-white px-4 py-5 flex items-center gap-4 shadow-sm text-black">
        <Image
          src="/icons/profile.png"
          alt="Profile"
          width={48}
          height={48}
          className="rounded-full"
        />
        <p className="font-semibold text-lg">{user?.username || 'Bintang'}</p>
      </div>

      {/* Metode Pembayaran */}
      <div className="bg-white mt-3 p-4 shadow-sm">
        <h2 className="font-medium mb-3 text-gray-700">Metode Pembayaran</h2>
        <PaymentMethod selected={selectedMethod as any} onChange={handlePaymentChange}redirectOnSelect={true} />
      </div>

      {/* Menu Akun */}
      <div className="bg-white mt-3 shadow-sm text-gray-800">
        <MenuItem icon={<Package />} label="Pesanan" href="/pesanan" />
        <MenuItem icon={<Heart />} label="Favorit Saya" href="/favorit" />
        <MenuItem icon={<MapPin />} label="Alamat" href="/alamat" />
        <MenuItem icon={<HelpCircle />} label="Bantuan & Laporan" href="/bantuan" />
        <MenuItem icon={<Settings />} label="Pengaturan Akun" href="/pengaturan" />
      </div>

      <div className="h-16"></div>
    </div>
  )
}
