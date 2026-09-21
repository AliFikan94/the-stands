// Simulated Fan Token ownership check.
//
// TODO: replace with a real on-chain balance read against Chiliz Fan Token
// contracts (via the existing wagmi/viem config in lib/web3.ts) once
// contract addresses are available. Kept deterministic (hash of address+club)
// rather than random so a given wallet's verification result is stable
// across refreshes during testing.

function hash(input: string): number {
  let h = 0

  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(h, 31) + input.charCodeAt(i)) >>> 0
  }

  return h
}

export function simulateFanTokenBalance(address: string, club: string): number {
  const seed = hash(`${address.toLowerCase()}:${club.toUpperCase()}`)
  return seed % 400
}

export function isVerifiedHolder(
  address: string,
  club: string,
  threshold = 100
): boolean {
  return simulateFanTokenBalance(address, club) >= threshold
}
