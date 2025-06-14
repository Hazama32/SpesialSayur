'use client'

import { useState } from 'react'

type CheckoutFormProps = {
  total: number
  onSubmit: (alamat: string, metode: string) => void
}

export default function CheckoutForm({ total, onSubmit }: CheckoutFormProps) {
  const [alamat, setAlamat] = useState('')
  const [metode, setMetode] = useState('tunai')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(alamat, metode)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Checkout</h2>

      <textarea
        className="w-full p-2 border rounded"
        placeholder="Alamat pengiriman"
        value={alamat}
        onChange={(e) => setAlamat(e.target.value)}
        required
      />

      <select
        className="w-full p-2 border rounded"
        value={metode}
        onChange={(e) => setMetode(e.target.value)}
      >
        <option value="tunai">Tunai</option>
        <option value="va">Virtual Account</option>
      </select>

      <div className="text-lg font-bold">Total: Rp {total.toLocaleString()}</div>

      <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
        Bayar Sekarang
      </button>
    </form>
  )
}
