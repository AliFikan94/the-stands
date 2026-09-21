'use client'

import { useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

function subscribe() {
  return () => {}
}

// resolvedTheme is undefined until after hydration (it depends on system
// preference / localStorage, neither known on the server). useSyncExternalStore
// lets us render a neutral placeholder for the server snapshot and the real
// icon once mounted, without an effect+setState hydration workaround.
function getClientSnapshot() {
  return true
}

function getServerSnapshot() {
  return false
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  )

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={mounted ? `Switch to ${isDark ? 'light' : 'dark'} mode` : 'Toggle theme'}
      className="relative w-10 h-10 shrink-0 rounded-full border border-[var(--hairline)] bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--fg-secondary)] hover:text-[var(--fg)] hover:border-[var(--fg-tertiary)] transition-all duration-200 [transition-timing-function:var(--ease-apple)] active:scale-90"
    >
      {mounted && (
        <>
          <Sun
            className={`w-[18px] h-[18px] absolute transition-all duration-300 [transition-timing-function:var(--ease-apple)] ${
              isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
            }`}
          />
          <Moon
            className={`w-[18px] h-[18px] absolute transition-all duration-300 [transition-timing-function:var(--ease-apple)] ${
              isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
            }`}
          />
        </>
      )}
    </button>
  )
}
