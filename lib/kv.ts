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

const memoryStore = new Map<string, unknown>()

type SimpleKv = {
  get<T>(key: string): Promise<T | null>
  set(key: string, value: unknown): Promise<unknown>
}

async function loadVercelKv(): Promise<SimpleKv> {
  const { kv } = await import('@vercel/kv')
  return kv
}

const memoryKv: SimpleKv = {
  async get<T>(key: string) {
    return memoryStore.has(key) ? (memoryStore.get(key) as T) : null
  },
  async set(key: string, value: unknown) {
    memoryStore.set(key, value)
    return 'OK'
  },
}

export const kv: SimpleKv = hasKv
  ? {
      async get(key) {
        return (await loadVercelKv()).get(key)
      },
      async set(key, value) {
        return (await loadVercelKv()).set(key, value)
      },
    }
  : memoryKv

export const isPersistent = hasKv
