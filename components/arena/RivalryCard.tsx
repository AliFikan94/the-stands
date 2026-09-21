'use client'

import { Flame, MessageCircle, Users, ArrowRight } from 'lucide-react'
import type { Rivalry } from '@/lib/rivalries'
import { getClub } from '@/lib/clubs'

export type { Rivalry }

type RivalryCardProps = {
  rivalry: Rivalry
  onEnter: (rivalry: Rivalry) => void
}

export function RivalryCard({
  rivalry,
  onEnter,
}: RivalryCardProps) {
  return (
    <button
      type="button"
      onClick={() => onEnter(rivalry)}
      className="group w-full text-left rounded-[22px] border border-[var(--hairline)] bg-[var(--bg-elevated)] p-5 transition-all duration-200 [transition-timing-function:var(--ease-apple)] hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(16,19,17,0.08)] active:scale-[0.99] active:duration-100"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-11 h-11 rounded-full bg-[#101311] text-white flex items-center justify-center text-[17px] border-2 border-white">
              {getClub(rivalry.homeShort)?.emoji ?? rivalry.homeShort}
            </div>

            <div className="w-11 h-11 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-[17px] border-2 border-white">
              {getClub(rivalry.awayShort)?.emoji ?? rivalry.awayShort}
            </div>
          </div>

          <div>
            <p className="text-[14px] font-bold">
              {rivalry.home}
            </p>

            <p className="text-[12px] text-[var(--fg-secondary)]">
              vs {rivalry.away}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold text-[var(--orange)]">
          <Flame className="w-3.5 h-3.5" />
          {rivalry.heat}%
        </div>
      </div>

      <p className="mt-5 text-[14px] leading-[1.5] text-[var(--fg-secondary)]">
        {rivalry.description}
      </p>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-[var(--hairline)]">
        <div className="flex items-center gap-4 text-[11px] font-semibold text-[var(--fg-tertiary)]">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {rivalry.members.toLocaleString()}
          </span>

          <span className="flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5" />
            {rivalry.messages}
          </span>
        </div>

        <span className="flex items-center gap-1 text-[12px] font-bold text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
          Enter Arena
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </button>
  )
}