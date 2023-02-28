export function addressToBytes32(address: string): string {
  return address.replace("0x", "0x000000000000000000000000");
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
