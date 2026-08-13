'use client'

import { useState } from 'react'
import { Image as ImageIcon, X } from 'lucide-react'
import { useAccount, useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import { type Rant } from './RantFeed'

const CONTRACT_ADDRESS =
  '0xb6aC163AfCD00C975FC1E6efe4a6391F54188E00'

export function RantComposer({
  onPosted,
}: {
  onPosted: (rant: Rant) => void
}) {
  const { address } = useAccount()
  const { writeContract, isPending: isMinting } = useWriteContract()

  const [content, setContent] = useState('')
  const [tickers, setTickers] = useState<string[]>([])
  const [media, setMedia] = useState<string | null>(null)
  const [isPosting, setIsPosting] = useState(false)

  const maxLength = 280

  const addTicker = (ticker: string) => {
    const cleaned = ticker.trim().replace(/^\$/, '')

    if (!cleaned) return

    const formatted = `$${cleaned.toUpperCase()}`

    if (tickers.length < 2 && !tickers.includes(formatted)) {
      setTickers((current) => [...current, formatted])
    }
  }

  const removeTicker = (ticker: string) => {
    setTickers((current) => current.filter((t) => t !== ticker))
  }

  const handleMediaUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]

    if (file) {
      setMedia(URL.createObjectURL(file))
    }
  }

  const resetForm = () => {
    setContent('')
    setTickers([])
    setMedia(null)
  }

  const handlePost = async () => {
    if (!content.trim() || tickers.length === 0) return

    setIsPosting(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const rant: Rant = {
      owner: address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : '0xFan...0001',
      content: content.trim(),
      tickers,
      mediaUri: media || undefined,
      timestamp: 'just now',
      likes: 0,
      comments: 0,
    }

    onPosted(rant)
    resetForm()
    setIsPosting(false)
  }

  const handleMint = async () => {
    if (!address || !content.trim() || tickers.length === 0) return

    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: [
          {
            inputs: [
              {
                internalType: 'string',
                name: 'content',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'ticker1',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'ticker2',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'mediaUri',
                type: 'string',
              },
            ],
            name: 'mintBanter',
            outputs: [],
            stateMutability: 'payable',
            type: 'function',
          },
        ],
        functionName: 'mintBanter',
        args: [
          content,
          tickers[0],
          tickers[1] || '',
          media || '',
        ],
        value: parseEther('1'),
      })
    } catch (error) {
      console.error('Mint failed:', error)
    }
  }

  const canPost =
    content.trim().length > 0 &&
    tickers.length > 0 &&
    !isPosting

  return (
    <section id="composer" className="composer-card overflow-hidden">
      <div className="px-5 sm:px-7 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow text-[var(--accent)]">
              HAVE YOUR SAY
            </p>

            <h2 className="text-[22px] font-bold tracking-[-0.035em] mt-2">
              What are the stands saying?
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-[var(--fg-tertiary)]">
            <span>MAX</span>
            <span className="text-[var(--fg-secondary)]">
              {maxLength}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-7">
        <textarea
          value={content}
          onChange={(e) =>
            setContent(e.target.value.slice(0, maxLength))
          }
          placeholder="Drop the take. Make it count."
          className="w-full min-h-[110px] resize-none border-0 bg-transparent outline-none py-3 text-[18px] leading-[1.45] tracking-[-0.025em] text-[var(--fg)] placeholder:text-[var(--fg-tertiary)]"
        />

        {media && (
          <div className="media-frame relative mb-4">
            <img
              src={media}
              alt="Rant preview"
              className="w-full max-h-[300px] object-cover"
            />

            <button
              type="button"
              onClick={() => setMedia(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center backdrop-blur-md"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-[var(--hairline)] py-3">
          <div className="flex items-center gap-2 min-w-0">
            {tickers.map((ticker) => (
              <button
                key={ticker}
                type="button"
                onClick={() => removeTicker(ticker)}
                className="club-pill shrink-0"
              >
                {ticker}
                <X className="w-3 h-3" />
              </button>
            ))}

            {tickers.length < 2 && (
              <input
                type="text"
                placeholder="+ Club"
                className="w-[100px] bg-transparent border-0 outline-none text-[13px] font-semibold text-[var(--fg)] placeholder:text-[var(--fg-tertiary)]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()

                    const value = e.currentTarget.value

                    addTicker(value)
                    e.currentTarget.value = ''
                  }
                }}
              />
            )}
          </div>

          <span className="text-[11px] text-[var(--fg-tertiary)] tabular-nums shrink-0">
            {content.length}/{maxLength}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[var(--hairline)] px-5 sm:px-7 py-3">
        <label className="flex items-center gap-2 text-[13px] font-semibold text-[var(--fg-secondary)] hover:text-[var(--fg)] cursor-pointer">
          <ImageIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Photo / GIF</span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleMediaUpload}
          />
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleMint}
            disabled={
              !address ||
              !content.trim() ||
              tickers.length === 0 ||
              isMinting
            }
            className="btn-secondary"
          >
            {isMinting ? 'Minting...' : 'Mint · 1 CHZ'}
          </button>

          <button
            type="button"
            onClick={handlePost}
            disabled={!canPost}
            className="btn-primary min-h-[42px]"
          >
            {isPosting ? 'Posting...' : 'Post rant'}
          </button>
        </div>
      </div>
    </section>
  )
}