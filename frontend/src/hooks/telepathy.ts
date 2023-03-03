import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useImmer } from "use-immer";

import { CHAIN_MAP, SOURCE_CHAINS } from "@/lib";
import { ChainId } from "@/lib/chain";
import { graphSDK } from "@/lib/graphSDK";
import { getConsensusRpc, getSubgraphName } from "@/lib/util";

async function slotToBlockNumber(
  chain: ChainId,
  slot: number
): Promise<number> {
  return (
    await axios.get(
      process.env.NEXT_PUBLIC_TELEPATHY_FUNCTIONS_ENDPOINT +
        `/api/slotBlockNumbers/${chain}/slot/${slot}`
    )
  ).data.result;
}

export function useSlotToBlockNumber(chain: ChainId, slot: number) {
  return useMemo(
    async () =>
      (
        await axios.get(
          process.env.NEXT_PUBLIC_TELEPATHY_FUNCTIONS_ENDPOINT +
            `/api/slotBlockNumbers/${chain}/slot/${slot}`
        )
      ).data.result,
    [chain, slot]
  );
}

async function getLatestHeadUpdates(sourceChain: ChainId) {
  const chains = CHAIN_MAP[sourceChain];
  if (chains === undefined) {
    throw new Error("Chain not supported");
  }
  const promises = chains.map(async (chain: ChainId) => {
    const res = await graphSDK.GetHeadUpdates(
      {
        where: { chainId: sourceChain },
        first: 1,
        skip: 0,
      },
      { subgraphName: getSubgraphName(chain) }
    );
    return parseInt(res.headUpdates[0].slot);
  });
  const slotNumbers = await Promise.all(promises);
  const blockNumbers = await axios.post(
    process.env.NEXT_PUBLIC_TELEPATHY_FUNCTIONS_ENDPOINT +
      `/api/slotBlockNumbers/${sourceChain}/batch`,
    {
      slots: slotNumbers,
    }
  );
  return new Map(
    chains.map((chain, idx) => [chain, blockNumbers.data[idx] as number])
  );
}

// Gets the latest head updates on each destination chain, then calculates the corresponding block number from slot number
export function useLatestHeadUpdates() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useImmer<Map<ChainId, Map<ChainId, number>>>(
    new Map()
  );
  async function refresh() {
    setLoading(true);
    await Promise.all(
      SOURCE_CHAINS.map(async (sourceChain) => {
        const res = await getLatestHeadUpdates(sourceChain);
        setResults((draft) => {
          draft.set(sourceChain, res);
        });
      })
    );
    setLoading(false);
  }
  useEffect(() => {
    refresh();
  }, []);
  return [results, loading, refresh] as const;
}

async function getLastFinalizedSlot(sourceChain: ChainId) {
  const res = await axios.get(
    getConsensusRpc(sourceChain) + "eth/v1/beacon/headers/finalized"
  );
  return parseInt(res.data.data.header.message.slot);
}

export function useLastFinalizedSlots(): number | null {
  const [slot, setSlot] = useState<number | null>(null);
  useEffect(() => {
    async function fetchNodeData() {
      setSlot(null);
      const res = await fetch(
        getConsensusRpc(sourceChain) + "eth/v1/beacon/headers/finalized"
      );
      const json = await res.json();
      setSlot(parseInt(json.data.header.message.slot));
    }
    fetchNodeData();
  }, [sourceChain]);
  return slot;
}
