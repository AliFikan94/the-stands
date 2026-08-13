// contracts/abis/TheStandsBanterABI.ts
export const TheStandsBanterABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "content", "type": "string" },
      { "internalType": "string", "name": "ticker1", "type": "string" },
      { "internalType": "string", "name": "ticker2", "type": "string" },
      { "internalType": "string", "name": "mediaUri", "type": "string" }
    ],
    "name": "mintBanter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "tokenURI",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;