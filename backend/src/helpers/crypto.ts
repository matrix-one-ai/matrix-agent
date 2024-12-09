export function detectBlockchain(
  address: string
): "eth" | "solana" | "unknown" {
  // Ethereum address pattern
  const ethRegex = /^0x[a-fA-F0-9]{40}$/;

  // Solana address pattern (Base58 without 0, O, I, and l)
  const solRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

  if (ethRegex.test(address)) {
    return "eth";
  } else if (solRegex.test(address)) {
    return "solana";
  } else {
    return "unknown";
  }
}
