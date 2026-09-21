import { NextRequest, NextResponse } from 'next/server'
import { getLeaderboard } from '@/lib/store'

export async function GET(request: NextRequest) {
  const club = request.nextUrl.searchParams.get('club') || undefined
  const entries = await getLeaderboard(club)

  return NextResponse.json({ entries })
}
