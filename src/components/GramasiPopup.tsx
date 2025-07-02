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
    <div className="absolute top-full left-0 w-full bg-white border rounded shadow p-2 z-50">
      <div className="flex flex-wrap gap-2">
        {options.map((g) => (
          <button
            key={g}
            onClick={() => onSelectGram(g)}
            className={`border px-3 py-1 rounded ${
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