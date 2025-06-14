// app/category/[slug]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProducts } from '../../../lib/api';
import { Product } from '../../../types';
import ProductCard from '../../../components/ProductCard';

interface CategoryProductsPageProps {
  params: { slug: string };
}

export default function CategoryProductsPage({ params }: CategoryProductsPageProps) {
  const { slug } = params;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getProducts(slug);
        setProducts(fetchedProducts);
      } catch (err: any) {
        setError('Gagal memuat produk untuk kategori ini: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchProductsByCategory();
    }
  }, [slug]);

  if (loading) return <div className="p-4 text-center">Memuat produk...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 pt-8 pb-20"> {/* pb-20 for bottom navbar */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          {slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ')}
        </h1>
        <div></div> {/* Placeholder */}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>Tidak ada produk dalam kategori ini.</p>
          <button onClick={() => router.push('/')} className="text-green-600 hover:underline mt-4">
            Kembali ke Beranda
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
            {products.map((product: any) => {
            const attr = product.attributes;
            return (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  nama_produk: attr.nama_produk,
                  harga_kiloan: attr.harga_kiloan,
                  gambar:
                    attr.gambar?.data?.map((img: any) => ({
                      url: img.attributes.url,
                    })) || [],
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}