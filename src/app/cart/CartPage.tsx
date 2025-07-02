'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // ✅ App Router version!
import HeaderSection from '@/components/HeaderSection'
import {
  clearLocalCart,
  getLocalCart,
  removeFromLocalCart,
  updateQtyInLocalCart,
} from '@/lib/cartStorage'

type Produk = {
  id: number
  nama_produk: string
  harga_kiloan: string
  gambar: {
    id: number
    url: string
  }[]
}

type ProdukPesanan = {
  id: number
  jumlah_pesanan: string
  subtotal: string
  produks: Produk
}

export default function CartPage() {
  const [items, setItems] = useState<ProdukPesanan[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter() // ✅ Correct hook for App Router

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Keranjang kosong!')
      return
    }
    // Simpan cart ke localStorage
    localStorage.setItem('checkoutCart', JSON.stringify(items))
    // Pindah ke halaman template pesanan
    router.push('/pesanan')
  }

  useEffect(() => {
    const localCart = getLocalCart()
    if (localCart.length === 0) {
      setLoading(false)
      return
    }

    fetch(
      'https://spesialsayurdb-production.up.railway.app/api/produks?populate=*'
    )
      .then(res => res.json())
      .then(data => {
        const produkMap = new Map<number, Produk>()
        data.data.forEach((p: any) => {
          produkMap.set(p.id, {
            id: p.id,
            nama_produk: p.nama_produk,
            harga_kiloan: p.harga_kiloan,
            gambar:
              p.gambar?.map((img: any) => ({
                id: img.id,
                url: img.url,
              })) || [],
          })
        })

        const itemsFromLocal = localCart
          .map((item, index) => {
            const produk = produkMap.get(item.produkId)
            if (!produk) return null

            const subtotal =
              (parseFloat(produk.harga_kiloan) / 1000) * item.jumlah_pesanan

            return {
              id: index + 1,
              jumlah_pesanan: String(item.jumlah_pesanan),
              subtotal: String(Math.ceil(subtotal)),
              produks: produk,
            }
          })
          .filter(Boolean)

        setItems(itemsFromLocal as ProdukPesanan[])
      })
      .catch(err => {
        console.error('Gagal mengambil data:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = (id: number) => {
    const produkId = items.find(i => i.id === id)?.produks.id
    if (!produkId) return
    removeFromLocalCart(produkId)
    setItems(items.filter(i => i.id !== id))
  }

  const handleChangeQty = (item: ProdukPesanan, newQty: number) => {
    const harga = parseFloat(item.produks.harga_kiloan || '0')
    const subtotal = (harga / 1000) * newQty

    updateQtyInLocalCart(item.produks.id, newQty)

    setItems(
      items.map(i =>
        i.id === item.id
          ? {
              ...i,
              jumlah_pesanan: String(newQty),
              subtotal: String(Math.ceil(subtotal)),
            }
          : i
      )
    )
  }

  const total = items.reduce((sum, i) => sum + parseFloat(i.subtotal), 0)

  if (loading) return <p className="p-4">Memuat keranjang...</p>

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderSection title="Pesanan" />
      <button
        onClick={() => {
          clearLocalCart()
          setItems([]) // Clear state juga!
        }}
        className="text-sm text-red-600 hover:underline"
      >
        Hapus Semua
      </button>

      {items.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">
          <p>Keranjang kosong.</p>
        </div>
      ) : (
        <>
          <ul className="space-y-4 mb-6 px-4">
            {items.map(item => {
              const produk = item.produks
              const image = produk.gambar?.[0]?.url
                ? `https://spesialsayurdb-production.up.railway.app${produk.gambar[0].url}`
                : '/noimage.png'

              const gram = parseInt(item.jumlah_pesanan)
              const jumlahLabel =
                gram >= 1000
                  ? `${(gram / 1000).toFixed(2)} kg`
                  : `${gram} gr`

              return (
                <li
                  key={item.id}
                  className="flex gap-4 p-4 bg-white rounded shadow relative"
                >
                  <img
                    src={image}
                    alt={produk.nama_produk}
                    className="h-24 w-24 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">
                      {produk.nama_produk}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Rp {produk.harga_kiloan} / kg
                    </p>
                    <div className="text-sm mt-2 text-gray-800">
                      <p>Jumlah: {jumlahLabel}</p>
                      <p>
                        Subtotal: Rp{' '}
                        {parseInt(item.subtotal).toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-2 flex flex-col sm:flex-row gap-2 items-start">
                      {[250, 500, 750, 1000].map(g => (
                        <button
                          key={g}
                          onClick={() => handleChangeQty(item, g)}
                          className={`px-3 py-1 border rounded ${
                            parseInt(item.jumlah_pesanan) === g
                              ? 'bg-green-500 text-white'
                              : 'bg-white text-gray-800'
                          }`}
                        >
                          {g >= 1000 ? `${g / 1000} kg` : `${g} gr`}
                        </button>
                      ))}
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0.25"
                          placeholder="Jumlah (kg)"
                          className="border p-1 rounded w-24 text-sm"
                          onChange={e => {
                            const val = parseFloat(e.target.value)
                            if (!isNaN(val) && val >= 0.25) {
                              handleChangeQty(item, Math.round(val * 1000))
                            }
                          }}
                        />
                        <span className="text-sm text-gray-500">kg</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="px-4 mt-4 border-t pt-4">
            <p className="text-right font-bold text-lg text-black">
              Total: Rp {Math.ceil(total).toLocaleString()}
            </p>
            <button
              className="w-full mt-4 bg-green-600 text-white py-2 rounded"
              onClick={handleCheckout}
            >
              Lanjut ke Pembayaran
            </button>
          </div>
        </>
      )}
    </div>
  )
}