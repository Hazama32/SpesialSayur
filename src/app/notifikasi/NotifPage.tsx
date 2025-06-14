'use client'
import HeaderSection from "@/components/HeaderSection"

export default function NotificationPage() {

  const notifications = [
    {
      id: 1,
      title: 'Pesanan Dikirim',
      message: 'Pesanan #1234 sedang dalam perjalanan ke lokasi Anda.',
      time: '2 jam lalu',
    },
    {
      id: 2,
      title: 'Promo Spesial',
      message: 'Dapatkan diskon 10% untuk semua buah hari ini!',
      time: '5 jam lalu',
    },
    {
      id: 3,
      title: 'Poin Bertambah',
      message: 'Kamu mendapatkan 50 poin dari transaksi kemarin.',
      time: 'Kemarin',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-300">
      <HeaderSection title="Notifikasi" toHome={false} />
      {/* Isi Notifikasi */}
      <div className="p-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 mb-3 rounded-lg shadow flex gap-3"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
            <div className="flex-1">
              <h2 className="font-semibold text-sm text-black">{item.title}</h2>
              <p className="text-gray-600 text-xs">{item.message}</p>
              <p className="text-gray-400 text-[11px] mt-1">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
