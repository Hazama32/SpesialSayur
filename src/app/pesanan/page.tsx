'use client'

import { useEffect, useState } from 'react'

type ProdukPesanan = {
  id: number
  jumlah_pesanan: string
  subtotal: string
  produks: {
    id: number
    nama_produk: string
    harga_kiloan: string
    gambar: { url: string }[]
  }
}

export default function PesananPage() {
  const [user, setUser] = useState<any>(null)
  const [cartItems, setCartItems] = useState<ProdukPesanan[]>([])
  const [metode, setMetode] = useState('cash')
  const [alamat, setAlamat] = useState('')

  useEffect(() => {
    // GET user dari /api/me
    fetch('/api/me')
      .then(async res => {
        if (!res.ok) {
          console.error('API /me error:', res.status)
          return null
        }
        return res.json()
      })
      .then(data => {
        console.log('API /me data:', data)
        if (data?.error) {
          alert('Token invalid. Silakan login ulang.')
        } else {
          setUser(data)
          setAlamat(data.alamat_pengiriman || '')
        }
      })
      .catch(err => console.error(err))

    // GET checkoutCart
    const local = localStorage.getItem('checkoutCart')
    console.log('Checkout Cart:', local)
    if (local) {
      setCartItems(JSON.parse(local))
    }
  }, [])

  const total = cartItems.reduce((sum, i) => sum + parseFloat(i.subtotal), 0)

  const handleSubmit = async () => {
    if (!alamat || !metode) {
      alert('Alamat & metode pembayaran harus diisi!')
      return
    }

    if (!cartItems || cartItems.length === 0) {
      alert('Tidak ada produk yang dipesan!')
      return
    }

    const produk_dipesan = cartItems.map(item => ({
      jumlah_pesanan: item.jumlah_pesanan,
      subtotal: item.subtotal,
      produks: item.produks.id,
    }))

    const payload = {
      data: {
        tanggal_pesan: new Date().toISOString(), // ✅ Tambahkan field tanggal_pesan
        alamat_pengiriman: alamat,
        status_pesanan: 'menunggu',
        metode_pembayaran: metode,
        total_harga: total,
        user: user.id,
        produk_dipesan,
      },
    }

    console.log('✅ Kirim Payload:', payload)

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const result = await res.json()
    console.log('✅ API /api/checkout result:', result)

    if (result.data) {
      alert('✅ Pesanan berhasil!')
      localStorage.removeItem('checkoutCart')
    } else {
      alert(`❌ Gagal kirim pesanan: ${result.error}`)
    }
  }

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Konfirmasi Pesanan</h1>

      <p className="mb-2">
        <strong>User:</strong> {user ? user.username : 'Memuat...'}
      </p>

      <div className="mb-2">
        <label>Alamat:</label>
        <textarea
          className="w-full border p-2"
          value={alamat}
          onChange={e => setAlamat(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label>Metode Pembayaran:</label>
        <select
          className="border p-2 w-full"
          value={metode}
          onChange={e => setMetode(e.target.value)}
        >
          <option value="cash">Cash</option>
          <option value="transfer">Transfer</option>
        </select>
      </div>

      <h2 className="text-lg font-semibold mt-4 mb-2">Produk</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Tidak ada produk di pesanan.</p>
      ) : (
        <ul className="space-y-2">
          {cartItems.map(item => (
            <li
              key={item.id}
              className="border p-2 rounded flex justify-between"
            >
              <div>
                {item.produks.nama_produk} ({item.jumlah_pesanan} gr)
              </div>
              <div>Rp {parseInt(item.subtotal).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-right mt-4">
        <strong>Total: Rp {total.toLocaleString()}</strong>
      </p>

      <button
        className="w-full bg-green-600 text-white py-2 rounded mt-4"
        onClick={handleSubmit}
      >
        Kirim Pesanan
      </button>
    </main>
  )
}