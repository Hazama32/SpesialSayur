'use client'

import { CreditCard, Wallet } from 'lucide-react'
import { useState } from 'react'

type PaymentMethod = 'card' | 'cash'

export default function PaymentMethods({
  selected,
  onChange,
}: {
  selected: PaymentMethod
  onChange: (method: PaymentMethod) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <button
        onClick={() => onChange('card')}
        className={`border rounded-lg p-4 flex flex-col items-center ${
          selected === 'card' ? 'border-green-600 bg-green-50' : 'border-gray-300'
        }`}
      >
        <CreditCard className="text-green-600 mb-2" />
        <span className="text-sm text-center">Kartu Debit<br />atau Kredit</span>
      </button>

      <button
        onClick={() => onChange('cash')}
        className={`border rounded-lg p-4 flex flex-col items-center ${
          selected === 'cash' ? 'border-green-600 bg-green-50' : 'border-gray-300'
        }`}
      >
        <Wallet className="text-green-600 mb-2" />
        <span className="text-sm">Tunai</span>
      </button>
    </div>
  )
}
