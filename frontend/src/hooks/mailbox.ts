import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";

import { CONTRACTS } from "@/lib";
import { ChainId } from "@/lib/chain";
import { ContractId } from "@/lib/config";
import { ExecutedMessage, ExecutionStatus, SentMessage } from "@/lib/types";
import { addressToBytes32 } from "@/lib/util";
import { useImmer } from "use-immer";

type ExecutionStatusesResult = readonly [
  ExecutionStatus[],
  (ExecutedMessage | null)[]
];

async function getExecutionStatuses(
  sentMessages: SentMessage[]
): Promise<ExecutionStatusesResult> {
  if (sentMessages.length === 0) {
    return [[], []];
  }
  const res = await axios.post(
    process.env.NEXT_PUBLIC_TELEPATHY_FUNCTIONS_ENDPOINT +
      "/api/telepathy/getExecutionStatuses",
    { messages: sentMessages, includeExecutedMessages: true }
  );
  if (res.data.status !== "success") {
    throw new Error("Failed to get execution statuses", res.data);
  }
  return [res.data.executionStatuses, res.data.executedMessages];
}

const PAGE_SIZE = 10;

export type EnrichedMessage = SentMessage & {
  executionStatus: ExecutionStatus;
};

async function getSentMessages(whereQuery: any, count: number) {
  const results = await axios.post(
    process.env.NEXT_PUBLIC_TELEPATHY_FUNCTIONS_ENDPOINT +
      "/api/telepathy/getSentMessages",
    {
      where: whereQuery,
      count,
    }
  );
  if (results.data.status !== "success") {
    throw new Error("Failed to get messages: " + results.data.message);
  }
  return results.data.data;
}

export function useSentMessages(sender?: string, sourceChain?: ChainId) {
  const [loading, setLoading] = useState(false);
  const currentPromise = useRef<Promise<SentMessage[]> | null>(null);
  const [messages, setMessages] = useState<SentMessage[]>([]);
  const [noMoreResults, setNoMoreResults] = useState(false);

  async function getMessages() {
    setMessages([]);
    const results = await getSentMessages(
      {
        messageSenderChainID: sourceChain?.toString(),
        transactionOrigin: sender,
        messageReceiver: addressToBytes32(
          CONTRACTS[ContractId.CrossChainMailbox] as string
        ),
      },
      PAGE_SIZE
    );
    if (results.length < PAGE_SIZE) {
      setNoMoreResults(true);
    }
    return results;
  }

  // Loads messages past a given message
  async function getMessagesAfter(oldestMessage: SentMessage) {
    // Same query as initial getMessages query, but with blockTimestamp < oldestMessage.blockTimestamp
    // To handle the rare case that there are more sentMessages in the same block as oldestMessage,
    // the OR query also includes messages that are same blockTimestamp + chainID but lower nonce
    const results = await getSentMessages(
      {
        and: [
          {
            messageSenderChainID: sourceChain?.toString(),
            transactionOrigin: sender,
            messageReceiver: addressToBytes32(
              CONTRACTS[ContractId.CrossChainMailbox] as string
            ),
          },
          {
            or: [
              { blockTimestamp_lt: oldestMessage.blockTimestamp },
              {
                and: [
                  { blockTimestamp: oldestMessage.blockTimestamp },
                  {
                    messageSenderChainID: oldestMessage.messageSenderChainID,
                  },
                  { messageNonce_lt: oldestMessage.messageNonce },
                ],
              },
            ],
          },
        ],
      },
      PAGE_SIZE
    );
    if (results.length < PAGE_SIZE) {
      setNoMoreResults(true);
    }
    return results;
  }

  async function refresh() {
    setMessages([]);
    setNoMoreResults(false);
    const promise = getMessages();
    currentPromise.current = promise;
    setLoading(true);
    const data = await promise;
    if (currentPromise.current === promise) {
      setMessages(data);
      setLoading(false);
    }
  }

  async function loadMore() {
    if (messages.length === 0) {
      return;
    }
    const promise = getMessagesAfter(messages[messages.length - 1]);
    currentPromise.current = promise;
    setLoading(true);
    const data = await promise;
    if (currentPromise.current === promise) {
      setMessages((oldMessages) => [...oldMessages, ...data]);
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [sender, sourceChain]);

  return [messages, loading, refresh, loadMore, noMoreResults] as const;
}

/**
 * Load the corresponding ExecutionStatuses that correspond to the SentMessages
 * @returns [executionStatuses, executedMessages, isLoading, reset]
 */
export function useExecutionStatuses(sentMessages: SentMessage[]) {
  const [loading, setLoading] = useState(false);
  // Using a cache so that if we load a new page of messages, we only
  // need to fetch the statuses for the new messages
  const [cache, updateCache] = useImmer(
    new Map<string, [ExecutionStatus | null, ExecutedMessage | null]>()
  );
  const currentPromise = useRef<Promise<ExecutionStatusesResult> | null>(null);

  async function load() {
    setLoading(true);
    if (sentMessages.length === 0) {
      setLoading(false);
      return;
    }
    const messagesToFetch = sentMessages.filter(
      (message) => !cache.has(message.msgHash)
    );
    const promise = getExecutionStatuses(messagesToFetch);
    currentPromise.current = promise;
    const promiseResult = await promise;
    if (currentPromise.current === promise) {
      updateCache((draft) =>
        promiseResult[0].forEach((status, i) =>
          draft.set(messagesToFetch[i].msgHash, [status, promiseResult[1][i]])
        )
      );
      setLoading(false);
    }
  }

  const executionStatuses = useMemo(
    () => sentMessages.map((message) => cache.get(message.msgHash)?.[0]),
    [sentMessages, cache]
  );
  const executedMessages = useMemo(
    () =>
      sentMessages.map((message) => cache.get(message.msgHash)?.[1] || null),
    [sentMessages, cache]
  );

  // Delete the cache. We want to do this when we refresh all messages
  // so the statuses are refreshed in case they changed.
  async function reset() {
    updateCache((draft) => draft.clear());
  }

  useEffect(() => {
    load();
  }, [sentMessages]);

  return [executionStatuses, executedMessages, loading, reset] as const;
}
