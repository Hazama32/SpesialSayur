'use client'
import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { LogoutButton } from '@/components/LogoutButton'

type ProductItem = {
  slug: string
  id: number
  nama_produk: string
  kategori: {
    kategori: string
  }
  deskripsi: string
  harga_kiloan: string
  gambar: any[]
}

export default function HomePage() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
  fetch('https://spesialsayurdb-production.up.railway.app/api/produks?populate=*')
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data.data)) {
        setProducts(data.data)
      }
    })
    .catch((err) => {
      console.error('Gagal fetch produk:', err)
    })
}, [])


  const filteredProducts = products.filter((item) => {
    const name = item.nama_produk?.toLowerCase() || ''
    const cat = item.kategori?.kategori?.toLowerCase() || ''
    return (
      name.includes(search.toLowerCase()) &&
      (category === 'All' || cat === category.toLowerCase())
    )
  })

  const categories = ['All', 'Sayur', 'Buah']

  return (
    <div className="min-h-screen bg-gray-300">
     {/* HEADER SAJA */}
      <div className="bg-green-600 text-white p-4 pt-4 mt-0 rounded-b-2xl">
        {/* Baris Logo + Login/Daftar */}
        <div className="flex justify-between items-center mb-2">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/Logo 2.png" alt="Logo" className="w-16 h-16" />
            <h1 className="text-xl font-bold">Spesial Sayur</h1>
          </div>

          {/* Tombol Login & Daftar */}
          <div className="flex gap-2">
            <LogoutButton/>
          </div>
        </div>

        {/* Selamat datang */}
        <p className="text-lg mx-2">Selamat Datang Bintang</p>

        {/* SEARCH BAR */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="Apa yang ingin anda butuhkan?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 rounded-full shadow-lg text-black"
          />
        </div>
      </div>
      {/* SPACER */}
      <div className="h-4" />

      {/* BANNER PROMO */}
      <div className="px-4">
        <img
          src="/banner.jpg"
          alt="Banner Promo"
          className="w-full h-36 object-cover rounded-lg shadow text-black"
        />
      </div>

      {/* KATEGORI FILTER */}
      <div className="mt-4 px-4 flex gap-2 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1 rounded-full whitespace-nowrap text-sm ${
              category === cat
                ? 'bg-green-800 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUK */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-black">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
