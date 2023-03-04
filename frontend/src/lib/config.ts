import { ChainId } from "./chain";

export const CHAIN_MAP: Partial<Record<ChainId, ChainId[]>> = {
  [ChainId.Goerli]: [ChainId.Gnosis, ChainId.Polygon],
  [ChainId.Gnosis]: [ChainId.Goerli, ChainId.Polygon],
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

export const CONTRACTS: Record<
  ContractId,
  string | Partial<Record<ChainId, string>>
> = {
  [ContractId.TelepathyRouter]: {
    [ChainId.Goerli]: "0x68cb68162524661Ae764112726A7e494a0848f23",
    [ChainId.Gnosis]: "0x68cb68162524661Ae764112726A7e494a0848f23",
    [ChainId.Polygon]: "0x68cb68162524661Ae764112726A7e494a0848f23",
  },
  [ContractId.CrossChainMailbox]: "0x18043308b8Dc2AaC4f4a94BD027A10daEF0199F9",
  [ContractId.CrossChainMailer]: "0x2f071e002e1B008CFb2AA0Ff78cd83B215cC6ce0",
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
