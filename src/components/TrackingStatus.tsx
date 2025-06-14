'use client'
import { useEffect, useState } from 'react'

export default function TrackingStatus() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) return

    fetch('https://spesialsayurdb-production.up.railway.app/api/pesanans?sort=createdAt:desc&pagination[limit]=1', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const latest = data?.data?.[0]
        setStatus(latest?.attributes?.status || 'Belum ada pesanan')
        setLoading(false)
      })
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Status Pengiriman</h2>
      {loading ? <p>Memuat...</p> : <p>Status: <strong>{status}</strong></p>}
    </div>
  )
}
