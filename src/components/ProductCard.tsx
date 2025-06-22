'use client'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'

type ProductCardProps = {
  product: {
    id: number;
    nama_produk: string;
    harga_kiloan: string;
    slug: string;
    gambar: { url: string }[];
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()

  const imageUrl =
    'https://spesialsayurdb-production.up.railway.app' + (product.gambar[0]?.url || '')

  const handleCardClick = () => {
    router.push(`/produk/${product.slug}`)
  }

  const handleAddToFavorite = async () => {
    try {
      const res = await fetch('https://spesialsayurdb-production.up.railway.app/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            produk: product.id,
          },
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error?.message || 'Gagal menambahkan ke favorit');
      }

      alert('Produk berhasil ditambahkan ke favorit!');
    } catch (error) {
      console.error('Gagal menambahkan ke favorit:', error);
      alert('Gagal menambahkan ke favorit');
    }
  }

  const handleAddToCart = async () => {
    try {
      const res = await fetch('https://spesialsayurdb-production.up.railway.app/api/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            qty: 1,
            produk: product.id,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.text()
        console.error('Gagal kirim ke cart:', err)
        alert('Gagal menambahkan ke keranjang.')
        return
      }

    // Sukses: pindah ke detail
    router.push(`/produk/${product.id}`)
  } catch (error) {
    console.error('Gagal koneksi ke server:', error)
    alert('Tidak bisa menghubungi server.')
  }
}

  return (
    <div
      className="bg-white rounded-xl shadow p-3 cursor-pointer"
      onClick={handleCardClick}
    >
      <img
        src={imageUrl}
        alt={product.nama_produk}
        className="w-full h-32 object-cover"
      />
      <div className="p-2">
        <h2 className="text-sm font-medium">{product.nama_produk}</h2>
        <p className="text-green-600 font-semibold text-sm">
          Rp {product.harga_kiloan} / gram
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleAddToCart()
        }}
        className="mt-2 w-full bg-green-500 text-white py-1 text-sm rounded"
      >
        Tambah ke Keranjang
      </button>
    </div>
  )
}
