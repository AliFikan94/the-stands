import type { ComponentType } from 'react'
import { getClub } from '@/lib/clubs'
import { LiverBird } from './crests/LiverBird'

type CrestProps = { size?: number; className?: string; variant?: 'mono' | 'tone' }

// Custom vector crests, keyed by club code. Anything not listed here falls
// back to its plain emoji from lib/clubs.ts. Add more as artwork shows up —
// this is the one place a club's visual identity is resolved, so every
// avatar circle, badge, and inline ticker tag picks it up automatically.
const CUSTOM_CRESTS: Partial<Record<string, ComponentType<CrestProps>>> = {
  LIV: LiverBird,
}

export function hasCustomCrest(code: string): boolean {
  return Boolean(CUSTOM_CRESTS[code])
}

// Whether we have any real visual identity for this code (crest or emoji).
// Callers that already show the code as text alongside the glyph (e.g. a
// "$CODE" ticker pill) should check this first, so an unrecognized code
// (a club outside our directory) doesn't render as a redundant duplicate
// of that same text rather than a useful icon.
export function hasGlyph(code: string): boolean {
  return Boolean(CUSTOM_CRESTS[code]) || Boolean(getClub(code))
}

export function ClubGlyph({
  code,
  size = 20,
  className,
  variant = 'mono',
}: {
  code: string
  size?: number
  className?: string
  variant?: 'mono' | 'tone'
}) {
  const Crest = CUSTOM_CRESTS[code]

  if (Crest) {
    return <Crest size={size} className={className} variant={variant} />
  }

  const emoji = getClub(code)?.emoji ?? code

  return (
    <span style={{ fontSize: size, lineHeight: 1 }} className={className}>
      {emoji}
    </span>
  )
}
