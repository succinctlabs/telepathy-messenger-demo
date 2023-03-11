export enum ChainId {
  Mainnet = 1,
  Goerli = 5,
  Gnosis = 100,
  Optimism = 10,
  Binance = 56,
  Polygon = 137,
  Arbitrum = 42161,
  Avalanche = 43114,
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ChainId {
  export function fromName(name: string): ChainId {
    name = name.toLowerCase();
    const map = Object(ChainId);
    const lowercaseMap = Object.fromEntries(
      Object.entries(map).map(([k, v]) => [k.toLowerCase(), v])
    );
    return lowercaseMap[name] as ChainId;
  }

  export function toName(chainId: ChainId): string {
    const map = Object(ChainId);
    return map[chainId].toLowerCase();
  }

  export function getChains(): ChainId[] {
    const map = Object.keys(ChainId) as string[];
    return map.filter((x) => !isNaN(Number(x))).map((x: string) => Number(x));
  }
}
