import { NextRequest, NextResponse } from 'next/server'
import { recordPost, recordUpvoteReceived, recordCheckIn } from '@/lib/store'

type Body = {
  type: 'post' | 'upvote' | 'checkin'
  id?: string
  clubs?: string[]
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Body

  if (!body.id || typeof body.id !== 'string') {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  switch (body.type) {
    case 'post':
      return NextResponse.json(await recordPost(body.id, body.clubs))
    case 'upvote':
      return NextResponse.json(
        await recordUpvoteReceived(body.id, body.clubs)
      )
    case 'checkin':
      return NextResponse.json(await recordCheckIn(body.id, body.clubs))
    default:
      return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
  }
}
