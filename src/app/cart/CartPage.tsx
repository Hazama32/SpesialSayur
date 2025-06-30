'use client'

import { useEffect, useState } from 'react'
import HeaderSection from '@/components/HeaderSection'
import {
  getLocalCart,
  removeFromLocalCart,
  updateQtyInLocalCart,
  clearLocalCart,
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

  // ✅ Sinkron saat login (jika ada jwt)
  useEffect(() => {
    const jwt = localStorage.getItem('jwt')
    const cart = getLocalCart()

    if (jwt && cart.length > 0) {
      const produk_pesanan = cart.map((item) => ({
        jumlah_pesanan: item.jumlah_pesanan,
        subtotal: item.subtotal,
        produks: item.produkId,
      }))

      fetch('https://spesialsayurdb-production.up.railway.app/api/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            isActive: true,
            produk_pesanan,
          },
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log('✅ Sinkron saat login berhasil:', res)
          clearLocalCart()
        })
        .catch((err) => console.error('❌ Sinkron gagal:', err))
    }
  }, [])
  

  // ✅ Ambil cart dari localStorage dan detail produk dari API
  useEffect(() => {
  const localCart = getLocalCart()

  if (localCart.length === 0) {
    setLoading(false)
    return
  }

  const fetchAllProduk = async () => {
    try {
      const res = await fetch(
        'https://spesialsayurdb-production.up.railway.app/api/produks?populate=*'
      )
      const data = await res.json()

      if (!data?.data || data.data.length === 0) {
        setLoading(false)
        return
      }

      const produkMap = new Map<number, Produk>()
      data.data.forEach((p: any) => {
        if (!p || !p.id || !p.nama_produk) {
          console.warn("Produk invalid atau tidak lengkap:", p)
          return
        }

        produkMap.set(p.id, {
          id: p.id,
          nama_produk: p.nama_produk,
          harga_kiloan: p.harga_kiloan,
          gambar: p.gambar?.map((img: any) => ({
            id: img.id,
            url: img.url,
          })) || [],
        })
      })


const localCart = getLocalCart()
console.log("Isi localCart:", localCart)


      const itemsFromLocal = localCart
        .map((item, index) => {
          const produk = produkMap.get(item.produkId)
          if (!produk) return null

          return {
            id: index + 1,
            jumlah_pesanan: String(item.jumlah_pesanan),
            subtotal: String(item.subtotal),
            produks: produk,
          }
        })
        .filter(Boolean)

      setItems(itemsFromLocal as ProdukPesanan[])
    } catch (error) {
      console.error("Gagal mengambil produk:", error)
    } finally {
      setLoading(false)
    }
  }

  fetchAllProduk()
}, [])


  const handleRemove = (id: number) => {
    const produkId = items.find((i) => i.id === id)?.produks.id
    if (!produkId) return

    removeFromLocalCart(produkId)
    const updated = items.filter((item) => item.id !== id)
    setItems(updated)
  }

  const handleChangeQty = (item: ProdukPesanan, newQty: number) => {
    const minQty = 250
    if (newQty < minQty) {
      const confirmDelete = window.confirm(
        'Jumlah minimal adalah 250 gram.\nApakah kamu ingin menghapus produk ini dari keranjang?'
      )
      if (confirmDelete) {
        handleRemove(item.id)
      }
      return
    }

    const harga = parseInt(item.produks?.harga_kiloan || '0', 10)
    const subtotal = (harga / 1000) * newQty

    updateQtyInLocalCart(item.produks.id, newQty)

    const updatedItems = items.map((i) =>
      i.id === item.id
        ? {
            ...i,
            jumlah_pesanan: String(newQty),
            subtotal: String(subtotal),
          }
        : i
    )

    setItems(updatedItems)
  }

  const handleClearAll = () => {
    const confirmClear = window.confirm(
      'Apakah kamu yakin ingin menghapus semua produk dari keranjang?'
    )
    if (!confirmClear) return

    clearLocalCart()
    setItems([])
  }

  const total = items.reduce((sum, item) => {
    return sum + parseFloat(item.subtotal || '0')
  }, 0)

  if (loading) {
    return <p className="p-4">Memuat keranjang...</p>
  }

  return (
    <div className="min-h-screen bg-gray-300">
      <HeaderSection title="Pesanan" />

      {/* Tombol Batalkan Semua */}
      {items.length > 0 && (
        <div className="flex justify-end px-4 mt-2">
          <button
            onClick={handleClearAll}
            className="text-sm text-red-500 hover:text-red-700 underline"
          >
            Batalkan Semua
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <img
            src="/icons/cart 3.png"
            alt="Keranjang Kosong"
            className="w-24 h-24 sm:w-32 sm:h-32"
          />
          <p className="text-gray-500 text-center">Keranjang kamu masih kosong.</p>
        </div>
      ) : (
        <>
          <ul className="space-y-4 mb-6 px-4">
            {items.map((item) => {
              const produk = item.produks
              const img =
                produk.gambar?.[0]?.url
                  ? `https://spesialsayurdb-production.up.railway.app${produk.gambar[0].url}`
                  : '/noimage.png'

              return (
                <li
                  key={item.id}
                  className="relative flex gap-4 p-4 border rounded bg-white shadow"
                >
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>

                  <img
                    src={img}
                    alt={produk.nama_produk}
                    className="h-24 w-24 object-cover rounded"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">{produk.nama_produk}</h2>
                      <p className="text-sm text-gray-600">Rp {produk.harga_kiloan} / kg</p>
                    </div>

                    <div className="mt-2 flex justify-between items-center">
                      <div className="text-sm text-gray-700">
                        <p>Jumlah: {item.jumlah_pesanan} gr</p>
                        <p>
                          Subtotal: Rp{' '}
                          {Math.ceil(parseFloat(item.subtotal)).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-col items-start">
                        <div className="flex gap-2 flex-wrap mb-2">
                          {[250, 500, 750, 1000].map((g) => (
                            <button
                              key={g}
                              onClick={() => handleChangeQty(item, g)}
                              className={`border px-3 py-1 rounded ${
                                parseInt(item.jumlah_pesanan) === g
                                  ? 'bg-green-500 text-white'
                                  : 'bg-white text-gray-800'
                              }`}
                            >
                              {g >= 1000 ? `${g / 1000} kg` : `${g} gr`}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0.25"
                            placeholder="Jumlah (kg)"
                            className="border p-1 rounded w-28 text-sm"
                            onChange={(e) => {
                              const val = parseFloat(e.target.value)
                              if (!isNaN(val) && val >= 0.25) {
                                handleChangeQty(item, Math.round(val * 1000))
                              }
                            }}
                          />
                          <span className="text-sm text-gray-600">kg</span>
                        </div>

                        <p className="text-xs text-gray-500 mt-1">Minimal 0.25 kg</p>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="mt-4 border-t pt-4 px-4">
            <p className="text-right font-bold text-lg text-black">
              Total: Rp {Math.ceil(total).toLocaleString()}
            </p>
            <button className="fixed b-10 w-full mt-4 bg-green-600 text-white py-2 rounded">
              Lanjut ke Pembayaran
            </button>
          </div>
        </>
      )}
    </div>
  )
}
