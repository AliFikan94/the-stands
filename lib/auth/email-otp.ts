import { kv } from '@/lib/kv'

const OTP_TTL_SECONDS = 10 * 60 // 10 minutes
const RESEND_COOLDOWN_SECONDS = 30

function otpKey(email: string) {
  return `email-otp:${email}`
}

function cooldownKey(email: string) {
  return `email-otp-cooldown:${email}`
}

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Issues a one-time code for an email sign-in attempt. Sends it via Resend
 * when RESEND_API_KEY is configured; otherwise logs it to the server
 * console so email sign-in is still testable locally without a real
 * provider. devCode is only returned (never just logged) when there's no
 * provider configured, so a real deployment never leaks the code outside
 * the email itself.
 */
export async function requestEmailOtp(
  rawEmail: string
): Promise<{ ok: true; devCode?: string } | { ok: false; reason: string }> {
  const email = normalizeEmail(rawEmail)

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, reason: 'Enter a valid email address.' }
  }

  const onCooldown = await kv.get<boolean>(cooldownKey(email))
  if (onCooldown) {
    return { ok: false, reason: 'Wait a moment before requesting another code.' }
  }

  const code = generateCode()
  await kv.set(otpKey(email), code, OTP_TTL_SECONDS)
  await kv.set(cooldownKey(email), true, RESEND_COOLDOWN_SECONDS)

  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log(`[email-otp] (no RESEND_API_KEY set) code for ${email}: ${code}`)
    return { ok: true, devCode: code }
  }

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'TheStands <onboarding@resend.dev>',
    to: email,
    subject: `${code} is your TheStands sign-in code`,
    text: `Your sign-in code is ${code}. It expires in 10 minutes.`,
  })

  return { ok: true }
}

/** Single-use: a correct code is consumed immediately so it can't be replayed. */
export async function consumeEmailOtp(
  rawEmail: string,
  code: string
): Promise<boolean> {
  const email = normalizeEmail(rawEmail)
  const stored = await kv.get<string>(otpKey(email))

  if (!stored || stored !== code.trim()) return false

  await kv.del(otpKey(email))
  return true
}
