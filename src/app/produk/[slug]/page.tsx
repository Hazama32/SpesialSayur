'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Gambar = {
  id: number;
  url: string;
};

type Product = {
  id: number;
  nama_produk: string;
  deskripsi: string;
  slug: string;
  harga_kiloan: string;
  gambar: Gambar[];
  kategori?: {
    kategori: string;
  };
};

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [gramasi, setGramasi] = useState('');
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  useEffect(() => {
    if (!slug) return;
    fetch(`https://spesialsayurdb-production.up.railway.app/api/produks?filters[slug][$eq]=${slug}&populate=*`)
      .then((res) => res.json())
      .then((data) => {
        const produk = data?.data?.[0];
        if (produk) setProduct(produk);
      })
      .catch((err) => {
        console.error('Gagal mengambil produk:', err);
      });
  }, [slug]);

  if (!product) return <p className="p-4">Memuat produk...</p>;

  const handleAddToFavorite = async () => {
    const res = await fetch('https://spesialsayurdb-production.up.railway.app/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { produk: product.id } }),
    });

    if (res.ok) alert('✅ Ditambahkan ke Favorit!');
    else alert('❌ Gagal menambahkan ke favorit.');
  };

  const handleCheckoutNow = () => {
    if (!gramasi || isNaN(Number(gramasi))) {
      alert('Masukkan jumlah gram yang valid!');
      return;
    }

    const hargaPerKilo = parseInt(product.harga_kiloan);
    const jumlahGram = parseInt(gramasi);
    const totalHarga = (hargaPerKilo / 1000) * jumlahGram;

    alert(
      `✅ Anda memesan ${jumlahGram} gram.\nTotal harga: Rp ${Math.ceil(totalHarga)}.\nLanjut ke checkout...`
    );

    // Simulasi redirect
    router.push('/checkout');
  };

  const handleBackHome = () => {
    router.push('/');
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      {/* Tombol kembali */}
      <button
        onClick={handleBackHome}
        className="text-blue-500 underline mb-4 inline-block"
      >
        ← Kembali ke Home
      </button>

      {/* Gambar produk */}
      <div className="flex gap-3 overflow-x-auto mb-4">
        {product.gambar?.map((img) => (
          <img
            key={img.id}
            src={`https://spesialsayurdb-production.up.railway.app${img.url}`}
            alt="Gambar produk"
            className="h-40 rounded object-cover"
          />
        ))}
      </div>

      {/* Info produk */}
      <h1 className="text-xl font-bold">{product.nama_produk}</h1>
      <p className="text-gray-600">
        {product.kategori?.kategori || 'Tanpa kategori'}
      </p>
      <p className="text-orange-500 text-lg font-bold mt-2">
        Rp {product.harga_kiloan} / kg
      </p>
      <p className="mt-3 text-sm">{product.deskripsi || 'Tidak ada deskripsi.'}</p>

      {/* Form gramasi */}
      <div className="mt-4">
        <label className="block font-medium mb-1">Jumlah gram:</label>
        <input
          type="number"
          value={gramasi}
          onChange={(e) => setGramasi(e.target.value)}
          placeholder="Contoh: 500"
          className="w-full border p-2 rounded mb-2"
        />
      </div>

      {/* Tombol aksi */}
      <div className="flex gap-2 mt-4">
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
  );
}
