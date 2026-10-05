import { generateNonce } from 'siwe'
import { kv } from '@/lib/kv'

const NONCE_TTL_SECONDS = 5 * 60 // 5 minutes - just long enough to sign and submit

function nonceKey(nonce: string) {
  return `siwe-nonce:${nonce}`
}

/** Issues a fresh nonce and stores it so it can only be redeemed once. */
export async function issueNonce(): Promise<string> {
  const nonce = generateNonce()
  await kv.set(nonceKey(nonce), true, NONCE_TTL_SECONDS)
  return nonce
}

/** Single-use: a valid nonce is consumed immediately so it can't be replayed. */
export async function consumeNonce(nonce: string): Promise<boolean> {
  const valid = await kv.get<boolean>(nonceKey(nonce))
  if (!valid) return false

  await kv.del(nonceKey(nonce))
  return true
}
