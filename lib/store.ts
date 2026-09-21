import { kv } from './kv'
import {
  BASE_POINTS,
  VERIFIED_MULTIPLIER,
  getBadge,
  tierForPoints,
  type Badge,
} from './points'
import { simulateFanTokenBalance } from './fanToken'

export type FanProfile = {
  id: string
  points: number
  posts: number
  reactionsReceived: number
  checkIns: number
  streak: number
  lastCheckIn: string | null
  badgeIds: string[]
  verifiedClubs: string[]
}

function emptyProfile(id: string): FanProfile {
  return {
    id,
    points: 0,
    posts: 0,
    reactionsReceived: 0,
    checkIns: 0,
    streak: 0,
    lastCheckIn: null,
    badgeIds: [],
    verifiedClubs: [],
  }
}

function fanKey(id: string) {
  return `fan:${id}`
}

async function getIndex(): Promise<string[]> {
  return (await kv.get<string[]>('fan:index')) || []
}

async function addToIndex(id: string) {
  const index = await getIndex()

  if (!index.includes(id)) {
    index.push(id)
    await kv.set('fan:index', index)
  }
}

export async function getFan(id: string): Promise<FanProfile> {
  const profile = await kv.get<FanProfile>(fanKey(id))
  return profile || emptyProfile(id)
}

async function saveFan(profile: FanProfile) {
  await kv.set(fanKey(profile.id), profile)
  await addToIndex(profile.id)
}

function unlock(profile: FanProfile, badgeId: string): Badge | null {
  if (profile.badgeIds.includes(badgeId)) return null

  profile.badgeIds.push(badgeId)

  return getBadge(badgeId) ?? null
}

function pointsFor(action: keyof typeof BASE_POINTS, verified: boolean) {
  const base = BASE_POINTS[action]
  return verified ? Math.round(base * VERIFIED_MULTIPLIER) : base
}

// A fixture has two clubs; the multiplier applies if the fan is verified
// for either one.
function isVerifiedForFixture(profile: FanProfile, clubs?: string[]) {
  return Boolean(clubs?.some((club) => profile.verifiedClubs.includes(club)))
}

export async function recordPost(id: string, clubs?: string[]) {
  const profile = await getFan(id)
  const verified = isVerifiedForFixture(profile, clubs)

  profile.posts += 1
  profile.points += pointsFor('post_take', verified)

  const newBadges: Badge[] = []

  if (profile.posts === 1) {
    const badge = unlock(profile, 'first-blood')
    if (badge) newBadges.push(badge)
  }

  await saveFan(profile)
  return { profile, newBadges }
}

export async function recordUpvoteReceived(authorId: string, clubs?: string[]) {
  const profile = await getFan(authorId)
  const verified = isVerifiedForFixture(profile, clubs)

  profile.reactionsReceived += 1
  profile.points += pointsFor('take_upvoted', verified)

  const newBadges: Badge[] = []

  if (profile.reactionsReceived === 25) {
    const badge = unlock(profile, 'crowd-favorite')
    if (badge) newBadges.push(badge)
  }

  await saveFan(profile)
  return { profile, newBadges }
}

const DAY_MS = 24 * 60 * 60 * 1000

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

export async function recordCheckIn(id: string, clubs?: string[]) {
  const profile = await getFan(id)
  const today = dateKey(new Date())

  if (profile.lastCheckIn === today) {
    return { profile, newBadges: [], alreadyCheckedIn: true }
  }

  const yesterday = dateKey(new Date(Date.now() - DAY_MS))
  profile.streak = profile.lastCheckIn === yesterday ? profile.streak + 1 : 1
  profile.lastCheckIn = today
  profile.checkIns += 1

  const verified = isVerifiedForFixture(profile, clubs)
  profile.points += pointsFor('room_checkin', verified)

  const newBadges: Badge[] = []
  const checkInMilestone: Record<number, string> = {
    3: 'derby-regular',
    10: 'derby-veteran',
    25: 'derby-legend',
  }
  const streakMilestone: Record<number, string> = {
    3: 'on-fire',
    10: 'unstoppable',
  }

  const checkInBadgeId = checkInMilestone[profile.checkIns]
  if (checkInBadgeId) {
    const badge = unlock(profile, checkInBadgeId)
    if (badge) newBadges.push(badge)
  }

  const streakBadgeId = streakMilestone[profile.streak]
  if (streakBadgeId) {
    const badge = unlock(profile, streakBadgeId)
    if (badge) newBadges.push(badge)
  }

  await saveFan(profile)
  return { profile, newBadges, alreadyCheckedIn: false }
}

export async function verifyClub(id: string, address: string, club: string) {
  const profile = await getFan(id)
  const balance = simulateFanTokenBalance(address, club)
  const verified = balance >= 100

  const newBadges: Badge[] = []

  if (verified && !profile.verifiedClubs.includes(club)) {
    profile.verifiedClubs.push(club)
    const badge = unlock(profile, `verified-${club.toLowerCase()}`)
    if (badge) newBadges.push(badge)
    await saveFan(profile)
  }

  return { verified, balance, profile, newBadges }
}

export type LeaderboardEntry = {
  id: string
  points: number
  tier: string
  badgeIds: string[]
  verifiedClubs: string[]
}

export async function getLeaderboard(
  club?: string,
  limit = 20
): Promise<LeaderboardEntry[]> {
  const index = await getIndex()
  const profiles = await Promise.all(index.map((id) => getFan(id)))

  const filtered = club
    ? profiles.filter((profile) => profile.verifiedClubs.includes(club))
    : profiles

  return filtered
    .sort((a, b) => b.points - a.points)
    .slice(0, limit)
    .map((profile) => ({
      id: profile.id,
      points: profile.points,
      tier: tierForPoints(profile.points).name,
      badgeIds: profile.badgeIds,
      verifiedClubs: profile.verifiedClubs,
    }))
}
