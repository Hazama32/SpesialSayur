'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { LogoutButton } from '@/components/LogoutButton'
import Navbar from '@/components/Navbar'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

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
  is_special_offer?: boolean
  offer_ends_at?: string
}

type VoucherItem = {
  id: number
  status_voucher: boolean | null
  banner: {
    url: string
    formats?: {
      small?: {
        url: string
      }
    }
  }
}

export default function HomePage() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [specialOffers, setSpecialOffers] = useState<ProductItem[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [bannerList, setBannerList] = useState<string[]>([])
  const [activePopupId, setActivePopupId] = useState<number | null>(null)
  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : ''

  useEffect(() => {
    fetch('https://spesialsayurdb-production-b3b4.up.railway.app/api/produks?populate=*')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          const now = new Date()
          const specials = data.data.filter(
            (p: ProductItem) =>
              p.is_special_offer &&
              p.offer_ends_at &&
              new Date(p.offer_ends_at) > now
          )
          setSpecialOffers(specials)
          setProducts(data.data)
        }
      })
      .catch((err) => console.error('Gagal fetch produk:', err))

    fetch('https://spesialsayurdb-production-b3b4.up.railway.app/api/vouchers?populate=*')
      .then((res) => res.json())
      .then((data) => {
        const vouchers: VoucherItem[] = data.data || []
        const activeBanners = vouchers
          .filter((v) => v?.status_voucher === true)
          .map((v) =>
            v?.banner?.formats?.small?.url
              ? 'https://spesialsayurdb-production-b3b4.up.railway.app' + v.banner.formats.small.url
              : v?.banner?.url
              ? 'https://spesialsayurdb-production-b3b4.up.railway.app' + v.banner.url
              : null
          )
          .filter(Boolean) as string[]

        setBannerList(activeBanners)
      })
      .catch((err) => console.error('Gagal fetch voucher:', err))
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
    <div className="min-h-screen bg-gray-300 pb-16">
      <Navbar />

      {/* HEADER */}
      <div className="bg-green-600 text-white p-4 pt-4 mt-0 rounded-b-2xl">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <img src="/Logos.png" alt="Logo" className="w-16 h-16" />
            <h1 className="text-xl font-bold">Spesial Sayur</h1>
          </div>
          <div className="flex gap-2">
            <LogoutButton />
          </div>
        </div>
        <p className="text-lg mx-2">Selamat Datang {username}</p>
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

      <div className="h-4" />

      {/* BANNER */}
      <div className="px-4">
        {bannerList.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            className="w-full h-40 rounded-lg shadow overflow-hidden"
          >
            {bannerList.map((url, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={url}
                  alt={`Banner ${idx + 1}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <img
            src="/banner.jpg"
            alt="Default Banner"
            className="w-full h-40 object-cover rounded-lg shadow"
          />
        )}
      </div>

      {/* KATEGORI */}
      <div className="mt-4 px-4 flex gap-2 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1 rounded-full whitespace-nowrap text-sm ${
              category === cat ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SPECIAL OFFERS */}
      {specialOffers.length > 0 && (
        <div className="mt-6 px-4">
          <h2 className="text-xl font-bold text-green-700 mb-3">Special Offer</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {specialOffers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                activePopupId={activePopupId}
                setActivePopupId={setActivePopupId}
              />
            ))}
          </div>
        </div>
      )}

      {/* SEMUA PRODUK */}
      <div className="mt-6 px-4">
        <h2 className="text-xl font-bold text-green-700 mb-3">Semua Produk</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-black">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              activePopupId={activePopupId}
              setActivePopupId={setActivePopupId}
            />
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[100px]" />

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-600 py-4">
        <p>&copy; 2025 Spesial Sayur. All rights reserved.</p>
      </footer>
    </div>
  )
}
