'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()

  const availableConnector =
    connectors.find(
      (c) => c.id === 'metaMask' || c.id.includes('injected')
    ) || connectors[0]

  const handleClick = async () => {
    if (isConnected) {
      disconnect()
    } else if (availableConnector) {
      try {
        await connect({ connector: availableConnector })
      } catch (err) {
        console.error('Connection failed:', err)
      }
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        variant={isConnected ? 'secondary' : 'default'}
        className="min-w-[150px] sm:min-w-[180px] h-11 sm:h-12 px-5 sm:px-6 rounded-full text-[13px] sm:text-[14px] font-semibold gap-2 border border-[var(--hairline)] shadow-none transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
      >
        {isConnected && address ? (
          <>
            <span
              aria-hidden="true"
              className="inline-block w-2 h-2 rounded-full bg-[#0a9f55] shrink-0"
            />
            <span className="tabular-nums font-mono text-[12px] tracking-tight">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4 shrink-0" />
            <span>{isPending ? 'Connecting...' : 'Connect wallet'}</span>
          </>
        )}
      </Button>

      {error && (
        <p className="text-[11px] font-medium text-red-500 max-w-[200px] text-right truncate">
          {error.message}
        </p>
      )}
    </div>
  )
}