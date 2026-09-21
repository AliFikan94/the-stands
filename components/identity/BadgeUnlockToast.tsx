'use client'

import { useEffect } from 'react'
import type { Badge } from '@/lib/points'
import { FanBadge } from './FanBadge'

export function BadgeUnlockToast({
  badges,
  onDismiss,
}: {
  badges: Badge[]
  onDismiss: () => void
}) {
  useEffect(() => {
    if (badges.length === 0) return
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [badges, onDismiss])

  if (badges.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 pointer-events-none">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="side-card flex items-center gap-3 !py-3 !px-4 badge-toast-in"
        >
          <FanBadge
            tier={badge.tier}
            monogram={badge.name.slice(0, 2).toUpperCase()}
            emoji={badge.emoji}
            size={44}
          />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--accent)]">
              Badge unlocked
            </p>
            <p className="text-[13px] font-bold">{badge.name}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
