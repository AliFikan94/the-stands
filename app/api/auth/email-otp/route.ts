import { NextRequest, NextResponse } from 'next/server'
import { requestEmailOtp } from '@/lib/auth/email-otp'

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string }

  if (!body.email || typeof body.email !== 'string') {
    return NextResponse.json({ ok: false, reason: 'Missing email' }, { status: 400 })
  }

  const result = await requestEmailOtp(body.email)

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 })
  }

  return NextResponse.json(result)
}
