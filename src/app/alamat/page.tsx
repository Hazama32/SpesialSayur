'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import HeaderSection from '@/components/HeaderSection'

export default function AddressPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: number, jwt: string } | null>(null)
  const [alamat, setAlamat] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      alert('Kamu belum login.')
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Ambil data alamat user dari Strapi
    fetch(`https://spesialsayurdb-production.up.railway.app/api/users/${parsedUser.id}`, {
      headers: {
        Authorization: `Bearer ${parsedUser.jwt}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAlamat(data.alamat_pengiriman || '')
        setLoading(false)
      })
      .catch((err) => {
        console.error('Gagal fetch alamat:', err)
        setLoading(false)
      })
  }, [router])

  const handleSave = async () => {
    if (!user) return

    try {
      const res = await fetch(`https://spesialsayurdb-production.up.railway.app/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.jwt}`,
        },
        body: JSON.stringify({
          alamat_pengiriman: alamat,
        }),
      })

      if (res.ok) {
        alert('Alamat berhasil diperbarui!')
      } else {
        alert('Gagal memperbarui alamat.')
      }
    } catch (err) {
      console.error('Error saat update:', err)
      alert('Gagal koneksi ke server.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-300">
      <HeaderSection title="Alamat Pengiriman" />

      <div className="p-4">
        {loading ? (
          <p className="text-center">Memuat alamat...</p>
        ) : (
          <>
            <textarea
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full h-40 p-2 rounded"
              placeholder="Masukkan alamat pengiriman kamu"
            ></textarea>

            <button
              onClick={handleSave}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded"
            >
              Simpan Alamat
            </button>
          </>
        )}
      </div>
    </div>
  )
}
