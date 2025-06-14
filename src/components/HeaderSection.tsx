'use client'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

type HeaderSectionProps = {
  title: string
  toHome?: boolean
}

export default function HeaderSection({ title, toHome = true }: HeaderSectionProps) {
  const router = useRouter()

  const handleBack = () => {
    toHome ? router.push('/') : router.back()
  }

  return (
    <div className="bg-green-600 text-white px-4 py-4 flex items-center gap-4 rounded-b-xl">
      <button onClick={handleBack} className="text-xl">
       <ArrowLeft className="mr-2" />
      </button>
      <h1 className="text-lg font-bold">{title}</h1>
    </div>
  )
}
