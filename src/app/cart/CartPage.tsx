'use client'
import { useEffect, useState } from 'react'
import HeaderSection from '@/components/HeaderSection'
type CartItem = {
  id: number
  attributes: {
    qty: number
    produk: {
      data: {
        id: number
        attributes: {
          nama: string
          harga: number
          gambar?: {
            data?: {
              attributes?: {
                url: string
              }
            }
          }
        }
      }
    }
  }
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])  // ✅ aman untuk reduce
  const [loading, setLoading] = useState(true)

  // Ambil data dari Strapi
  useEffect(() => {
    fetch('https://spesialsayurdb-production.up.railway.app/api/carts?populate=produk.gambar')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setItems(data.data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Gagal mengambil data keranjang:', err)
        setLoading(false)
      })
  }, [])

  // Hapus item
  const handleRemove = async (id: number) => {
    const res = await fetch(`https://spesialsayurdb-production.up.railway.app/api/carts/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      setItems(items.filter((item) => item.id !== id))
    } else {
      alert('Gagal menghapus dari keranjang.')
    }
  }

  // ✅ Perhitungan total
  const total = items.reduce((sum, item) => {
    const harga = item.attributes.produk?.data?.attributes?.harga || 0
    const qty = item.attributes.qty || 1
    return sum + harga * qty
  }, 0)

  if (loading) {
    return <p className="p-4">Memuat keranjang...</p>
  }

  return (
    <div className="min-h-screen bg-gray-300">
       <HeaderSection title="Pesanan" toHome={false} />
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
          <ul className="space-y-4 mb-6">
            {items.map((item) => {
              const produk = item.attributes.produk?.data
              const attr = produk?.attributes
              const img = attr?.gambar?.data?.attributes?.url
                ? `https://spesialsayurdb-production.up.railway.app${attr.gambar.data.attributes.url}`
                : '/noimage.png'

              return (
                <li key={item.id} className="flex items-center gap-4 border-b pb-2">
                  <img src={img} alt={attr?.nama} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-semibold">{attr?.nama}</p>
                    <p className="text-sm text-gray-600">Qty: {item.attributes.qty}</p>
                    <p className="text-orange-600 text-sm">
                      Rp {(attr?.harga * item.attributes.qty).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-sm text-red-500"
                  >
                    Hapus
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="mt-4 border-t pt-4">
            <p className="text-right font-bold text-lg">
              Total: Rp {total.toLocaleString()}
            </p>
            <button className="w-full mt-4 bg-green-600 text-white py-2 rounded">
              Lanjut ke Pembayaran
            </button>
          </div>
        </>
      )}
    </div>
  )
}
