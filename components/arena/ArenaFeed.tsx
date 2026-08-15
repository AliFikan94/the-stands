'use client'

import { useState } from 'react'
import {
  Flame,
  Radio,
  Trophy,
  Users,
} from 'lucide-react'
import {
  RivalryCard,
  type Rivalry,
} from './RivalryCard'
import { RivalryRoom } from './RivalryRoom'
import { AIRoast } from './AIRoast'

const rivalries: Rivalry[] = [
  {
    id: 'north-london',
    home: 'Arsenal',
    away: 'Tottenham',
    homeShort: 'ARS',
    awayShort: 'TOT',
    color: '#d71920',
    description:
      'North London is open for business. Victory laps, cope posts and everything in between.',
    members: 12840,
    messages: 342,
    heat: 94,
  },
  {
    id: 'manchester',
    home: 'Man United',
    away: 'Man City',
    homeShort: 'MUN',
    awayShort: 'MCI',
    color: '#6cabdd',
    description:
      'Manchester rivalry room. Bring your receipts and leave your excuses at the door.',
    members: 18620,
    messages: 517,
    heat: 91,
  },
  {
    id: 'merseyside',
    home: 'Liverpool',
    away: 'Everton',
    homeShort: 'LIV',
    awayShort: 'EVE',
    color: '#c8102e',
    description:
      'Merseyside derby territory. One city. Two clubs. Unlimited ammunition.',
    members: 9320,
    messages: 219,
    heat: 87,
  },
  {
    id: 'london-derby',
    home: 'Chelsea',
    away: 'Arsenal',
    homeShort: 'CHE',
    awayShort: 'ARS',
    color: '#034694',
    description:
      'London rivals going head-to-head. Expect strong opinions and questionable predictions.',
    members: 11420,
    messages: 286,
    heat: 84,
  },
]

export function ArenaFeed() {
  const [selectedRivalry, setSelectedRivalry] =
    useState<Rivalry | null>(null)

  if (selectedRivalry) {
    return (
      <RivalryRoom
        rivalry={selectedRivalry}
        onBack={() => setSelectedRivalry(null)}
      />
    )
  }

  return (
    <section className="mt-10">
      {/* Hero */}
      <div className="rounded-[26px] bg-[#101311] text-white p-6 sm:p-8 overflow-hidden relative">
        <div className="relative z-10 max-w-[720px]">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">
            <Radio className="w-3.5 h-3.5 text-[var(--accent)]" />
            Live from the Arena
          </div>

          <h1 className="text-[38px] sm:text-[52px] font-bold tracking-[-0.055em] leading-[0.95] mt-4">
            Rivalries have
            <br />
            a home now.
          </h1>

          <p className="text-[15px] sm:text-[17px] leading-[1.5] text-white/60 max-w-[560px] mt-5">
            Pick a rivalry, enter the room and make your case.
            The funniest takes rise. The weak ones get roasted.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[12px] font-semibold">
              <Users className="w-3.5 h-3.5" />
              68K fans
            </div>

            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[12px] font-semibold">
              <Flame className="w-3.5 h-3.5 text-orange-300" />
              12 live rivalries
            </div>

            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[12px] font-semibold">
              <Trophy className="w-3.5 h-3.5 text-yellow-300" />
              Weekly leaderboard
            </div>
          </div>
        </div>

        <div className="absolute -right-20 -bottom-32 w-[300px] h-[300px] rounded-full border-[50px] border-[var(--accent)]/20" />
        <div className="absolute -right-5 -bottom-20 w-[180px] h-[180px] rounded-full border-[30px] border-white/5" />
      </div>

      {/* AI Roast */}
      <div className="mt-6">
        <AIRoast
          onPost={(roast) => {
            console.log('Roast posted:', roast)
          }}
        />
      </div>

      {/* Section heading */}
      <div className="flex items-end justify-between mt-10 mb-5">
        <div>
          <p className="eyebrow text-[var(--accent)] mb-2">
            PICK YOUR FIGHT
          </p>

          <h2 className="h2-apple">
            Rivalry Rooms
          </h2>
        </div>

        <span className="hidden sm:block text-[12px] font-semibold text-[var(--fg-tertiary)]">
          Live rooms first
        </span>
      </div>

      {/* Rivalry cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {rivalries.map((rivalry) => (
          <RivalryCard
            key={rivalry.id}
            rivalry={rivalry}
            onEnter={setSelectedRivalry}
          />
        ))}
      </div>
    </section>
  )
}