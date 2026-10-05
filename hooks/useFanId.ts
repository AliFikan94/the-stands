'use client'

import { useSyncExternalStore } from 'react'
import { useAccount } from 'wagmi'
import { useSession } from 'next-auth/react'

const ANON_ID_KEY = 'thestands:anon-id'

function getOrCreateAnonId(): string {
  const existing = localStorage.getItem(ANON_ID_KEY)
  if (existing) return existing

  const created = `anon-${crypto.randomUUID().slice(0, 8)}`
  localStorage.setItem(ANON_ID_KEY, created)
  return created
}

// No-op subscription: the anon id never changes after creation within a
// session, so there's nothing external to react to once mounted.
function subscribe() {
  return () => {}
}

function getServerSnapshot() {
  return null
}

/**
 * Resolves the current fan's identity for points/leaderboard purposes, in
 * priority order: a real signed-in session (wallet/email/X via Auth.js —
 * this is the one that's stable across devices and browsers), then a
 * merely-connected wallet address (connected via wagmi but never signed a
 * SIWE message), then a stable per-browser anonymous id, so participation
 * still counts before a fan signs in at all.
 *
 * Uses useSyncExternalStore rather than an effect+setState so reading
 * localStorage (client-only) doesn't cause a hydration mismatch.
 */
export function useFanId() {
  const { data: session } = useSession()
  const { address } = useAccount()
  const anonId = useSyncExternalStore(
    subscribe,
    getOrCreateAnonId,
    getServerSnapshot
  )

  const id = session?.user?.id || address || anonId

  return {
    id,
    address,
    isWallet: Boolean(address),
    isSignedIn: Boolean(session?.user),
  }
}
