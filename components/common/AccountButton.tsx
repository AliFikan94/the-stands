'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { LogIn } from 'lucide-react'
import { SignInModal } from './SignInModal'

export function AccountButton({ compact = false }: { compact?: boolean }) {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)

  if (status === 'authenticated' && session.user) {
    const label = session.user.name || session.user.email || 'Signed in'

    return (
      <button
        type="button"
        onClick={() => signOut()}
        title="Sign out"
        className={`inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--bg-elevated)] font-semibold text-[var(--fg)] hover:border-[var(--fg-tertiary)] transition-colors ${
          compact ? 'h-10 px-3 text-[12px]' : 'h-11 px-4 text-[13px]'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0" />
        <span className="truncate max-w-[120px]">{label}</span>
      </button>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--bg-elevated)] font-semibold text-[var(--fg)] hover:border-[var(--fg-tertiary)] transition-colors ${
          compact ? 'h-10 px-3 text-[12px]' : 'h-11 px-4 text-[13px]'
        }`}
      >
        <LogIn className="w-4 h-4" />
        Sign in
      </button>

      <SignInModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
