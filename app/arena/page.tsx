'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  Flame,
  Users,
  MessageCircle,
  Trophy,
} from 'lucide-react'

const RIVALRIES = [
  {
    teams: 'Arsenal vs Chelsea',
    code: 'ARS · CHE',
    description: 'London rivalry',
    members: '12.4K fans',
    heat: 92,
  },
  {
    teams: 'Liverpool vs Man United',
    code: 'LIV · MUN',
    description: 'The biggest rivalry',
    members: '18.7K fans',
    heat: 97,
  },
  {
    teams: 'Manchester City vs Man United',
    code: 'MCI · MUN',
    description: 'Manchester Derby',
    members: '15.2K fans',
    heat: 95,
  },
  {
    teams: 'Barcelona vs Real Madrid',
    code: 'BAR · RMA',
    description: 'El Clásico',
    members: '21.8K fans',
    heat: 99,
  },
  {
    teams: 'Tottenham vs Arsenal',
    code: 'TOT · ARS',
    description: 'North London Derby',
    members: '9.6K fans',
    heat: 91,
  },
  {
    teams: 'Everton vs Liverpool',
    code: 'EVE · LIV',
    description: 'Merseyside Derby',
    members: '7.3K fans',
    heat: 88,
  },
]

export default function ArenaPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <section className="container-apple pt-12 md:pt-20 pb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to the stands
        </Link>

        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-5">
            <span className="live-dot" aria-hidden="true" />

            <span className="eyebrow text-[var(--accent)]">
              THE RIVALRY ARENA
            </span>
          </div>

          <h1 className="display max-w-3xl">
            Pick your
            <br />
            <span className="accent-text">battle.</span>
          </h1>

          <p className="body-apple text-[var(--fg-secondary)] max-w-2xl mt-6">
            Rivalry rooms where football fans argue, react, roast and
            defend their colours in real time.
          </p>
        </div>
      </section>

      {/* Live Arena */}
      <section className="container-apple pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RIVALRIES.map((rivalry) => (
            <article
              key={rivalry.code}
              className="side-card group hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="live-dot" />

                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--fg-secondary)]">
                    LIVE
                  </span>
                </div>

                <Flame className="w-4 h-4 text-[var(--orange)]" />
              </div>

              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--fg-tertiary)]">
                {rivalry.code}
              </p>

              <h2 className="text-[21px] font-bold tracking-[-0.035em] mt-2">
                {rivalry.teams}
              </h2>

              <p className="text-[13px] text-[var(--fg-secondary)] mt-2">
                {rivalry.description}
              </p>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--hairline)]">
                <div className="flex items-center gap-2 text-[12px] text-[var(--fg-secondary)]">
                  <Users className="w-4 h-4" />
                  {rivalry.members}
                </div>

                <div className="flex items-center gap-1 text-[12px] font-bold text-[var(--orange)]">
                  <Flame className="w-3.5 h-3.5" />
                  {rivalry.heat}%
                </div>
              </div>

              <button
                type="button"
                className="btn-primary w-full mt-5"
              >
                Enter Arena
              </button>
            </article>
          ))}
        </div>

        {/* Talk Trash */}
        <section className="side-card side-card-dark mt-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-white/70" />

              <p className="eyebrow text-white/50">
                TALK TRASH
              </p>
            </div>

            <h2 className="text-[28px] sm:text-[36px] font-bold tracking-[-0.045em] leading-tight">
              Think your roast can survive the Arena?
            </h2>

            <p className="text-[14px] text-white/55 mt-4 leading-relaxed">
              Enter a rivalry, drop your take and let the fans decide
              who won the exchange.
            </p>

            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-[var(--fg)] px-5 min-h-[44px] text-[13px] font-bold hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" />
              Start a roast
            </button>
          </div>
        </section>
      </section>
    </main>
  )
}