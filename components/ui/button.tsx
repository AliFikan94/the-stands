// components/ui/button.tsx
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost'
}

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 transition-all duration-200 [transition-timing-function:var(--ease-apple)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"

  const styles =
    variant === 'default'
      ? "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-full px-[22px] py-3 text-[17px] font-normal tracking-[-0.01em]"
      : variant === 'secondary'
      ? "bg-transparent text-[var(--accent)] border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white rounded-full px-[22px] py-[11px] text-[17px] font-normal tracking-[-0.01em]"
      : "bg-transparent text-[var(--accent)] hover:underline px-2 py-1 text-[17px] font-normal tracking-[-0.01em]"

  return <button className={cn(base, styles, className)} {...props} />
}
