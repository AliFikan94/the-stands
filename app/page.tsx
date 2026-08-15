'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { RantComposer } from '@/components/rant/RantComposer'
import { RantFeed, type Rant } from '@/components/rant/RantFeed'
import { WalletButton } from '@/components/common/WalletButton'

const TRENDING_CLUBS = [
  ['#PSG', '842 rants'],
  ['#ARS', '621 rants'],
  ['#MCI', '504 rants'],
  ['#BAR', '388 rants'],
] as const

export default function Home() {
  const [activeTab, setActiveTab] = useState<'feed' | 'marketplace'>('feed')
  const [newRants, setNewRants] = useState<Rant[]>([])

  // Memoize callback to prevent unnecessary re-renders in children
  const handleRantPosted = useCallback((rant: Rant) => {
    setNewRants((current) => [rant, ...current])
  }, [])

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[var(--hairline)] bg-[var(--bg)]/85 backdrop-blur-2xl">
        <div className="container-apple-wide h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="brand-mark">
              <img src="/images/standup.png" alt="TheStands" />
            </div>

            <div>
              <div className="text-[17px] font-semibold tracking-[-0.03em]">
                TheStands
              </div>
              <div className="hidden sm:block text-[10px] uppercase tracking-[0.16em] text-[var(--fg-tertiary)]">
                Football. Unfiltered.
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <nav
            className="flex items-center gap-1 rounded-full border border-[var(--hairline)] bg-white/70 p-1"
            aria-label="Main Navigation"
          >
            <Link
              href="/"
              onClick={() => setActiveTab('feed')}
              className={`nav-pill ${
                activeTab === 'feed' ? 'nav-pill-active' : ''
              }`}
            >
              Feed
            </Link>

            <Link href="/arena" className="nav-pill">
              Arena
            </Link>

            <button
              type="button"
              onClick={() => setActiveTab('marketplace')}
              className={`nav-pill ${
                activeTab === 'marketplace' ? 'nav-pill-active' : ''
              }`}
            >
              Marketplace
            </button>
          </nav>

          <WalletButton />
        </div>
      </header>

      {activeTab === 'feed' ? (
        <>
          {/* Hero */}
          <section className="container-apple pt-14 md:pt-20 pb-10">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 mb-5">
                <span className="live-dot" aria-hidden="true" />
                <span className="eyebrow text-[var(--accent)]">
                  THE FOOTBALL STANDS
                </span>
              </div>

              <h1 className="display max-w-3xl">
                Say what every <span className="accent-text">fan</span> is thinking.
              </h1>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-5">
                <p className="body-apple text-[var(--fg-secondary)] max-w-2xl">
                  Hot takes, matchday banter and football arguments worth
                  having. Post it. Own it. Defend it.
                </p>

                <a href="#composer" className="btn-primary shrink-0">
                  Start a rant
                </a>
              </div>
            </div>

            {/* Match strip */}
            <div className="match-strip mt-10">
              <div className="flex items-center gap-3">
                <span className="live-dot" aria-hidden="true" />
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em]">
                  Matchday
                </span>
              </div>

              <div
                className="hidden sm:block h-5 w-px bg-[var(--hairline)]"
                aria-hidden="true"
              />

              <div className="flex items-center gap-2 text-[14px]">
                <strong>ARS</strong>
                <span className="text-[var(--fg-tertiary)]">vs</span>
                <strong>MCI</strong>
              </div>

              <div className="hidden sm:block text-[13px] text-[var(--fg-secondary)]">
                The stands are talking
              </div>

              <div className="sm:ml-auto text-[13px] font-medium text-[var(--accent)]">
                1,284 rants today &rarr;
              </div>
            </div>
          </section>

          {/* Main content */}
          <main className="container-apple pb-24">
            <div className="feed-layout">
              <div className="min-w-0">
                {/* Target anchor for smooth scrolling */}
                <div id="composer" className="scroll-mt-24">
                  <RantComposer onPosted={handleRantPosted} />
                </div>

                <RantFeed extraRants={newRants} />
              </div>

              {/* Desktop sidebar */}
              <aside className="hidden lg:block space-y-4">
                <div className="side-card">
                  <p className="eyebrow mb-4">TRENDING CLUBS</p>

                  <div className="space-y-2">
                    {TRENDING_CLUBS.map(([club, count]) => (
                      <div
                        key={club}
                        className="flex items-center justify-between py-2"
                      >
                        <span className="font-semibold text-[14px]">
                          {club}
                        </span>
                        <span className="text-[12px] text-[var(--fg-tertiary)]">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="side-card side-card-dark">
                  <p className="eyebrow mb-3 text-white/50">THE STANDS</p>
                  <p className="text-[20px] leading-tight font-semibold tracking-[-0.03em]">
                    The best football conversations aren&apos;t polite.
                  </p>
                  <p className="text-[13px] text-white/55 mt-3 leading-relaxed">
                    Bring your take. Just be ready to defend it.
                  </p>
                </div>
              </aside>
            </div>
          </main>
        </>
      ) : (
        <main className="container-apple py-24">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">MARKETPLACE</p>
            <h1 className="display mb-5">
              Own the takes
              <br />
              worth remembering.
            </h1>
            <p className="body-apple text-[var(--fg-secondary)]">
              The Banter marketplace is coming soon. Mint the takes that
              become part of football history.
            </p>
          </div>
        </main>
      )}
    </div>
  )
}