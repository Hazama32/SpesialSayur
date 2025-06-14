'use client'
import { useEffect, useState } from "react"

export default function HistoryPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("token")

    const fetchHistory = async () => {
      const res = await fetch("https://spesialsayurdb-production.up.railway.app/api/pesanans?sort=createdAt:desc&populate=*", {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      setOrders(data.data || [])
    }

    fetchHistory()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Riwayat Pesanan</h1>
      {orders.length === 0 ? (
        <p>Belum ada pesanan.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order: any, i) => (
            <li key={i} className="border p-3 rounded shadow-sm">
              <div className="font-semibold">Pesanan #{order.id}</div>
              <div className="text-sm text-gray-600">Status: {order.attributes.status}</div>
              <div className="text-sm text-gray-600 mt-1">Total: Rp {order.attributes.total_harga?.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Metode: {order.attributes.metode_pembayaran}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
