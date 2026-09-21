'use client'

import { useState } from 'react'
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Flame,
  Send,
} from 'lucide-react'

export type Rant = {
  tokenId?: string
  owner: string
  content: string
  tickers: string[]
  mediaUri?: string
  timestamp: string
  likes?: number
  comments?: number
}

const initialRants: Rant[] = [
  {
    owner: '0x8f3...aB9',
    content:
      'Arsenal playing like they paid the ref. This defending is criminal.',
    tickers: ['$ARS', '$MCI'],
    mediaUri: '/images/Arsenal%20tears.jfif',
    timestamp: '2m ago',
    likes: 24,
    comments: 8,
  },
  {
    owner: '0xB2c...F71',
    content:
      'PSG without Mbappé is just a midtable team. Change my mind.',
    tickers: ['$PSG'],
    mediaUri:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80',
    timestamp: '17m ago',
    likes: 41,
    comments: 13,
  },
]

function avatarText(owner: string) {
  return owner.replace('0x', '').slice(0, 2).toUpperCase()
}

export function RantFeed({
  extraRants = [],
}: {
  extraRants?: Rant[]
}) {
  const [rants, setRants] = useState<Rant[]>(initialRants)

  const handleUpdate = (updatedRant: Rant, isExtra: boolean, index: number) => {
    if (!isExtra) {
      setRants((current) =>
        current.map((item, itemIndex) =>
          itemIndex === index ? updatedRant : item
        )
      )
    }
  }

  const allRants = [...extraRants, ...rants]

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="eyebrow text-[var(--accent)] mb-2">
            LIVE FROM THE TERRACES
          </p>

          <h2 className="h2-apple">
            From the stands
          </h2>
        </div>

        <span className="hidden sm:block text-[12px] font-semibold text-[var(--fg-tertiary)]">
          Fresh takes first
        </span>
      </div>

      <div className="space-y-4">
        {allRants.map((rant, index) => {
          const isExtra = index < extraRants.length
          const internalIndex = isExtra ? index : index - extraRants.length

          return (
            <RantCard
              key={`${rant.owner}-${rant.timestamp}-${index}`}
              rant={rant}
              onUpdate={(updated) =>
                handleUpdate(updated, isExtra, internalIndex)
              }
            />
          )
        })}
      </div>
    </section>
  )
}

type Comment = {
  id: number
  author: string
  text: string
}

function RantCard({
  rant,
  onUpdate,
}: {
  rant: Rant
  onUpdate: (rant: Rant) => void
}) {
  const [liked, setLiked] = useState(false)
  const [shared, setShared] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentDraft, setCommentDraft] = useState('')

  const likes = (rant.likes || 0) + (liked ? 1 : 0)
  const commentCount = (rant.comments || 0) + comments.length

  const handlePostComment = () => {
    const text = commentDraft.trim()
    if (!text) return

    setComments((current) => [
      ...current,
      { id: Date.now(), author: 'You', text },
    ])
    setCommentDraft('')
  }

  const handleLike = () => {
    const nextLiked = !liked
    setLiked(nextLiked)
    onUpdate({
      ...rant,
      likes: (rant.likes || 0) + (nextLiked ? 1 : -1),
    })
  }

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(rant.content)
      }
    } catch {
      // Fallback or handle missing permission
    }

    setShared(true)

    setTimeout(() => {
      setShared(false)
    }, 1500)
  }

  return (
    <article className="rant-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-5 sm:px-7 pt-5">
        <div className="flex items-center gap-3 min-w-0">
          <div 
            className="w-10 h-10 rounded-full bg-[var(--ink)] text-white flex items-center justify-center text-[11px] font-bold shrink-0"
            aria-hidden="true"
          >
            {avatarText(rant.owner)}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold truncate">
                {rant.owner}
              </span>

              <span className="text-[var(--fg-tertiary)]" aria-hidden="true">
                ·
              </span>

              <span className="text-[12px] text-[var(--fg-secondary)]">
                {rant.timestamp}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-1">
              <Flame className="w-3 h-3 text-[var(--orange)]" />

              <span className="text-[11px] font-semibold text-[var(--fg-secondary)]">
                Hot take
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--fg-tertiary)] hover:bg-[var(--bg)] hover:text-[var(--fg)] transition-colors"
          aria-label="More options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="px-5 sm:px-7 pt-5">
        <p className="text-[18px] sm:text-[20px] leading-[1.4] tracking-[-0.025em] font-medium">
          {rant.content}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {rant.tickers.map((ticker) => (
            <span key={ticker} className="club-pill">
              {ticker}
            </span>
          ))}
        </div>
      </div>

      {/* Media */}
      {rant.mediaUri && (
        <div className="px-3 sm:px-4 pt-5">
          <div className="media-frame aspect-[16/9]">
            <img
              src={rant.mediaUri}
              alt="Football post media"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 mt-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleLike}
            className={`action-button ${liked ? 'liked' : ''}`}
            aria-label={liked ? 'Unlike rant' : 'Like rant'}
          >
            <Heart
              className="w-[17px] h-[17px]"
              fill={liked ? 'currentColor' : 'none'}
            />
            <span>{likes}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowComments((current) => !current)}
            className={`action-button ${
              showComments ? 'bg-[var(--bg)] text-[var(--fg)]' : ''
            }`}
            aria-label="Comment on rant"
            aria-expanded={showComments}
          >
            <MessageCircle className="w-[17px] h-[17px]" />
            <span>{commentCount}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="action-button"
            aria-label="Share rant"
          >
            <Share2 className="w-[17px] h-[17px]" />
            <span>{shared ? 'Copied' : 'Share'}</span>
          </button>
        </div>

        <button
          type="button"
          className="btn-primary min-h-[46px]"
        >
          Own the take
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="border-t border-[var(--hairline)] px-4 sm:px-6 py-4">
          {comments.length === 0 ? (
            <p className="text-[13px] text-[var(--fg-tertiary)] py-2">
              No comments yet. Be the first to reply.
            </p>
          ) : (
            <div className="space-y-3 mb-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full bg-[var(--ink)] text-white flex items-center justify-center text-[10px] font-bold shrink-0"
                    aria-hidden="true"
                  >
                    {comment.author.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1 rounded-2xl bg-[var(--bg)] px-3.5 py-2.5">
                    <p className="text-[12px] font-bold">{comment.author}</p>
                    <p className="text-[14px] leading-[1.45] mt-0.5">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={commentDraft}
              onChange={(event) => setCommentDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  handlePostComment()
                }
              }}
              placeholder="Reply to this take..."
              className="flex-1 min-w-0 rounded-full border border-[var(--hairline)] bg-[var(--bg-elevated)] px-4 py-2.5 text-[13px] outline-none focus:border-[var(--fg)]"
            />

            <button
              type="button"
              onClick={handlePostComment}
              disabled={!commentDraft.trim()}
              className="w-9 h-9 rounded-full bg-[var(--ink)] text-white flex items-center justify-center shrink-0 disabled:opacity-30 transition-all duration-150 [transition-timing-function:var(--ease-apple)] active:scale-90 disabled:active:scale-100"
              aria-label="Post comment"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </article>
  )
}