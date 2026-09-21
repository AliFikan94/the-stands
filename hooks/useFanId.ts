'use client'

import { useSyncExternalStore } from 'react'
import { useAccount } from 'wagmi'

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
 * Resolves the current fan's identity for points/leaderboard purposes:
 * the connected wallet address when available, otherwise a stable
 * per-browser anonymous id (so participation still counts before a fan
 * connects a wallet). Club-identity badges still require a real address.
 *
 * Uses useSyncExternalStore rather than an effect+setState so reading
 * localStorage (client-only) doesn't cause a hydration mismatch.
 */
export function useFanId() {
  const { address } = useAccount()
  const anonId = useSyncExternalStore(
    subscribe,
    getOrCreateAnonId,
    getServerSnapshot
  )

  const id = address || anonId

  return { id, address, isWallet: Boolean(address) }
}
