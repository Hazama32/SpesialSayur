import { useEffect } from "react"
import { getLocalCart, clearLocalCart, LocalCartItem } from "./cartStorage"

export function CartSync() {
  useEffect(() => {
    const now = Date.now()
    const cart: LocalCartItem[] = getLocalCart()

    const expired = cart.filter((item) => now - item.timestamp >= 1000 * 60 * 60)
    if (expired.length === 0) return

    const token = localStorage.getItem("jwt") || ""

    const produk_pesanan = expired.map((item) => ({
      jumlah_pesanan: item.jumlah_pesanan,
      subtotal: item.subtotal,
      produks: item.produkId,
    }))

    fetch("https://spesialsayurdb-production.up.railway.app/api/carts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          isActive: true,
          produk_pesanan,
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("✅ Sync berhasil:", res)
        clearLocalCart()
      })
      .catch((err) => console.error("❌ Gagal sync:", err))
  }, [])
}