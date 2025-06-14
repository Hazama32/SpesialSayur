'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type Product = {
  id: number
  attributes: {
    nama: string
    harga: number
    kategori: string
    deskripsi?: string
    gambar?: {
      data?: {
        attributes?: {
          url?: string
        }
      }
    }
  }
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    fetch(`https://spesialsayurdb-production.up.railway.app/api/produks/${params.id}?populate=*`)
      .then((res) => res.json())
      .then((data) => setProduct(data.data))
  }, [params.id])

  if (!product) return <p className="p-4">Memuat produk...</p>

  const imageUrl = product.attributes?.gambar?.data?.attributes?.url
    ? `https://spesialsayurdb-production.up.railway.app${product.attributes.gambar.data.attributes.url}`
    : '/noimage.png'

  const handleAddToFavorite = async () => {
    const res = await fetch('https://spesialsayurdb-production.up.railway.app/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          produk: product.id,
        },
      }),
    })
    if (res.ok) {
      alert('Ditambahkan ke Favorit!')
    } else {
      alert('Gagal menambahkan ke favorit.')
    }
  }

  const handleCheckoutNow = () => {
    router.push('/checkout')
  }

  return (
    <div className="p-4">
      <img
        src={imageUrl}
        alt={product.attributes.nama}
        className="w-full h-48 object-cover rounded"
      />
      <h1 className="text-xl font-bold mt-4">{product.attributes.nama}</h1>
      <p className="text-gray-600">{product.attributes.kategori}</p>
      <p className="text-orange-500 text-lg font-bold mt-2">
        Rp {product.attributes.harga}
      </p>
      <p className="mt-3 text-sm">
        {product.attributes.deskripsi || 'Tidak ada deskripsi.'}
      </p>

      <div className="flex gap-2 mt-6">
        <button
          onClick={handleAddToFavorite}
          className="flex-1 bg-gray-300 py-2 rounded"
        >
          ❤ Favorit
        </button>
        <button
          onClick={handleCheckoutNow}
          className="flex-1 bg-green-500 text-white py-2 rounded"
        >
          ✅ Lanjut ke Checkout
        </button>
      </div>
    </div>
  )
}
