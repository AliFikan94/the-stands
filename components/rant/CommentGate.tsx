// components/rant/CommentGate.tsx
'use client'

import { useState } from 'react'
import { Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CommentGate({
  tickers,
  children,
}: {
  tickers: string[]
  children: React.ReactNode
}) {
  const [hasAccess, setHasAccess] = useState(false)

  const checkAccess = () => {
    const hasBalance = Math.random() > 0.4
    setHasAccess(hasBalance)
  }

  if (!hasAccess) {
    return (
      <div className="card-apple p-10 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--fg)]/5 flex items-center justify-center">
          <Users className="w-8 h-8 text-[var(--fg-secondary)]" />
        </div>
        <h3 className="h2-apple mb-3">Members only</h3>
        <p className="body-apple text-[var(--fg-secondary)] max-w-md mx-auto mb-8">
          You need to own at least{' '}
          <span className="text-[var(--fg)] font-medium">100 fan tokens</span> of
          either {tickers.join(' or ')} to join this conversation.
        </p>
        <Button onClick={checkAccess}>Check My Balance</Button>
      </div>
    )
  }

  return <>{children}</>
}
