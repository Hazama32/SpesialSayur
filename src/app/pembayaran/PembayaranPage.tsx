'use client'

import { useEffect, useState } from 'react'
import HeaderSection from '@/components/HeaderSection'
import PaymentMethod from '@/components/PaymentMethod'

export default function PembayaranPage() {
  const [paymentMethod, setPaymentMethod] = useState<string>('')

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)

      // Ambil data dari Strapi
      fetch(`https://spesialsayurdb-production.up.railway.app/api/users/${parsedUser.id}`, {
        headers: {
          Authorization: `Bearer ${parsedUser.jwt}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setPaymentMethod(data.metode_pembayaran || '')
        })
        .catch(err => console.error('Gagal mengambil metode pembayaran', err))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderSection title="Metode Pembayaran" />

      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Metode Pembayaran yang Dipilih</h2>

        {/* Tampilkan komponen PaymentMethod dalam mode readonly */}
        <PaymentMethod selected={paymentMethod} onChange={() => {}} disabled={true} />

        {paymentMethod === '' && (
          <p className="text-center text-gray-500 mt-8">Belum memilih metode pembayaran</p>
        )}
      </div>
    </div>
  )
}
