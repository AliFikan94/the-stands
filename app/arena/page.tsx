'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Trophy } from 'lucide-react'
import { AIRoast } from '@/components/arena/AIRoast'
import { RivalryCard, type Rivalry } from '@/components/arena/RivalryCard'
import { RivalryRoom } from '@/components/arena/RivalryRoom'
import { Leaderboard } from '@/components/identity/Leaderboard'
import { FanIdentityCard } from '@/components/identity/FanIdentityCard'
import { RIVALRIES, getAllClubs } from '@/lib/rivalries'

const CLUBS = getAllClubs(RIVALRIES)

export default function ArenaPage() {
  const [selected, setSelected] = useState<Rivalry | null>(null)

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

        {!selected && (
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
              defend their colours in real time. Check in, post takes, get
              reactions and climb the leaderboard — verify your Fan Token to
              earn faster in your club&apos;s fixtures.
            </p>
          </div>
        )}
      </section>

      {/* Arena */}
      <section className="container-apple pb-24">
        {selected ? (
          <RivalryRoom rivalry={selected} onBack={() => setSelected(null)} />
        ) : (
          <div className="feed-layout">
            <div className="min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {RIVALRIES.map((rivalry) => (
                  <RivalryCard
                    key={rivalry.id}
                    rivalry={rivalry}
                    onEnter={setSelected}
                  />
                ))}
              </div>

              {/* AI Roast */}
              <div id="ai-roast" className="mt-8 scroll-mt-24">
                <AIRoast
                  onPost={(roast) => {
                    console.log('AI Roast posted:', roast)
                  }}
                />
              </div>

              {/* Talk Trash */}
              <section className="side-card side-card-dark mt-8">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5 text-white/70" />

                    <p className="eyebrow text-white/50">TALK TRASH</p>
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
                    onClick={() => {
                      document
                        .getElementById('ai-roast')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-[var(--fg)] px-5 min-h-[44px] text-[13px] font-bold hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Start a roast
                  </button>
                </div>
              </section>
            </div>

            {/* Desktop sidebar */}
            <aside className="hidden lg:block space-y-4">
              <FanIdentityCard clubs={CLUBS} />
              <Leaderboard clubs={CLUBS} />
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}
