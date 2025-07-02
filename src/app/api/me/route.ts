import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const jwt = cookies().get('jwt')?.value

  if (!jwt) {
    return NextResponse.json({ error: 'Unauthorized: JWT tidak ditemukan.' }, { status: 401 })
  }

  const res = await fetch(
    'https://spesialsayurdb-production.up.railway.app/api/users/me',
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  )

  if (!res.ok) {
    console.error('Failed to fetch /users/me:', await res.text())
    return NextResponse.json({ error: 'Failed to fetch user data.' }, { status: 500 })
  }

  const user = await res.json()
  return NextResponse.json(user)
}