// lib/web3.ts
import { createConfig, http } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'  // ← Added injected for MetaMask

// Chiliz Chain (Mainnet)
export const chiliz = {
  id: 88888,
  name: 'Chiliz Chain',
  nativeCurrency: { name: 'CHZ', symbol: 'CHZ', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.chiliz.com'] },
  },
  blockExplorers: {
    default: { name: 'ChilizScan', url: 'https://scan.chiliz.com' },
  },
} as const

// Chiliz Spicy Testnet (Best for testing)
export const chilizSpicy = {
  id: 88882,
  name: 'Chiliz Spicy Testnet',
  nativeCurrency: { name: 'CHZ', symbol: 'CHZ', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://spicy-rpc.chiliz.com'] },
  },
  blockExplorers: {
    default: { name: 'ChilizScan', url: 'https://testnet.chilizscan.com' },
  },
} as const

export const config = createConfig({
  chains: [chiliz, chilizSpicy],
  connectors: [
    // This detects MetaMask and other browser wallets automatically
    injected({
      target: 'metaMask',     // Prioritizes MetaMask
      shimDisconnect: true,   // Remembers connection state
    }),
    
    // Keep WalletConnect for mobile users
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
      showQrModal: true,
    }),
  ],
  transports: {
    [chiliz.id]: http(),
    [chilizSpicy.id]: http(),
  },
})