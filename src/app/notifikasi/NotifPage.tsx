'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'

type Notification = {
  id: number
  attributes: {
    title: string
    message: string
    time: string
  }
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    // Jika user tidak login, tidak fetch notifikasi
    if (!user?.id) return

   fetch(`https://spesialsayurdb-production.up.railway.app/api/notifikasis?populate=*&filters[$or][0][pengguna][id][$eq]=${user.id}&filters[$or][1][pengguna][id][$null]=true&sort=time:desc`)
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Gagal mengambil notifikasi:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-300">
      <Navbar />

      <div className="p-4">
        {loading ? (
          <p className="text-center text-gray-600">Memuat notifikasi...</p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-600">Belum ada notifikasi.</p>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 mb-3 rounded-lg shadow flex gap-3"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
              <div className="flex-1">
                <h2 className="font-semibold text-sm text-black">{item.attributes.title}</h2>
                <p className="text-gray-600 text-xs">{item.attributes.message}</p>
                <p className="text-gray-400 text-[11px] mt-1">{item.attributes.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
