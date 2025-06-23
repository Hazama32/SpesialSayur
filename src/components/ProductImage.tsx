'use client'

type ProductCardProps = {
  product: {
    id: number;
    nama_produk: string;
    harga_kiloan: string;
    slug: string;
    gambar: { url: string }[];
  }
}

export default function ProductImage({ product }: ProductCardProps) {

  const imageUrl =
    'https://spesialsayurdb-production.up.railway.app' + (product.gambar[0]?.url || '')

  return (
    <div
      className="bg-white rounded-xl shadow p-3 cursor-pointer"    >
      <img
        src={imageUrl}
        alt={product.nama_produk}
        className="w-full h-32 object-cover"
      />
    </div>
  )
}
