import { utils } from "ethers";
import { useEffect, useState } from "react";

import { SentMessage } from "@/../.graphclient";
import { ContractId, CONTRACTS, SOURCE_CHAINS, SUBGRAPHS } from "@/lib";
import { ChainId } from "@/lib/chain";
import { graphSDK } from "@/lib/graphSDK";
import { addressToBytes32 } from "@/lib/util";

async function getMessages(chain: ChainId, count: number, sender?: string) {
  const subgraphName = SUBGRAPHS[chain];
  const mailboxAddress = CONTRACTS[ContractId.CrossChainMailbox][chain];
  if (!subgraphName || !mailboxAddress) {
    throw new Error("Chain not supported");
  }
  const res = await graphSDK.GetSentMessages(
    {
      where: {
        messageReceiver: addressToBytes32(mailboxAddress),
        messageSender: sender,
      },
      count,
    },
    { subgraphName }
  );
  return res.sentMessages;
}

const PAGE_SIZE = 20;

export type EnrichedMessage = SentMessage & { messageString: string };

// Will eventually fetch telepathy message status
export function useEnrichedMessage(
  message: SentMessage
): SentMessage | EnrichedMessage {
  const [enriched, setEnriched] = useState<EnrichedMessage | null>(null);
  useEffect(() => {
    setEnriched({
      ...message,
      messageString: utils.toUtf8String(message.message),
    });
  }, [message]);
  return enriched || message;
}

export function useSentMessages(sender?: string, chain?: ChainId) {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<SentMessage[]>([]);

  async function loadChain(chain: ChainId) {
    const res = await getMessages(chain, PAGE_SIZE, sender);
    setMessages((prev) =>
      [...prev, ...res].sort((a, b) => b.blockNumber - a.blockNumber)
    );
    console.log(messages);
  }

  async function loadAll() {
    await Promise.all(SOURCE_CHAINS.map(loadChain));
  }

  async function refresh() {
    setLoading(true);
    setMessages([]);
    if (chain) {
      await loadChain(chain);
    } else {
      await loadAll();
    }
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, [sender, chain]);

  return [messages.slice(0, PAGE_SIZE), loading, refresh] as const;
}
