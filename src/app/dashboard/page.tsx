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
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const [bannerList, setBannerList] = useState<string[]>([])

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

    // ✅ Fetch multiple voucher banner aktif
    fetch('https://spesialsayurdb-production.up.railway.app/api/vouchers?populate=*')
      .then((res) => res.json())
      .then((data) => {
        const vouchers: VoucherItem[] = data.data || []
        const activeBanners = vouchers
          .filter((v) => v?.status_voucher === true)
          .map((v) => {
            if (v?.banner?.formats?.small?.url) {
              return (
                'https://spesialsayurdb-production.up.railway.app' +
                v.banner.formats.small.url
              )
            } else if (v?.banner?.url) {
              return (
                'https://spesialsayurdb-production.up.railway.app' +
                v.banner.url
              )
            } else {
              return null
            }
          })
          .filter((url) => url !== null) as string[]

        setBannerList(activeBanners)
      })
      .catch((err) => {
        console.error('Gagal fetch voucher:', err)
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

        <p className="text-lg mx-2">Selamat Datang Bintang</p>

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

      {/* ✅ BANNER CAROUSEL */}
      <div className="px-4">
        {bannerList.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={true}
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
      
      {/* footer */}
      <div className='h-8 pt-8'>
          <p>footer buat copyright</p>
      </div>
    </div>
  )
}
