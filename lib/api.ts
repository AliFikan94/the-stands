// Thin client-side fetch wrappers around the points/fan/leaderboard API routes.

import type { FanProfile, LeaderboardEntry } from './store'
import type { Badge, Tier } from './points'

export type ProfileResponse = { profile: FanProfile; tier: Tier }
export type PointsResponse = {
  profile: FanProfile
  newBadges: Badge[]
  alreadyCheckedIn?: boolean
}
export type VerifyResponse = {
  verified: boolean
  balance: number
  profile: FanProfile
  newBadges: Badge[]
}

export async function fetchFanProfile(id: string): Promise<ProfileResponse> {
  const res = await fetch(`/api/fan?id=${encodeURIComponent(id)}`)
  if (!res.ok) throw new Error('Failed to load fan profile')
  return res.json()
}

export async function fetchLeaderboard(
  club?: string
): Promise<LeaderboardEntry[]> {
  const query = club ? `?club=${encodeURIComponent(club)}` : ''
  const res = await fetch(`/api/leaderboard${query}`)
  if (!res.ok) throw new Error('Failed to load leaderboard')
  const data = await res.json()
  return data.entries
}

async function postPointsAction(
  type: 'post' | 'upvote' | 'checkin',
  id: string,
  clubs?: string[]
): Promise<PointsResponse> {
  const res = await fetch('/api/points', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, id, clubs }),
  })
  if (!res.ok) throw new Error(`Failed to record ${type}`)
  return res.json()
}

export const recordPost = (id: string, clubs?: string[]) =>
  postPointsAction('post', id, clubs)

export const recordUpvote = (authorId: string, clubs?: string[]) =>
  postPointsAction('upvote', authorId, clubs)

export const recordCheckIn = (id: string, clubs?: string[]) =>
  postPointsAction('checkin', id, clubs)

export async function verifyFanToken(
  id: string,
  address: string,
  club: string
): Promise<VerifyResponse> {
  const res = await fetch('/api/fan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, address, club }),
  })
  if (!res.ok) throw new Error('Failed to verify Fan Token')
  return res.json()
}
