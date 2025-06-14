import HeaderSection from '@/components/HeaderSection'
export const metadata = {
  title: 'Pesanan | SpesialSayur',
}

export default async function PesananPage() {
  const res = await fetch('https://spesialsayurdb-production.up.railway.app/api/pesanans?populate=produk', {
    cache: 'no-store',
  })
  const json = await res.json()

  const pesanans = json.data

  return (
    <div className="min-h-screen bg-gray-300">
      <HeaderSection title="Daftar Pesanan" toHome={false} />
        {pesanans && pesanans.length > 0 ? (
          pesanans.map((item: any) => (
        <div key={item.id} className="border p-2 mb-2 rounded">
          <p>Produk: {item.attributes.produk.data.attributes.nama}</p>
          <p>Status: {item.attributes.status}</p>
        </div>
      ))
    ) : (
  <p className="text-center text-gray-500">Belum ada pesanan.</p>
)}
    </div>
  )
}
