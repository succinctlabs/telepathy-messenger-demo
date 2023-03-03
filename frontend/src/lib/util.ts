import { ChainId } from "@/lib/chain";
import { SUBGRAPHS } from "@/lib/config";

export function addressToBytes32(address: string): string {
  return address.replace("0x", "0x000000000000000000000000");
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
