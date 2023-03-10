import { ChainId } from "@/lib/chain";
import { EXPLORERS, SUBGRAPHS } from "@/lib/config";

export function addressToBytes32(address: string): string {
  if (address.length === 42) {
    return address.replace("0x", "0x000000000000000000000000");
  } else {
    return address;
  }
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function titlecase(str: string): string {
  return str
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function getSubgraphName(chain: ChainId) {
  const subgraph = SUBGRAPHS[chain];
  if (!subgraph) {
    throw new Error(`No subgraph for chain ${chain}`);
  }
  return subgraph;
}

export function getConsensusRpc(chain: ChainId) {
  const rpc = process.env[`NEXT_PUBLIC_CONSENSUS_RPC_${chain}`];
  if (!rpc) {
    throw new Error(`No RPC for chain ${ChainId.toName(chain)}`);
  }
  return rpc;
}

export function getExplorerUrl(chain: ChainId, path: string) {
  let explorer = EXPLORERS[chain];
  if (!explorer) {
    explorer = "https://etherscan.io";
  }
  return `${explorer}${path}`;
}

export function getRandomElement<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}
