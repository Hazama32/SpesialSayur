'use client'

import HeaderSection from '@/components/HeaderSection'

export default function PembayaranPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderSection title="Metode Pembayaran" />
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Pilih Metode Pembayaran</h2>
        <div className="space-y-4">
          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold mb-1 text-black">Virtual Account</h3>
            <p className="text-sm text-gray-600">Bayar melalui transfer VA dari semua bank.</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold mb-1 text-black">Tunai</h3>
            <p className="text-sm text-gray-600">Bayar langsung ke kurir saat pesanan sampai.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
