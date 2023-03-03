import { utils } from "ethers";
import { useEffect, useMemo, useRef, useState } from "react";
import { useImmer } from "use-immer";

import { ExecutedMessage, SentMessage } from "@/../.graphclient";
import { ContractId, CONTRACTS, SOURCE_CHAINS, SUBGRAPHS } from "@/lib";
import { ChainId } from "@/lib/chain";
import { graphSDK } from "@/lib/graphSDK";
import { addressToBytes32 } from "@/lib/util";

async function getSentMessages(
  chain: ChainId,
  count: number,
  sender?: string
): Promise<SentMessage[]> {
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

async function getExecutedMessages(
  msgHashes: string[],
  chain: ChainId
): Promise<ExecutedMessage[]> {
  const subgraphName = SUBGRAPHS[chain];
  if (!subgraphName) {
    throw new Error("Chain not supported");
  }
  if (msgHashes.length === 0) {
    return [];
  }
  const res = await graphSDK.GetExecutedMessages(
    {
      where: {
        msgHash_in: msgHashes,
      },
    },
    { subgraphName }
  );
  return res.executedMessages;
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
  const txHashes = useRef(new Set<string>());
  const [messages, setMessages] = useState<SentMessage[]>([]);

  async function loadChain(chain: ChainId) {
    const res = (await getSentMessages(chain, PAGE_SIZE, sender)).filter(
      (msg) => !txHashes.current.has(msg.transactionHash)
    );

    setMessages((prev) =>
      [...prev, ...res].sort((a, b) => b.blockTimestamp - a.blockTimestamp)
    );
    res.forEach((msg) => txHashes.current.add(msg.transactionHash));
  }

  async function loadAll() {
    await Promise.all(SOURCE_CHAINS.map(loadChain));
  }

  async function refresh() {
    setLoading(true);
    setMessages([]);
    txHashes.current = new Set();
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

  return [
    useMemo(() => messages.slice(0, PAGE_SIZE), [messages]),
    loading,
    refresh,
  ] as const;
}

/**
 * Load the corresponding ExecutedMessages that correspond to the SentMessages
 * @returns map of msgHash to ExecutedMessage, loading state, and refresh function
 */
export function useReceivedMessages(sentMsgHashes: string[], chain?: ChainId) {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useImmer<Map<string, ExecutedMessage>>(
    new Map()
  );
  async function loadChain(chain: ChainId) {
    const res = await getExecutedMessages(sentMsgHashes, chain);
    // setMessages(
    //   new Map<string, ExecutedMessage>(res.map((msg) => [msg.msgHash, msg]))
    // );
    setMessages((draft) => {
      for (const msg of res) {
        draft.set(msg.msgHash, msg);
      }
    });
  }

  async function loadAll() {
    await Promise.all(SOURCE_CHAINS.map(loadChain));
  }

  async function refresh() {
    setLoading(true);
    setMessages(new Map());
    if (chain) {
      await loadChain(chain);
    } else {
      await loadAll();
    }
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, [sentMsgHashes, chain]);

  return [messages, loading, refresh] as const;
}
