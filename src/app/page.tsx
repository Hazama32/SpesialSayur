'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProductImage from '@/components/ProductImage'
import { CheckCircle, Truck, ShoppingCart, BadgePercent, UserPlus, Handshake } from 'lucide-react'

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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      setIsLoggedIn(true)
    }

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

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* HEADER */}
      <div className="bg-green-600 text-white p-4 pt-4 mt-0 rounded-b-2xl shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <img src="/Logo 2.png" alt="Logo" className="w-16 h-16" />
            <h1 className="text-xl font-bold">Spesial Sayur</h1>
          </div>

          <div className="flex gap-2">
            <a href="/login" className="text-lg hover:underline">Login</a>
            <span>|</span>
            <a href="/register" className="text-lg hover:underline">Daftar</a>
          </div>
        </div>

        <p className="text-lg mx-2">Selamat Datang di Spesial Sayur</p>

        <div className="mt-3">
          <input
            type="text"
            placeholder="Apa yang ingin anda butuhkan?"
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
          className="w-full h-40 object-cover rounded-lg shadow"
        />
      </div>

      {/* SECTION: LATAR BELAKANG */}
      <section className="mt-8 px-6 text-center space-y-4">
        <h1 className='text-3xl font-bold text-green-700 mb-4 p-6'>Mengapa Harus Memilih Spesial Sayur?</h1>
        <h2 className="text-2xl font-bold text-green-700 mb-4">Latar Belakang Spesial Sayur</h2>
        <p className="text-gray-700 leading-relaxed">
          Spesial Sayur hadir untuk mempermudah Anda mendapatkan sayuran dan buah segar dengan harga terjangkau.
          Kami bekerja sama dengan petani lokal dan pemasok terpercaya agar Anda selalu mendapatkan produk berkualitas terbaik.
          Berbelanja kebutuhan dapur kini semakin praktis, cukup dari genggaman tangan Anda.
        </p>
      </section>

      {/* SECTION: KEUNGGULAN */}
      <section className="mt-12 px-6">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Keunggulan Spesial Sayur</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card icon={<CheckCircle className="text-green-600 w-8 h-8" />} title="Produk Selalu Segar" desc="Kami menyediakan produk yang segar setiap hari, langsung dari petani dan pemasok terpercaya." />
          <Card icon={<BadgePercent className="text-green-600 w-8 h-8" />} title="Harga Kompetitif" desc="Harga terjangkau dengan transparansi, tanpa biaya tersembunyi." />
          <Card icon={<Truck className="text-green-600 w-8 h-8" />} title="Pengiriman Cepat" desc="Pengiriman tepat waktu dengan sistem distribusi yang handal dan efisien." />
          <Card icon={<Handshake className="text-green-600 w-8 h-8" />} title="Mendukung Produk Lokal" desc="Kami berkomitmen membantu petani dan usaha kecil lokal, ikut membangun ekonomi masyarakat sekitar dan mendapatkan produk segar terbaik."/>
        </div>
      </section>

      {/* SECTION: LAYANAN KHUSUS */}
      <section className="mt-12 px-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Layanan Khusus untuk Restoran dan Usaha</h2>
        <p className="text-gray-700 leading-relaxed">
          Kami menyediakan harga grosir, sistem langganan, dan pengiriman terjadwal khusus untuk restoran, kafe, dan usaha kuliner Anda.
          Kami pastikan ketersediaan stok dan pengiriman yang konsisten agar operasional usaha Anda selalu lancar.
        </p>
      </section>

      {/* SECTION: PROSES PEMESANAN */}
      <section className="mt-12 px-6">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Proses Pemesanan Online</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card icon={<UserPlus className="text-green-600 w-8 h-8" />} title="Login atau Daftar" desc="Buat akun Anda dengan cepat untuk menikmati seluruh fitur dan promo menarik kami." />
          <Card icon={<ShoppingCart className="text-green-600 w-8 h-8" />} title="Cari dan Pilih Produk" desc="Telusuri katalog kami yang lengkap dan pilih produk yang Anda butuhkan dengan mudah." />
          <Card icon={<Truck className="text-green-600 w-8 h-8" />} title="Masukkan Alamat Pengiriman" desc="Isi alamat pengiriman secara lengkap untuk memastikan pesanan sampai dengan tepat waktu." />
          <Card icon={<CheckCircle className="text-green-600 w-8 h-8" />} title="Pilih Pembayaran & Kirim Pesanan" desc="Nikmati pilihan pembayaran yang aman dan fleksibel. Pesanan Anda akan segera dikirimkan." />
        </div>
      </section>

      {/* SECTION: DUKUNG USAHA */}
      <section className="mt-12 px-6 text-center space-y-4 mb-12">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Solusi Andal untuk Kebutuhan Usaha Kuliner Anda</h2>
        <p className="text-gray-700 leading-relaxed">
         Spesial Sayur menjadi pilihan tepat bagi usaha kuliner yang membutuhkan pasokan bahan baku segar dengan proses pemesanan yang mudah dan pengiriman yang terjadwal dengan baik.
         Kami menyediakan produk berkualitas yang selalu tersedia setiap hari, sehingga Anda bisa berfokus mengembangkan usaha tanpa perlu khawatir kehabisan stok.
         Dengan sistem pengelolaan pesanan yang efisien dan layanan pelanggan yang cepat tanggap maka proses belanja menjadi lebih praktis dan nyaman.
        </p>
        <p className="mt-4 text-lg text-green-700 font-semibold">Hubungi kami sekarang di WhatsApp: 08xxxxxxxxx</p>
      </section>

      {/* PRODUK */}
      {isLoggedIn ? (
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-black">
          {filteredProducts.map((product) => (
            <ProductImage key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-lg text-gray-700 mt-8 pb-4">
          <p>
            Silakan{' '}
            <span
              className="text-green-600 font-semibold cursor-pointer"
              onClick={() => router.push('/login')}
            >
              Login
            </span>{' '}
            atau{' '}
            <span
              className="text-green-600 font-semibold cursor-pointer"
              onClick={() => router.push('/register')}
            >
              Daftar
            </span>{' '}
            untuk melihat produk kami.
          </p>
        </div>
      )}
    </div>
  )
}

// KOMPONEN CARD
const Card = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition text-center space-y-4">
    <div className="flex justify-center">{icon}</div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
)
