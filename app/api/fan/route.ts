import { NextRequest, NextResponse } from 'next/server'
import { getFan, verifyClub } from '@/lib/store'
import { tierForPoints } from '@/lib/points'

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const profile = await getFan(id)

  return NextResponse.json({
    profile,
    tier: tierForPoints(profile.points),
  })
}

type Body = {
  id?: string
  address?: string
  club?: string
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Body

  if (!body.id || !body.address || !body.club) {
    return NextResponse.json(
      { error: 'Missing id, address, or club' },
      { status: 400 }
    )
  }

  const result = await verifyClub(body.id, body.address, body.club)

  return NextResponse.json(result)
}
