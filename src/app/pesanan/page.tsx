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
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">📦 Daftar Pesanan</h1>
      {pesanans.map((item: any) => (
        <div key={item.id} className="border p-2 mb-2 rounded">
          <p>Produk: {item.attributes.produk.data.attributes.nama}</p>
          <p>Status: {item.attributes.status}</p>
          <p>Total: Rp {item.attributes.totalHarga}</p>
        </div>
      ))}
    </div>
  )
}
