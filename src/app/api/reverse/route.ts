// src/app/api/reverse/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')

    if (!lat || !lon) {
      return NextResponse.json({ error: 'Latitude dan longitude dibutuhkan' }, { status: 400 })
    }

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`

    const res = await fetch(url, {
      headers: { 'User-Agent': 'Next.js Proxy' }, // Ini penting untuk Nominatim
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Gagal fetch data dari Nominatim' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
