'use client'

import { CreditCard, QrCode, Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'

type PaymentMethodProps = {
  selected: string
  onChange: (method: string) => void
  redirectOnSelect?: boolean
  disabled?: boolean // Tambahan untuk readonly
}

export default function PaymentMethod({ selected, onChange, redirectOnSelect = false, disabled = false }: PaymentMethodProps) {
  const router = useRouter()

  const handleSelect = async (method: string) => {
    if (disabled) return // Cegah klik jika readonly

    onChange(method)
    localStorage.setItem('paymentMethod', method)

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user?.id && user?.jwt) {
      await fetch(`https://spesialsayurdb-production-b3b4.up.railway.app/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.jwt}`
        },
        body: JSON.stringify({ metode_pembayaran: method })
      })
    }

    if (redirectOnSelect) {
      router.push('/pembayaran')
    }
  }

  const baseStyle = 'border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-transform hover:scale-105'

  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      <button
        onClick={() => handleSelect('va')}
        className={`${baseStyle} ${selected === 'va' ? 'border-green-600 bg-green-50' : 'border-gray-300'} ${disabled ? 'cursor-default hover:scale-100' : ''}`}
        disabled={disabled}
      >
        <CreditCard className="text-green-600 mb-1" />
        <span className="text-sm">Virtual Account</span>
      </button>

      <button
        onClick={() => handleSelect('qris')}
        className={`${baseStyle} ${selected === 'qris' ? 'border-green-600 bg-green-50' : 'border-gray-300'} ${disabled ? 'cursor-default hover:scale-100' : ''}`}
        disabled={disabled}
      >
        <QrCode className="text-green-600 mb-1" />
        <span className="text-sm">QRIS</span>
      </button>

      <button
        onClick={() => handleSelect('cash')}
        className={`${baseStyle} ${selected === 'cash' ? 'border-green-600 bg-green-50' : 'border-gray-300'} ${disabled ? 'cursor-default hover:scale-100' : ''}`}
        disabled={disabled}
      >
        <Wallet className="text-green-600 mb-1" />
        <span className="text-sm">Tunai</span>
      </button>
    </div>
  )
}
