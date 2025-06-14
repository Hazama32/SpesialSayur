'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type CheckoutItem = {
  id: number
  attributes: {
    qty: number
    produk: {
      data: {
        id: number
        attributes: {
          nama: string
          harga: number
        }
      }
    }
  }
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CheckoutItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState('VA')
  const router = useRouter()

  useEffect(() => {
    fetch('https://spesialsayurdb-production.up.railway.app/api/carts?populate=produk')
      .then((res) => res.json())
      .then((data) => setItems(data.data))
      .catch((err) => console.error('Gagal fetch cart dari Strapi:', err))
  }, [])

  const total = items.reduce((sum, item) => {
    const harga = item.attributes.produk?.data?.attributes?.harga || 0
    const qty = item.attributes.qty || 1
    return sum + harga * qty
  }, 0)

  const handlePayment = () => {
    alert(`Pembayaran ${paymentMethod === 'VA' ? 'Virtual Account' : 'Tunai'} berhasil!`)
    router.push('/status')
  }

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h1 className="text-xl font-bold mb-4">Checkout</h1>

      {items.length === 0 ? (
        <p>Keranjang kosong atau belum dimuat.</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {items.map((item) => {
              const produk = item.attributes.produk?.data
              if (!produk) return null
              const nama = produk.attributes.nama
              const harga = produk.attributes.harga
              const qty = item.attributes.qty

              return (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded shadow flex justify-between"
                >
                  <div>
                    <p className="font-semibold">{nama}</p>
                    <p className="text-sm text-gray-600">Qty: {qty}</p>
                  </div>
                  <p className="text-orange-500 font-bold">
                    Rp {(harga * qty).toLocaleString()}
                  </p>
                </div>
              )
            })}
          </div>

          <p className="text-lg font-bold mb-6">Total: Rp {total.toLocaleString()}</p>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">Metode Pembayaran</h2>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="VA"
                  checked={paymentMethod === 'VA'}
                  onChange={() => setPaymentMethod('VA')}
                />
                Virtual Account
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="Tunai"
                  checked={paymentMethod === 'Tunai'}
                  onChange={() => setPaymentMethod('Tunai')}
                />
                Tunai
              </label>
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-green-600 text-white py-3 rounded"
          >
            Bayar Sekarang
          </button>
        </>
      )}
    </div>
  )
}
