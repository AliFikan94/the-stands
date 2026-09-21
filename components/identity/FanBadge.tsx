'use client'

import { useRef, useState } from 'react'
import { Lock } from 'lucide-react'
import type { BadgeTier } from '@/lib/points'

const TIER_COLORS: Record<BadgeTier, { primary: string; highlight: string; glow: string }> = {
  bronze: { primary: '#b3743f', highlight: '#f3cfa1', glow: 'rgba(179, 116, 63, 0.45)' },
  silver: { primary: '#aab2bd', highlight: '#ffffff', glow: 'rgba(170, 178, 189, 0.45)' },
  gold: { primary: '#e0ac1f', highlight: '#fff3cf', glow: 'rgba(224, 172, 31, 0.5)' },
}

export function FanBadge({
  tier,
  label,
  monogram,
  emoji,
  accentColor,
  size = 112,
  locked = false,
}: {
  tier: BadgeTier
  label?: string
  monogram: string
  emoji?: string
  accentColor?: string
  size?: number
  locked?: boolean
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)

  const colors = TIER_COLORS[tier]
  const accent = accentColor || colors.primary

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (locked) return

    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return

    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5

    setRotation({ x: py * -22, y: px * 26 })
  }

  function handleLeave() {
    setHovering(false)
    setRotation({ x: 0, y: 0 })
  }

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div
        ref={wrapRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={handleLeave}
        style={{ width: size, height: size, perspective: 600 }}
        className="relative"
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transitionDuration: hovering ? '80ms' : '500ms',
            transitionTimingFunction: 'var(--ease-apple)',
            transitionProperty: 'transform',
            transformStyle: 'preserve-3d',
          }}
          className="relative rounded-full"
        >
          {/* base metallic disc */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: locked
                ? 'radial-gradient(circle at 32% 28%, #d9dcd9, #9aa19a 70%)'
                : `radial-gradient(circle at 32% 28%, ${colors.highlight}, ${colors.primary} 62%, ${accent} 100%)`,
              boxShadow: locked
                ? 'inset 0 2px 6px rgba(0,0,0,0.18), inset 0 -6px 14px rgba(0,0,0,0.12)'
                : `inset 0 2px 6px rgba(255,255,255,0.55), inset 0 -8px 18px rgba(0,0,0,0.25), 0 12px 30px ${colors.glow}`,
              filter: locked ? 'grayscale(1) opacity(0.55)' : 'none',
            }}
          />

          {/* rotating sheen */}
          {!locked && (
            <div
              className="absolute inset-0 rounded-full fan-badge-sheen"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.55) 8%, transparent 20%, transparent 100%)',
                mixBlendMode: 'overlay',
              }}
            />
          )}

          {/* rim */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 0 2px ${locked ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.4)'} inset, 0 0 0 4px rgba(16,19,17,0.06)`,
            }}
          />

          {/* face */}
          <div className="absolute inset-0 rounded-full flex items-center justify-center">
            {locked ? (
              <Lock className="w-1/3 h-1/3 text-white/70" strokeWidth={2.2} />
            ) : emoji ? (
              <span
                className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
                style={{ fontSize: size * 0.44, lineHeight: 1 }}
              >
                {emoji}
              </span>
            ) : (
              <span
                className="font-black tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
                style={{ fontSize: size * 0.32 }}
              >
                {monogram}
              </span>
            )}
          </div>
        </div>
      </div>

      {label && (
        <span
          className={`text-[11px] font-bold text-center max-w-[100px] leading-tight ${
            locked ? 'text-[var(--fg-tertiary)]' : 'text-[var(--fg)]'
          }`}
        >
          {label}
        </span>
      )}
    </div>
  )
}
