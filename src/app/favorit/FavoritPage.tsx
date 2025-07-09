'use client'

import { useEffect, useState } from "react"
import ProductCard from "@/components/ProductCard"
import { getLocalFavorites } from "@/lib/favStorage"
import Navbar from '@/components/Navbar'

type Produk = {
  id: number
  nama_produk: string
  harga_kiloan: string
  slug: string
  gambar: { url: string }[]
}

export default function FavoritePage() {
  const [filteredProducts, setFilteredProducts] = useState<Produk[]>([])

  useEffect(() => {
    const favorites = getLocalFavorites()
    const ids = favorites.map((fav) => fav.produkId)

    if (ids.length === 0) {
      setFilteredProducts([])
      return
    }

    const fetchProduk = async () => {
      const query = ids.map((id) => `filters[id][$in]=${id}`).join("&")
      const res = await fetch(
        `https://spesialsayurdb-production-b3b4.up.railway.app/api/produks?populate=*`
      )
      const data = await res.json()

      const produkList: Produk[] = []

      data.data.forEach((p: any) => {
        const produkId = p.id ?? p.attributes?.id

        if (!produkId || !ids.includes(produkId)) {
          console.warn("Lewatkan produk yang tidak cocok ID favorit:", produkId)
          return
        }

        produkList.push({
          id: produkId,
          nama_produk: p.nama_produk ?? p.attributes?.nama_produk ?? '',
          harga_kiloan: p.harga_kiloan ?? p.attributes?.harga_kiloan ?? '',
          slug: p.slug ?? p.attributes?.slug ?? '',
          gambar:
            p.gambar?.map((img: any) => ({ url: img.url })) ??
            p.attributes?.gambar?.data?.map((img: any) => ({
              url: img.attributes?.url,
            })) ??
            [],
        })
      })

      setFilteredProducts(produkList)
    }

    fetchProduk()
  }, [])

  return (
    <div className="min-h-screen bg-gray-300 pb-16">
      <Navbar />
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-black">
         {filteredProducts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center min-h-[calc(100vh-150px)]"> {/* Centering for no favorites */}
            <img
              src="/icons/fav.png" // Placeholder for empty favorite icon
              alt="Favorit Kosong"
              className="w-24 h-24 sm:w-50 sm:h-50"
            />
            <p className="text-gray-500 text-center mt-4">Daftar favorit kamu masih kosong.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  )
}
