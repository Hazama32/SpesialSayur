
import './globals.css'
import type { Metadata } from 'next'
import HeaderSection from '@/components/HeaderSection'

export const metadata: Metadata = {
  title: 'Beranda | SpesialSayur',
  description: 'Belanja sayur dan buah segar dari petani lokal.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  )
}
