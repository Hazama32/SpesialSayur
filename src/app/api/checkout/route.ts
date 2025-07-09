import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const jwt = cookies().get('jwt')?.value

  if (!jwt) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  console.log('✅ Forwarding body:', body)

  const res = await fetch(
    'https://spesialsayurdb-production-b3b4.up.railway.app/api/pesanans',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  )

  const data = await res.json()
  console.log('✅ Strapi Response:', data)

  if (!res.ok) {
    return NextResponse.json({ error: 'Gagal kirim pesanan.', detail: data }, { status: 500 })
  }

  return NextResponse.json(data)
}