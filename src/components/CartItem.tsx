'use client'

type CartItemProps = {
  item: {
    id: number
    attributes: {
      nama: string
      harga: number
      gambar: {
        data: {
          attributes: {
            url: string
          }
        }
      }
    }
    qty: number
  }
  onIncrement: () => void
  onDecrement: () => void
  onRemove: () => void
}

export default function CartItem({ item, onIncrement, onDecrement, onRemove }: CartItemProps) {
  const imageUrl = item.attributes.gambar?.data?.attributes?.url
    ? `https://spesialsayurdb-production-b3b4.up.railway.app${item.attributes.gambar.data.attributes.url}`
    : '/noimage.png'

  return (
    <div className="flex items-center gap-4 border-b pb-3 mb-3">
      <img src={imageUrl} alt={item.attributes.nama} className="w-16 h-16 object-cover rounded" />
      <div className="flex-1">
        <div className="font-semibold">{item.attributes.nama}</div>
        <div className="text-sm text-gray-500">Rp {item.attributes.harga} x {item.qty}</div>
        <div className="flex items-center gap-2 mt-2">
          <button onClick={onDecrement} className="px-2 bg-gray-200 rounded">−</button>
          <span>{item.qty}</span>
          <button onClick={onIncrement} className="px-2 bg-gray-200 rounded">+</button>
          <button onClick={onRemove} className="ml-4 text-red-500 text-sm">🗑️ Hapus</button>
        </div>
      </div>
    </div>
  )
}
