// Ownership/minting and Fan Token verification are paused: user testing
// found the platform overwhelming, and the product direction now is to
// prove the core "get fans in a room to discuss" loop before asking anyone
// to think about chains or tokens. Wallet connect stays on - it's the
// intended on-ramp back into web3 once the core loop proves itself - but
// minting and token-gated verification are switched off here rather than
// deleted, so turning them back on later is a one-line change.
export const MINTING_ENABLED = false
export const FAN_TOKEN_VERIFICATION_ENABLED = false
