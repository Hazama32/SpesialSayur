const FAV_KEY = "local_fav_spesialsayur"

export type LocalFavoriteItem = {
  produkId: number
  timestamp: number
}

export function getLocalFavorites(): LocalFavoriteItem[] {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem(FAV_KEY)
  try {
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveToLocalFavorites(produkId: number) {
  const now = Date.now()
  const existing = getLocalFavorites()
  if (existing.some((item) => item.produkId === produkId)) return
  const updated = [...existing, { produkId, timestamp: now }]
  localStorage.setItem(FAV_KEY, JSON.stringify(updated))
}

export function removeFromLocalFavorites(produkId: number) {
  const existing = getLocalFavorites()
  const updated = existing.filter((item) => item.produkId !== produkId)
  localStorage.setItem(FAV_KEY, JSON.stringify(updated))
}

export function clearLocalFavorites() {
  localStorage.removeItem(FAV_KEY)
}
