// Minimal persistence abstraction: a real Vercel KV (Redis) store when
// configured, falling back to an in-process Map for local development.
//
// The in-memory fallback is NOT shared across serverless invocations or
// server restarts — it's fine for local `next dev` and for demoing to
// yourself, but for real distributed fan testing you need the Vercel KV
// integration connected (Vercel dashboard -> Storage -> Create Database ->
// KV, then redeploy so KV_REST_API_URL / KV_REST_API_TOKEN are set).

const hasKv = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
)

type MemoryEntry = { value: unknown; expiresAt: number | null }

const memoryStore = new Map<string, MemoryEntry>()

type SimpleKv = {
  get<T>(key: string): Promise<T | null>
  /** ttlSeconds: auto-expire the key (e.g. a sign-in nonce or OTP). */
  set(key: string, value: unknown, ttlSeconds?: number): Promise<unknown>
  del(key: string): Promise<unknown>
}

async function loadVercelKv() {
  const { kv } = await import('@vercel/kv')
  return kv
}

const memoryKv: SimpleKv = {
  async get<T>(key: string) {
    const entry = memoryStore.get(key)
    if (!entry) return null

    if (entry.expiresAt !== null && entry.expiresAt < Date.now()) {
      memoryStore.delete(key)
      return null
    }

    return entry.value as T
  },
  async set(key: string, value: unknown, ttlSeconds?: number) {
    memoryStore.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
    })
    return 'OK'
  },
  async del(key: string) {
    memoryStore.delete(key)
    return 1
  },
}

export const kv: SimpleKv = hasKv
  ? {
      async get(key) {
        return (await loadVercelKv()).get(key)
      },
      async set(key, value, ttlSeconds) {
        const client = await loadVercelKv()
        return ttlSeconds
          ? client.set(key, value, { ex: ttlSeconds })
          : client.set(key, value)
      },
      async del(key) {
        return (await loadVercelKv()).del(key)
      },
    }
  : memoryKv

export const isPersistent = hasKv
