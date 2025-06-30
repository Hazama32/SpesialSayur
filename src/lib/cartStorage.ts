const CART_KEY = "local_cart_spesialsayur"

export type LocalCartItem = {
  produkId: number
  jumlah_pesanan: number
  harga_satuan: number
  subtotal: number
  timestamp: number
}

export function getLocalCart(): LocalCartItem[] {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem(CART_KEY)
  try {
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveToLocalCart(
  produkId: number,
  jumlah_pesanan: number,
  harga_satuan: number
) {
  const now = Date.now()
  const subtotal = harga_satuan * jumlah_pesanan
  const existing = getLocalCart()

  const updated = [...existing, {
    produkId,
    jumlah_pesanan,
    harga_satuan,
    subtotal,
    timestamp: now,
  }]

  localStorage.setItem(CART_KEY, JSON.stringify(updated))
}

export function removeFromLocalCart(produkId: number) {
  const existing = getLocalCart()
  const updated = existing.filter((item) => item.produkId !== produkId)
  localStorage.setItem(CART_KEY, JSON.stringify(updated))
}

export function updateQtyInLocalCart(produkId: number, newQty: number) {
  const existing = getLocalCart()

  const updated = existing.map((item) => {
    if (item.produkId === produkId) {
      const newSubtotal = item.harga_satuan * newQty
      return {
        ...item,
        jumlah_pesanan: newQty,
        subtotal: newSubtotal,
        timestamp: Date.now(), // update waktu simpan
      }
    }
    return item
  })

  localStorage.setItem(CART_KEY, JSON.stringify(updated))
}

export function clearLocalCart() {
  localStorage.removeItem(CART_KEY)
}
