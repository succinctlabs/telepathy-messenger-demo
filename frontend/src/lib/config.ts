import { ChainId } from "./chain";

export const CHAIN_MAP: Partial<Record<ChainId, ChainId[]>> = {
  // [ChainId.Goerli]: [ChainId.Gnosis],
  [ChainId.Gnosis]: [ChainId.Goerli],
  [ChainId.Mainnet]: [
    ChainId.Arbitrum,
    ChainId.Avalanche,
    ChainId.Binance,
    ChainId.Gnosis,
    ChainId.Goerli,
    ChainId.Optimism,
    ChainId.Polygon,
  ],
};

// Object.keys returns a string[], so we need to cast it to a number[]
export const SOURCE_CHAINS = Object.keys(CHAIN_MAP).map((n) =>
  parseInt(n)
) as unknown[] as ChainId[];

export const TARGET_CHAINS = Array.from(
  new Set(Object.values(CHAIN_MAP).flat())
);

export const ALL_CHAINS = Array.from(
  new Set(SOURCE_CHAINS.concat(TARGET_CHAINS))
) as ChainId[];

export enum ContractId {
  TelepathyRouter = "TelepathyRouter",
  CrossChainMailer = "CrossChainMailer",
  CrossChainMailbox = "CrossChainMailbox",
}

export const CONTRACTS: Record<ContractId, string> = {
  [ContractId.TelepathyRouter]: "0x41EA857C32c8Cb42EEFa00AF67862eCFf4eB795a",
  [ContractId.CrossChainMailbox]: "0xf8f0929809fe4c73248c27da0827c98bbe243fcc",
  [ContractId.CrossChainMailer]: "0xa3b31028893c20beaa882d1508fe423aca4a70e5",
};

export const SUBGRAPHS: Partial<Record<ChainId, string>> = {
  [ChainId.Goerli]: "succinctlabs/telepathy-goerli",
  [ChainId.Gnosis]: "succinctlabs/telepathy-gnosis",
  [ChainId.Polygon]: "succinctlabs/telepathy-polygon",
};

export const EXPLORERS: Partial<Record<ChainId, string>> = {
  [ChainId.Mainnet]: "https://etherscan.io",
  [ChainId.Goerli]: "https://goerli.etherscan.io",
  [ChainId.Gnosis]: "https://gnosisscan.io",
  [ChainId.Polygon]: "https://polygonscan.com",
  [ChainId.Arbitrum]: "https://arbiscan.io",
  [ChainId.Avalanche]: "https://snowtrace.io",
  [ChainId.Binance]: "https://bscscan.com",
  [ChainId.Optimism]: "https://optimistic.etherscan.io",
};
