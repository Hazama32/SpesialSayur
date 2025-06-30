"use client"

import { useEffect, useState } from "react"

type LocationPopupProps = {
  onConfirm: (alamat: string) => void
  onClose: () => void
}

export default function LocationPopup({ onConfirm, onClose }: LocationPopupProps) {
  const [loading, setLoading] = useState(false)
  const [alamat, setAlamat] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    // Otomatis ambil lokasi saat popup terbuka
    handleAmbilLokasi()
  }, [])

  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(`/api/reverse?lat=${latitude}&lon=${longitude}`)
      const data = await response.json()

      if (!data.display_name) {
        setError("Gagal mendapatkan alamat.")
        return
      }

      setAlamat(data.display_name)
    } catch (err) {
      console.error("Fetch gagal:", err)
      setError("Gagal mengambil alamat.")
    }
  }

  const handleAmbilLokasi = () => {
    setLoading(true)
    setError("")

    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung browser.")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        await fetchAddress(latitude, longitude)
        setLoading(false)
      },
      (err) => {
        setError("Gagal mengambil lokasi. Aktifkan GPS.")
        setLoading(false)
      }
    )
  }

  const handleConfirm = () => {
    if (alamat) {
      onConfirm(alamat)
      onClose() // ✅ langsung tutup popup setelah dipakai
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-80 space-y-4">
        <h2 className="text-lg font-bold text-center">Ambil Lokasi Terkini</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {alamat ? (
          <div className="space-y-2">
            <p className="text-sm">Apakah alamat berikut sudah benar?</p>
            <p className="text-green-600 text-sm font-medium">{alamat}</p>
            <button
              className="bg-green-500 w-full text-white py-2 rounded"
              onClick={handleConfirm}
            >
              Gunakan Alamat Ini
            </button>
            <button
              className="bg-gray-300 w-full text-black py-2 rounded"
              onClick={handleAmbilLokasi}
            >
              Ambil Ulang
            </button>
          </div>
        ) : (
          <button
            className="bg-blue-500 w-full text-white py-2 rounded"
            onClick={handleAmbilLokasi}
            disabled={loading}
          >
            {loading ? "Mengambil lokasi..." : "Ambil Lokasi Sekarang"}
          </button>
        )}

        <button className="w-full mt-2 text-red-500" onClick={onClose}>
          Batal
        </button>
      </div>
    </div>
  )
}
