'use client'

import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { useFanProfile } from '@/hooks/useFanProfile'
import { getBadge } from '@/lib/points'
import { FanBadge } from './FanBadge'

export function FanIdentityCard({
  clubs,
}: {
  clubs: { code: string; label: string; color: string }[]
}) {
  const { profile, tier, isWallet, verify, isVerifying, verifyError } =
    useFanProfile()
  const [selectedClub, setSelectedClub] = useState(clubs[0]?.code)

  const points = profile?.points ?? 0
  const streak = profile?.streak ?? 0
  const badgeIds = profile?.badgeIds ?? []
  const verifiedClubs = profile?.verifiedClubs ?? []

  const topBadgeId = badgeIds[badgeIds.length - 1]
  const topBadge = topBadgeId ? getBadge(topBadgeId) : undefined
  const selectedClubVerified = verifiedClubs.includes(selectedClub || '')

  return (
    <div className="side-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="eyebrow text-[var(--accent)]">FAN IDENTITY</p>
          <h2 className="text-[20px] font-bold tracking-[-0.03em] mt-1">
            {tier?.name || 'Rookie'}
          </h2>
        </div>

        <div className="text-right">
          <p className="text-[22px] font-black tabular-nums">{points}</p>
          <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--fg-tertiary)]">
            points
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center py-2">
        <FanBadge
          tier={topBadge?.tier || 'bronze'}
          label={topBadge?.name || 'No badge yet'}
          monogram={topBadge ? topBadge.name.slice(0, 2).toUpperCase() : '?'}
          locked={!topBadge}
          size={104}
        />
      </div>

      {streak > 1 && (
        <p className="text-center text-[12px] font-semibold text-[var(--orange)] mt-1">
          🔥 {streak}-matchday streak
        </p>
      )}

      {clubs.length > 0 && (
        <div className="mt-5 pt-4 border-t border-[var(--hairline)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--fg-tertiary)] mb-3">
            Club identity
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            {clubs.map((club) => (
              <FanBadge
                key={club.code}
                tier="gold"
                label={club.label}
                monogram={club.code}
                accentColor={club.color}
                locked={!verifiedClubs.includes(club.code)}
                size={72}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <select
              value={selectedClub}
              onChange={(event) => setSelectedClub(event.target.value)}
              className="flex-1 rounded-full border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-[12px] font-semibold outline-none"
            >
              {clubs.map((club) => (
                <option key={club.code} value={club.code}>
                  {club.label}
                </option>
              ))}
            </select>

            {selectedClubVerified ? (
              <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--accent)] shrink-0 px-3">
                <ShieldCheck className="w-4 h-4" />
                Verified
              </span>
            ) : (
              <button
                type="button"
                onClick={() => selectedClub && verify(selectedClub)}
                disabled={!isWallet || isVerifying || !selectedClub}
                className="btn-secondary shrink-0"
              >
                <ShieldCheck className="w-4 h-4" />
                {isVerifying ? 'Checking...' : 'Verify'}
              </button>
            )}
          </div>

          {!isWallet && (
            <p className="text-[11px] text-[var(--fg-tertiary)] mt-2">
              Connect a wallet to verify Fan Token ownership.
            </p>
          )}

          {verifyError && (
            <p className="text-[11px] text-red-500 mt-2">
              {(verifyError as Error).message}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
