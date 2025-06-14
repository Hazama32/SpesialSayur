'use client'
import { useEffect, useState } from 'react'
import HeaderSection from '@/components/HeaderSection'
type FavoriteItem = {
  id: number
  attributes: {
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

export default function FavoritePage() {
 const [favorites, setFavorites] = useState<FavoriteItem[] | null>(null)

  useEffect(() => {
    fetch('https://spesialsayurdb-production.up.railway.app/api/favorites?populate=produk.gambar')
      .then((res) => res.json())
      .then((data) => setFavorites(data.data))
  }, [])

  const handleRemove = async (id: number) => {
    const res = await fetch(`https://spesialsayurdb-production.up.railway.app/api/favorites/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      setFavorites(favorites.filter((item) => item.id !== id))
    } else {
      alert('Gagal menghapus dari favorit.')
    }
  }

  return (
  <div className="min-h-screen bg-gray-300">
    <HeaderSection title="Favorit" toHome={false} />

    {favorites === null ? (
      <p className="text-black">Memuat data...</p>
    ) : favorites.length === 0 ? (
      <div className="flex flex-col items-center justify-center mt-20">
        <span className="text-5xl text-pink-300">♡</span>
        <p className="text-gray-500 mt-4">Belum ada produk favorit.</p>
      </div>
    ) : (
      <ul className="space-y-4">
        {favorites.map((fav) => {
          const produk = fav.attributes.produk?.data
          const attr = produk?.attributes
          const img = attr?.gambar?.data?.attributes?.url
            ? `https://spesialsayurdb-production.up.railway.app${attr.gambar.data.attributes.url}`
            : '/noimage.png'

          return (
            <li key={fav.id} className="flex items-center gap-4 border-b pb-2">
              <img src={img} alt={attr?.nama} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <p className="font-semibold">{attr?.nama}</p>
                <p className="text-orange-600 text-sm">Rp {attr?.harga?.toLocaleString()}</p>
              </div>
              <button
                onClick={() => handleRemove(fav.id)}
                className="text-sm text-red-500"
              >
                Hapus
              </button>
            </li>
          )
        })}
      </ul>
    )}
  </div>
)
}