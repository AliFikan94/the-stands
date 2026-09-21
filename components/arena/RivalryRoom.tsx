'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Flame,
  Send,
  Trophy,
  Users,
} from 'lucide-react'
import type { Rivalry } from './RivalryCard'

type Message = {
  id: number
  user: string
  team: string
  text: string
  votes: number
}

const initialMessages: Message[] = [
  {
    id: 1,
    user: '0x8f3...aB9',
    team: 'ARS',
    text: '90 minutes of football and somehow we still found a way to make this stressful.',
    votes: 42,
  },
  {
    id: 2,
    user: '0xB2c...F71',
    team: 'CHE',
    text: 'At least we know how to finish our chances 😭',
    votes: 31,
  },
  {
    id: 3,
    user: '0x91a...C22',
    team: 'ARS',
    text: 'Talk now. The table will talk later.',
    votes: 67,
  },
]

export function RivalryRoom({
  rivalry,
  onBack,
}: {
  rivalry: Rivalry
  onBack: () => void
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [draft, setDraft] = useState('')

  const sendMessage = () => {
    const text = draft.trim()

    if (!text) return

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        user: 'You',
        team: rivalry.homeShort,
        text,
        votes: 0,
      },
    ])

    setDraft('')
  }

  const voteMessage = (id: number) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === id
          ? { ...message, votes: message.votes + 1 }
          : message
      )
    )
  }

  return (
    <section className="mt-8">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-[13px] font-bold text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors mb-5"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to rivalries
      </button>

      <div className="rounded-[24px] border border-[var(--hairline)] bg-white overflow-hidden shadow-[0_12px_40px_rgba(16,19,17,0.04)]">
        {/* Room header */}
        <div className="bg-[#101311] text-white px-5 sm:px-7 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/50">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                Live Arena
              </div>

              <h2 className="text-[26px] sm:text-[32px] font-bold tracking-[-0.04em] mt-2">
                {rivalry.home} <span className="text-white/30">vs</span>{' '}
                {rivalry.away}
              </h2>

              <p className="text-[13px] text-white/55 mt-2">
                The rivalry is live. Make your case.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-white/60">
                <Users className="w-4 h-4" />
                {rivalry.members.toLocaleString()} fans
              </div>

              <div className="flex items-center gap-2 text-[12px] font-bold text-orange-300">
                <Flame className="w-4 h-4" />
                {rivalry.heat}% heat
              </div>
            </div>
          </div>
        </div>

        {/* Room body */}
        <div className="grid lg:grid-cols-[1fr_260px]">
          <div>
            <div className="px-5 sm:px-7 py-5 border-b border-[var(--hairline)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="eyebrow text-[var(--accent)]">
                    TALK TRASH ARENA
                  </p>

                  <h3 className="text-[18px] font-bold mt-1">
                    Make your case
                  </h3>
                </div>

                <span className="text-[11px] font-semibold text-[var(--fg-tertiary)]">
                  Top roasts rise
                </span>
              </div>
            </div>

            <div className="divide-y divide-[var(--hairline)]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="px-5 sm:px-7 py-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--fg)] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {message.team}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold">
                          {message.user}
                        </span>

                        <span className="club-pill !py-1 !px-2 !text-[10px]">
                          ${message.team}
                        </span>
                      </div>

                      <p className="text-[15px] leading-[1.5] mt-2">
                        {message.text}
                      </p>

                      <div className="flex items-center gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => voteMessage(message.id)}
                          className="action-button"
                        >
                          🔥
                          <span>{message.votes}</span>
                        </button>

                        <button
                          type="button"
                          className="action-button"
                        >
                          Roast
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Composer */}
            <div className="p-4 sm:p-5 border-t border-[var(--hairline)] bg-[var(--bg)]">
              <div className="flex items-end gap-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value.slice(0, 240))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Drop your take..."
                  className="flex-1 min-h-[48px] max-h-[120px] resize-none rounded-[16px] border border-[var(--hairline)] bg-white px-4 py-3 text-[14px] outline-none focus:border-[var(--fg)]"
                />

                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!draft.trim()}
                  className="w-11 h-11 rounded-full bg-[var(--fg)] text-white flex items-center justify-center disabled:opacity-30 transition-all duration-150 [transition-timing-function:var(--ease-apple)] active:scale-90 disabled:active:scale-100"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <aside className="border-t lg:border-t-0 lg:border-l border-[var(--hairline)] p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[var(--orange)]" />

              <h3 className="text-[14px] font-bold">
                Arena leaderboard
              </h3>
            </div>

            <p className="text-[11px] text-[var(--fg-tertiary)] mt-2">
              The funniest takes rise to the top.
            </p>

            <div className="space-y-3 mt-6">
              {messages
                .slice()
                .sort((a, b) => b.votes - a.votes)
                .map((message, index) => (
                  <div
                    key={message.id}
                    className="flex items-center gap-3"
                  >
                    <span className="text-[11px] font-black text-[var(--fg-tertiary)] w-4">
                      {index + 1}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold truncate">
                        {message.user}
                      </p>

                      <p className="text-[10px] text-[var(--fg-tertiary)]">
                        ${message.team}
                      </p>
                    </div>

                    <span className="text-[11px] font-bold">
                      {message.votes} 🔥
                    </span>
                  </div>
                ))}
            </div>

            <div className="mt-7 rounded-[16px] bg-[var(--accent-soft)] p-4">
              <p className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-[0.08em]">
                Arena rule
              </p>

              <p className="text-[12px] leading-[1.45] text-[var(--fg-secondary)] mt-2">
                Banter hard. Keep it about football.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}