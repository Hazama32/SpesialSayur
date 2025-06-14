'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

type Alamat = {
  id: number
  attributes: {
    nama_penerima: string
    nomor_hp: string
    alamat_lengkap: string
    catatan?: string
  }
}

export default function AlamatPage() {
  const [alamatList, setAlamatList] = useState<Alamat[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchAlamat = async () => {
      try {
        const token = localStorage.getItem('token')
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const userId = user?.id

        if (!token || !userId) {
          alert('Kamu belum login.')
          router.push('/login')
          return
        }

        const res = await axios.get(
          `https://spesialsayurdb-production.up.railway.app/api/alamats?filters[user][id][$eq]=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setAlamatList(res.data.data)
      } catch (err) {
        console.error('Gagal mengambil data alamat:', err)
        alert('Gagal mengambil data alamat.')
      } finally {
        setLoading(false)
      }
    }

    fetchAlamat()
  }, [router])

  if (loading) {
    return <p className="p-4">Memuat alamat...</p>
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">📍 Alamat Saya</h1>

      {alamatList.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">Belum ada alamat tersimpan.</div>
      ) : (
        <ul className="space-y-4">
          {alamatList.map((item) => (
            <li key={item.id} className="bg-white rounded-lg shadow p-4">
              <p className="font-semibold text-lg">{item.attributes.nama_penerima}</p>
              <p className="text-sm text-gray-600">{item.attributes.nomor_hp}</p>
              <p className="text-sm">{item.attributes.alamat_lengkap}</p>
              {item.attributes.catatan && (
                <p className="text-sm text-gray-500 italic">
                  Catatan: {item.attributes.catatan}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <button className="bg-green-600 mt-6 text-white px-4 py-2 rounded-lg shadow w-full">
        Tambah Alamat Baru
      </button>
    </div>
  )
}
