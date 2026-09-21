'use client'

import { useState } from 'react'
import { Trophy } from 'lucide-react'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { formatFanId } from '@/lib/utils'
import { useFanId } from '@/hooks/useFanId'

export function Leaderboard({
  clubs = [],
}: {
  clubs?: { code: string; label: string }[]
}) {
  const [scope, setScope] = useState<string | undefined>(undefined)
  const { entries, isLoading } = useLeaderboard(scope)
  const { id: currentId } = useFanId()

  const tabs = [{ code: undefined, label: 'Global' }, ...clubs]

  return (
    <div className="side-card">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4 text-[var(--orange)]" />
        <p className="eyebrow">Leaderboard</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setScope(tab.code)}
            className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-all duration-150 [transition-timing-function:var(--ease-apple)] active:scale-95 ${
              scope === tab.code
                ? 'border-[var(--fg)] bg-[var(--fg)] text-white'
                : 'border-[var(--hairline)] bg-white hover:border-[var(--fg-tertiary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-[12px] text-[var(--fg-tertiary)]">Loading...</p>
      ) : entries.length === 0 ? (
        <p className="text-[12px] text-[var(--fg-tertiary)]">
          No fans on the board yet. Be the first to check in.
        </p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <div key={entry.id} className="flex items-center gap-3">
              <span className="text-[11px] font-black text-[var(--fg-tertiary)] w-4 shrink-0">
                {index + 1}
              </span>

              <div className="w-8 h-8 rounded-full bg-[var(--fg)] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                {entry.id.slice(0, 2).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold truncate">
                  {formatFanId(entry.id)}
                  {entry.id === currentId && (
                    <span className="text-[var(--accent)]"> · you</span>
                  )}
                </p>
                <p className="text-[10px] text-[var(--fg-tertiary)]">
                  {entry.tier}
                </p>
              </div>

              <span className="text-[12px] font-bold tabular-nums shrink-0">
                {entry.points}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
