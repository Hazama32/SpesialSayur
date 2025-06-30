'use client'

type GramasiPopupProps = {
  selectedGram: number
  onSelectGram: (gram: number) => void
}

export default function GramasiPopup({
  selectedGram,
  onSelectGram,
}: GramasiPopupProps) {
  const options = [250, 500, 750, 1000]

  return (
    <div className="w-full mt-2 bg-white rounded-br-xl rounded-bl-xl px-12 pb-4">
      <div className="grid grid-cols-4 gap-2">
        {options.map((g) => (
          <button
            key={g}
            onClick={() => onSelectGram(g)}
            className={`border px-3 py-1 rounded text-sm w-full ${
              selectedGram === g
                ? 'bg-green-500 text-white'
                : 'bg-white text-green-700'
            }`}
          >
            {g >= 1000 ? `${g / 1000} kg` : `${g} gr`}
          </button>
        ))}
      </div>
    </div>
  )
}
