export const CHAINS = [
  "mainnet",
  "goerli",
  "gnosis",
  "polygon",
  //   "optimism",
  //   "arbitrum",
  //   "avalanche",
  //   "bsc",
] as const;

export type Chain = typeof CHAINS[number];

export const ChainId: { [chain in Chain]: number } = {
  mainnet: 1,
  goerli: 5,
  gnosis: 100,
  polygon: 137,
};
