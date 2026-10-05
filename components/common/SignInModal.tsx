'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Mail, Wallet, X as XIcon, LoaderCircle, X as CloseIcon } from 'lucide-react'
import { signIn, getProviders } from 'next-auth/react'
import { useAccount, useConnect, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'

type Step = 'choose' | 'email' | 'code'

export function SignInModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [step, setStep] = useState<Step>('choose')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [devCode, setDevCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [walletLoading, setWalletLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [twitterAvailable, setTwitterAvailable] = useState(false)

  const { address, isConnected } = useAccount()
  const { connectAsync, connectors } = useConnect()
  const { signMessageAsync } = useSignMessage()

  useEffect(() => {
    if (!open) return

    getProviders().then((providers) => {
      setTwitterAvailable(Boolean(providers?.twitter))
    })
  }, [open])

  function handleClose() {
    setStep('choose')
    setEmail('')
    setCode('')
    setDevCode(null)
    setError(null)
    onClose()
  }

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') handleClose()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!open) return null

  async function handleWallet() {
    setError(null)
    setWalletLoading(true)

    try {
      let account = address

      if (!isConnected || !account) {
        const connector =
          connectors.find((c) => c.id === 'metaMask' || c.id.includes('injected')) ||
          connectors[0]
        const result = await connectAsync({ connector })
        account = result.accounts[0]
      }

      if (!account) throw new Error('No wallet account available')

      const nonceRes = await fetch('/api/auth/wallet-nonce')
      const { nonce } = await nonceRes.json()

      const message = new SiweMessage({
        domain: window.location.host,
        address: account,
        statement: 'Sign in to TheStands',
        uri: window.location.origin,
        version: '1',
        chainId: 88888,
        nonce,
      })

      const signature = await signMessageAsync({ message: message.prepareMessage() })

      const result = await signIn('wallet', {
        message: JSON.stringify(message),
        signature,
        redirect: false,
      })

      if (result?.error) {
        setError('Could not verify that signature. Try again.')
      } else {
        handleClose()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wallet sign-in failed.')
    } finally {
      setWalletLoading(false)
    }
  }

  async function requestCode() {
    setError(null)
    setEmailLoading(true)

    try {
      const res = await fetch('/api/auth/email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!data.ok) {
        setError(data.reason || 'Could not send a code.')
        return
      }

      setDevCode(data.devCode || null)
      setStep('code')
    } catch {
      setError('Could not send a code. Try again.')
    } finally {
      setEmailLoading(false)
    }
  }

  async function verifyCode() {
    setError(null)
    setEmailLoading(true)

    try {
      const result = await signIn('email-otp', { email, code, redirect: false })

      if (result?.error) {
        setError('That code is wrong or expired.')
      } else {
        handleClose()
      }
    } finally {
      setEmailLoading(false)
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[380px] rounded-[22px] border border-[var(--hairline)] bg-[var(--bg-elevated)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-bold tracking-[-0.02em]">
            {step === 'choose' && 'Sign in'}
            {step === 'email' && 'Continue with email'}
            {step === 'code' && 'Enter your code'}
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--fg-tertiary)] hover:bg-[var(--bg)] hover:text-[var(--fg)] transition-colors"
            aria-label="Close"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {step === 'choose' && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleWallet}
              disabled={walletLoading}
              className="btn-secondary w-full justify-start gap-3 !text-[14px]"
            >
              {walletLoading ? (
                <LoaderCircle className="w-4 h-4 animate-spin" />
              ) : (
                <Wallet className="w-4 h-4" />
              )}
              Continue with wallet
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="btn-secondary w-full justify-start gap-3 !text-[14px]"
            >
              <Mail className="w-4 h-4" />
              Continue with email
            </button>

            {twitterAvailable && (
              <button
                type="button"
                onClick={() => signIn('twitter')}
                className="btn-secondary w-full justify-start gap-3 !text-[14px]"
              >
                <XIcon className="w-4 h-4" />
                Continue with X
              </button>
            )}
          </div>
        )}

        {step === 'email' && (
          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && requestCode()}
              placeholder="you@example.com"
              autoFocus
              className="w-full rounded-full border border-[var(--hairline)] bg-[var(--bg)] px-4 py-3 text-[14px] outline-none focus:border-[var(--fg)]"
            />

            <button
              type="button"
              onClick={requestCode}
              disabled={!email.trim() || emailLoading}
              className="btn-primary w-full"
            >
              {emailLoading ? 'Sending...' : 'Send code'}
            </button>
          </div>
        )}

        {step === 'code' && (
          <div className="space-y-3">
            <p className="text-[13px] text-[var(--fg-secondary)]">
              We sent a 6-digit code to {email}.
            </p>

            {devCode && (
              <p className="text-[12px] rounded-xl bg-[var(--accent-soft)] text-[var(--accent-hover)] px-3 py-2">
                No email provider configured yet — your code is{' '}
                <strong className="tabular-nums">{devCode}</strong>.
              </p>
            )}

            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(event) => setCode(event.target.value.slice(0, 6))}
              onKeyDown={(event) => event.key === 'Enter' && verifyCode()}
              placeholder="123456"
              autoFocus
              className="w-full rounded-full border border-[var(--hairline)] bg-[var(--bg)] px-4 py-3 text-[16px] tracking-[0.3em] text-center outline-none focus:border-[var(--fg)]"
            />

            <button
              type="button"
              onClick={verifyCode}
              disabled={code.length !== 6 || emailLoading}
              className="btn-primary w-full"
            >
              {emailLoading ? 'Verifying...' : 'Verify & sign in'}
            </button>
          </div>
        )}

        {error && (
          <p className="text-[12px] text-red-500 mt-3">{error}</p>
        )}
      </div>
    </div>,
    document.body
  )
}
