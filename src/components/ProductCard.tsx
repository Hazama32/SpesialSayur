'use client'

import { useState } from 'react'
import { Heart, ChevronDown, ChevronUp } from 'lucide-react'
import { saveToLocalCart } from '@/lib/cartStorage'
import {
  getLocalFavorites,
  saveToLocalFavorites,
  removeFromLocalFavorites,
} from '@/lib/favStorage'
import GramasiPopup from './GramasiPopup'

type ProductCardProps = {
  product: {
    id: number
    nama_produk: string
    harga_kiloan: string
    slug: string
    gambar: { url: string }[]
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(() =>
    getLocalFavorites().some((fav) => fav.produkId === product.id)
  )
  const [jumlahPesanan, setJumlahPesanan] = useState(250) // default gram
  const [showDropdown, setShowDropdown] = useState(false)

  const hargaPerKg = Number(product.harga_kiloan)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFavorite) {
      removeFromLocalFavorites(product.id)
    } else {
      saveToLocalFavorites(product.id)
    }
    setIsFavorite(!isFavorite)
  }

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDropdown(!showDropdown)
  }

  const handleSelectGram = (gram: number) => {
    setJumlahPesanan(gram)
    setShowDropdown(false)
  }

  const handleInputKg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    if (!isNaN(val) && val >= 0.25) {
      setJumlahPesanan(Math.round(val * 1000)) // simpan ke gram
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    const subtotal = (hargaPerKg / 1000) * jumlahPesanan
    saveToLocalCart(product.id, jumlahPesanan, hargaPerKg)
    alert(
      `Ditambahkan ke keranjang:\n${jumlahPesanan >= 1000 ? jumlahPesanan / 1000 + ' kg' : jumlahPesanan + ' gr'}\nSubtotal: Rp ${Math.ceil(subtotal).toLocaleString()}`
    )
  }

  const imageUrl = `https://spesialsayurdb-production.up.railway.app${product.gambar[0]?.url || ''}`

  return (
    <div className="relative bg-white rounded-xl shadow p-3 cursor-pointer h-64 w-full">
      {/* Favorite */}
      <button
        onClick={toggleFavorite}
        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
      >
        {isFavorite ? (
          <span className="text-red-500">❤️</span>
        ) : (
          <Heart className="text-red-500 w-5 h-5" />
        )}
      </button>

      <img
        src={imageUrl}
        alt={product.nama_produk}
        className="w-full h-32 object-cover rounded"
      />

      <div className="p-2">
        <h2 className="text-sm font-medium">{product.nama_produk}</h2>
        <p className="text-green-600 font-semibold text-sm">
          Rp {hargaPerKg} / kg
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleDropdown}
          className="border border-green-500 px-3 py-1 rounded bg-green-500 text-white text-sm flex-1 flex justify-between items-center"
        >
          {jumlahPesanan >= 1000
            ? `${jumlahPesanan / 1000} kg`
            : `${jumlahPesanan} gr`}
          {showDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <input
          type="number"
          step="0.01"
          min="0.25"
          placeholder="kg"
          onChange={handleInputKg}
          value={jumlahPesanan >= 1000 ? (jumlahPesanan / 1000).toFixed(2) : ''}
          className="border p-1 rounded w-16 text-sm text-center"
        />
        <span className="text-sm">kg</span>

        <button
          onClick={handleAddToCart}
          className="bg-green-500 text-white p-2 rounded"
        >
          🛒
        </button>
      </div>

      {showDropdown && (
        <GramasiPopup
          selectedGram={jumlahPesanan}
          onSelectGram={handleSelectGram}
        />
      )}
    </div>
  )
}