import NextAuth, { type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Twitter from 'next-auth/providers/twitter'
import { SiweMessage } from 'siwe'
import { consumeNonce } from '@/lib/auth/siwe-nonce'
import { consumeEmailOtp, normalizeEmail } from '@/lib/auth/email-otp'

const providers: NextAuthConfig['providers'] = [
  Credentials({
    id: 'wallet',
    name: 'Wallet',
    credentials: {
      message: { label: 'Message', type: 'text' },
      signature: { label: 'Signature', type: 'text' },
    },
    async authorize(credentials) {
      const rawMessage = credentials?.message
      const signature = credentials?.signature

      if (typeof rawMessage !== 'string' || typeof signature !== 'string') {
        return null
      }

      try {
        const siwe = new SiweMessage(JSON.parse(rawMessage))

        // The nonce is single-use and only valid if we actually issued it -
        // this is what stops a signed message from being replayed.
        const nonceOk = await consumeNonce(siwe.nonce)
        if (!nonceOk) return null

        const result = await siwe.verify({ signature })
        if (!result.success) return null

        return {
          id: siwe.address,
          name: `${siwe.address.slice(0, 6)}...${siwe.address.slice(-4)}`,
        }
      } catch {
        return null
      }
    },
  }),
  Credentials({
    id: 'email-otp',
    name: 'Email',
    credentials: {
      email: { label: 'Email', type: 'email' },
      code: { label: 'Code', type: 'text' },
    },
    async authorize(credentials) {
      const email = credentials?.email
      const code = credentials?.code

      if (typeof email !== 'string' || typeof code !== 'string') return null

      const valid = await consumeEmailOtp(email, code)
      if (!valid) return null

      const normalized = normalizeEmail(email)
      return { id: normalized, email: normalized, name: normalized }
    },
  }),
]

// X (Twitter) needs a real OAuth app - only register the provider when
// credentials are actually configured, so the app doesn't crash (or offer
// a dead button) before that's set up.
if (process.env.AUTH_TWITTER_ID && process.env.AUTH_TWITTER_SECRET) {
  providers.push(Twitter)
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: 'jwt' },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
