'use client'

import { useState } from 'react'
import { Sparkles, Send, Pencil, RotateCcw } from 'lucide-react'

const roastStyles = [
  'Savage',
  'Clever',
  'Funny',
] as const

type RoastStyle = (typeof roastStyles)[number]

const mockRoasts: Record<RoastStyle, string[]> = {
  Savage: [
    "That's a bold take for someone whose trophy cabinet is collecting dust.",
    "You really typed that with confidence. Respectfully, the table says otherwise.",
    "Your banter has more holes than your team's defence.",
  ],
  Clever: [
    "Interesting argument. Unfortunately, football history has already submitted its counterpoint.",
    "I'd respond seriously, but your table position made the argument for me.",
    "That's one way to interpret the season. An extremely creative one.",
  ],
  Funny: [
    "Bro woke up, opened the league table and chose fiction.",
    "Someone check on this fan. The coping has entered extra time.",
    "VAR has reviewed your opinion and unfortunately found no evidence.",
  ],
}

export function AIRoast({
  onPost,
}: {
  onPost?: (roast: string) => void
}) {
  const [claim, setClaim] = useState('')
  const [style, setStyle] = useState<RoastStyle>('Funny')
  const [roasts, setRoasts] = useState<string[]>([])
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(false)

  function generateRoasts() {
    if (!claim.trim()) return

    setLoading(true)

    // Demo AI simulation.
    // Replace this with an API call when the backend is ready.
    setTimeout(() => {
      const shuffled = [...mockRoasts[style]].sort(() => Math.random() - 0.5)

      setRoasts(shuffled)
      setSelected(shuffled[0])
      setLoading(false)
    }, 500)
  }

  function regenerate() {
    if (!claim.trim()) return
    generateRoasts()
  }

  function postRoast() {
    if (!selected.trim()) return
    onPost?.(selected)
  }

  return (
    <section className="side-card overflow-hidden">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles
              size={17}
              className="text-[var(--accent)]"
              aria-hidden="true"
            />
            <p className="eyebrow">AI ROAST</p>
          </div>

          <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em]">
            Need a comeback?
          </h2>

          <p className="mt-1 text-[13px] text-[var(--fg-secondary)]">
            Give us the take. You decide what gets posted.
          </p>
        </div>
      </div>

      <textarea
        value={claim}
        onChange={(event) => setClaim(event.target.value)}
        placeholder="Paste your rival's take..."
        rows={3}
        maxLength={280}
        className="w-full resize-none rounded-2xl border border-[var(--hairline)] bg-[var(--bg)] px-4 py-3 text-[14px] outline-none transition focus:border-[var(--accent)]"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {roastStyles.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setStyle(option)}
            className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
              style === option
                ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                : 'border-[var(--hairline)] bg-[var(--bg)]'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={generateRoasts}
        disabled={!claim.trim() || loading}
        className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Sparkles size={16} aria-hidden="true" />
        {loading ? 'Cooking the roast...' : 'Roast them'}
      </button>

      {roasts.length > 0 && (
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="eyebrow">CHOOSE YOUR WEAPON</p>

            <button
              type="button"
              onClick={regenerate}
              className="flex items-center gap-1 text-[12px] font-medium text-[var(--fg-secondary)] hover:text-[var(--fg)]"
            >
              <RotateCcw size={13} />
              Again
            </button>
          </div>

          {roasts.map((roast, index) => (
            <button
              key={`${roast}-${index}`}
              type="button"
              onClick={() => setSelected(roast)}
              className={`w-full rounded-2xl border p-4 text-left text-[14px] leading-relaxed transition ${
                selected === roast
                  ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                  : 'border-[var(--hairline)] hover:border-[var(--fg-tertiary)]'
              }`}
            >
              {roast}
            </button>
          ))}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={postRoast}
              disabled={!selected}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              <Send size={15} />
              Post roast
            </button>

            <button
              type="button"
              onClick={() => setSelected('')}
              className="btn-secondary"
              title="Edit roast"
            >
              <Pencil size={15} />
              Edit
            </button>
          </div>
        </div>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-[var(--fg-tertiary)]">
        AI suggests. You decide. Keep the banter football-related.
      </p>
    </section>
  )
}