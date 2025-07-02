import { cookies } from 'next/headers'
import { getLocalCart, clearLocalCart } from './cartStorage'

export async function sendCartToPesanan(alamat: string, metodePembayaran: string) {
  const cartItems = getLocalCart()

  if (cartItems.length === 0) {
    throw new Error("Cart kosong!")
  }

  const totalHarga = cartItems.reduce((acc, item) => acc + item.subtotal, 0)

  // ✅ Ambil JWT dari cookie server-side
  const jwt = cookies().get('jwt')?.value

  if (!jwt) {
    throw new Error("Unauthorized: JWT tidak ditemukan di cookie.")
  }

  // ✅ Ambil data user dari /users/me pakai JWT
  const userRes = await fetch(`${process.env.STRAPI_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    cache: 'no-store',
  })

  if (!userRes.ok) {
    throw new Error("Gagal mengambil data user.")
  }

  const user = await userRes.json()
  console.log("✅ User:", user)

  // Pakai data user di payload
  const payload = {
    data: {
      username: user.username,
      alamat_pengiriman: user.alamat_pengiriman || alamat, // fallback ke form kalau user null
      status_pesanan: "menunggu",
      metode_pembayaran: metodePembayaran,
      total_harga: String(totalHarga),
      produk_dipesan: cartItems.map(item => ({
        jumlah_pesanan: String(item.jumlah_pesanan),
        subtotal: String(item.subtotal),
        produks: item.produkId
      }))
    }
  }

  // ✅ Kirim pesanan ke Strapi pakai JWT
  const res = await fetch(`${process.env.STRAPI_URL}/api/pesanans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    console.error(await res.text())
    throw new Error("Gagal mengirim pesanan.")
  }

  const data = await res.json()
  console.log("✅ Pesanan terkirim:", data)

  clearLocalCart()

  return data
}