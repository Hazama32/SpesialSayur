'use client'

import { useState } from 'react'
import { Heart, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react'
import { saveToLocalCart } from '@/lib/cartStorage'
import {
  getLocalFavorites,
  saveToLocalFavorites,
  removeFromLocalFavorites,
} from '@/lib/favStorage'
import { useRouter } from 'next/navigation'

type ProductCardProps = {
  product: {
    id: number
    nama_produk: string
    harga_kiloan: string
    slug: string
    gambar: { url: string }[]
  }
  activePopupId: number | null
  setActivePopupId: (id: number | null) => void
}

export default function ProductCard({
  product,
  activePopupId,
  setActivePopupId,
}: ProductCardProps) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(() =>
    getLocalFavorites().some((fav) => fav.produkId === product.id)
  )
  const [jumlahPesanan, setJumlahPesanan] = useState(250)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  const isPopupOpen = activePopupId === product.id

  const imageUrl =
    'https://spesialsayurdb-production.up.railway.app' +
    (product.gambar[0]?.url || '')

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFavorite) {
      removeFromLocalFavorites(product.id)
    } else {
      saveToLocalFavorites(product.id)
    }
    setIsFavorite(!isFavorite)

    // Tambahkan notifikasi untuk favorite
    setNotificationMessage(isFavorite ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit')
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActivePopupId(isPopupOpen ? null : product.id)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    const harga = Number(product.harga_kiloan)
    saveToLocalCart(product.id, jumlahPesanan, harga)

    // Notifikasi keranjang
    setNotificationMessage(`Ditambahkan ke keranjang: ${jumlahPesanan >= 1000 ? `${jumlahPesanan / 1000} kg` : `${jumlahPesanan} gr`}`)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const handleSelectGram = (gram: number) => {
    setJumlahPesanan(gram)
    setActivePopupId(null)
  }

  const handleInputKg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    if (!isNaN(val) && val >= 0.25) {
      setJumlahPesanan(Math.round(val * 1000))
      setActivePopupId(null)
    } else if (e.target.value === '') {
      setJumlahPesanan(0)
    }
  }

  const handleCardClick = () => {
    router.push(`/produk/${product.slug}`)
  }

  return (
    <div
      className="relative bg-white rounded-xl shadow-lg p-3 cursor-pointer flex flex-col justify-between h-auto overflow-hidden transform transition-transform duration-200 hover:scale-105"
      onClick={handleCardClick}
    >
      {/* Notifikasi */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {notificationMessage}
        </div>
      )}

      {/* Favorite Button */}
      <button
        onClick={toggleFavorite}
        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md z-20 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 hover:scale-110"
      >
        {isFavorite ? (
          <span className="text-red-500 text-xl">❤️</span>
        ) : (
          <Heart className="text-red-500 w-5 h-5" />
        )}
      </button>

      {/* Product Image */}
      <img
        src={imageUrl}
        alt={product.nama_produk}
        className="w-full h-32 object-cover rounded-lg mb-3"
      />

      {/* Product Info */}
      <div className="p-2 flex-grow">
        <h2 className="text-base font-semibold text-gray-800 mb-1">{product.nama_produk}</h2>
        <p className="text-green-600 font-bold text-lg">
          Rp {product.harga_kiloan} / gram
        </p>
      </div>

      {/* Gramasi and Add to Cart Section */}
      <div className="flex items-center gap-2 mt-auto">
        {/* Gramasi Dropdown */}
        <div className="relative flex-grow">
          <button
            onClick={toggleDropdown}
            className="w-full border border-green-500 px-3 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-medium flex justify-between items-center transition-colors duration-200 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {jumlahPesanan >= 1000
              ? `${jumlahPesanan / 1000} kg`
              : `${jumlahPesanan} gr`}
            {isPopupOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {isPopupOpen && (
            <div
              className="absolute bottom-full left-0 mb-2 z-50 w-full bg-white p-2 rounded-lg shadow-xl grid grid-cols-2 gap-2 transform transition-all duration-200 origin-bottom scale-y-100 opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              {[250, 500, 750, 1000].map((gram) => (
                <button
                  key={gram}
                  onClick={() => handleSelectGram(gram)}
                  className={`border px-3 py-2 rounded-lg text-sm w-full font-medium transition-colors duration-200
                    ${jumlahPesanan === gram
                      ? 'bg-green-600 text-white border-green-600 shadow-md'
                      : 'border-green-500 text-green-600 hover:bg-green-50'
                    }`}
                >
                  {gram >= 1000 ? `${gram / 1000} kg` : `${gram} gr`}
                </button>
              ))}
              <div className="col-span-2 flex items-center border border-gray-300 rounded-lg p-1 bg-gray-50">
                <input
                  type="number"
                  step="0.01"
                  min="0.25"
                  placeholder="0.25"
                  value={jumlahPesanan > 0 && ![250, 500, 750, 1000].includes(jumlahPesanan) ? (jumlahPesanan / 1000).toFixed(2) : ''}
                  onClick={(e) => e.stopPropagation()}
                  onChange={handleInputKg}
                  className="flex-grow p-1 rounded-md text-sm text-center bg-transparent focus:outline-none"
                />
                <span className="text-sm font-medium text-gray-600 pr-1">kg</span>
              </div>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="bg-green-600 text-white p-3 rounded-lg shadow-md transition-all duration-200 hover:bg-green-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <ShoppingCart size={20} />
        </button>
      </div>
    </div>
  )
}
