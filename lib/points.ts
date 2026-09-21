import { getClub } from './clubs'

// Points economy and badge catalog for Arena fan identity/reputation.
//
// Design intent (from product direction): peer-validated actions (reactions
// a take earns from other fans) should count for more upside than
// self-reported ones, and recurring matchday participation (check-ins,
// streaks) should be worth more than one-off posting. Verified Fan Token
// holders earn a multiplier on everything they do inside a room for their
// club — the token amplifies participation, it doesn't gate it.

export type PointAction = 'post_take' | 'take_upvoted' | 'room_checkin'

export const BASE_POINTS: Record<PointAction, number> = {
  post_take: 2,
  take_upvoted: 1,
  room_checkin: 3,
}

// Applied on top of BASE_POINTS when the fan is a verified Fan Token
// holder of the club the action happened in.
export const VERIFIED_MULTIPLIER = 1.25

export type BadgeCategory = 'activity' | 'identity'
export type BadgeTier = 'bronze' | 'silver' | 'gold'

export type Badge = {
  id: string
  name: string
  description: string
  category: BadgeCategory
  tier: BadgeTier
  emoji: string
  club?: string
}

export const BADGE_CATALOG: Badge[] = [
  {
    id: 'first-blood',
    name: 'First Blood',
    description: 'Posted your first take in a rivalry room',
    category: 'activity',
    tier: 'bronze',
    emoji: '🩸',
  },
  {
    id: 'crowd-favorite',
    name: 'Crowd Favorite',
    description: 'One of your takes hit 25 reactions',
    category: 'activity',
    tier: 'silver',
    emoji: '⭐',
  },
  {
    id: 'derby-regular',
    name: 'Derby Regular',
    description: 'Checked into 3 matchday rooms',
    category: 'activity',
    tier: 'bronze',
    emoji: '🎟️',
  },
  {
    id: 'derby-veteran',
    name: 'Derby Veteran',
    description: 'Checked into 10 matchday rooms',
    category: 'activity',
    tier: 'silver',
    emoji: '🎖️',
  },
  {
    id: 'derby-legend',
    name: 'Derby Legend',
    description: 'Checked into 25 matchday rooms',
    category: 'activity',
    tier: 'gold',
    emoji: '🏆',
  },
  {
    id: 'on-fire',
    name: 'On Fire',
    description: '3-matchday attendance streak',
    category: 'activity',
    tier: 'bronze',
    emoji: '🔥',
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: '10-matchday attendance streak',
    category: 'activity',
    tier: 'gold',
    emoji: '⚡',
  },
]

export function clubIdentityBadge(club: string): Badge {
  const info = getClub(club)
  const nickname = info?.nickname ?? club

  return {
    id: `verified-${club.toLowerCase()}`,
    name: `Verified ${nickname}`,
    description: `Confirmed ${info?.name ?? club} Fan Token holder`,
    category: 'identity',
    tier: 'gold',
    emoji: info?.emoji ?? '🛡️',
    club,
  }
}

export function getBadge(id: string): Badge | undefined {
  if (id.startsWith('verified-')) {
    return clubIdentityBadge(id.replace('verified-', '').toUpperCase())
  }
  return BADGE_CATALOG.find((badge) => badge.id === id)
}

export type Tier = { name: string; min: number; next: number | null }

export const TIERS: Tier[] = [
  { name: 'Rookie', min: 0, next: 50 },
  { name: 'Regular', min: 50, next: 200 },
  { name: 'Ultra', min: 200, next: 500 },
  { name: 'Legend', min: 500, next: null },
]

export function tierForPoints(points: number): Tier {
  return [...TIERS].reverse().find((tier) => points >= tier.min) ?? TIERS[0]
}
