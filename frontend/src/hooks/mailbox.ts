import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { CONTRACTS } from "@/lib";
import { ChainId } from "@/lib/chain";
import { ContractId } from "@/lib/config";
import { ExecutedMessage, ExecutionStatus, SentMessage } from "@/lib/types";
import { addressToBytes32 } from "@/lib/util";

type ExecutionStatusesResult = [ExecutionStatus[], (ExecutedMessage | null)[]];

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

const PAGE_SIZE = 20;

export type EnrichedMessage = SentMessage & {
  executionStatus: ExecutionStatus;
};

export function useSentMessages(sender?: string, sourceChain?: ChainId) {
  const [loading, setLoading] = useState(false);
  const currentPromise = useRef<Promise<SentMessage[]> | null>(null);
  const [messages, setMessages] = useState<SentMessage[]>([]);

  async function getMessages() {
    setMessages([]);
    const results = await axios.post(
      process.env.NEXT_PUBLIC_TELEPATHY_FUNCTIONS_ENDPOINT +
        "/api/telepathy/getSentMessages",
      {
        where: {
          messageSenderChainID: sourceChain?.toString(),
          transactionOrigin: sender,
          messageReceiver: addressToBytes32(
            CONTRACTS[ContractId.CrossChainMailbox] as string
          ),
        },
        count: PAGE_SIZE,
      }
    );
    if (results.data.status !== "success") {
      throw new Error("Failed to get messages: " + results.data.message);
    }
    return results.data.data;
  }

  async function refresh() {
    const promise = getMessages();
    currentPromise.current = promise;
    setLoading(true);
    const data = await promise;
    if (currentPromise.current === promise) {
      setMessages(data);
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [sender, sourceChain]);

  return [messages, loading, refresh] as const;
}

/**
 * Load the corresponding ExecutionStatuses that correspond to the SentMessages
 * @returns array of ExecutionStatus
 */
export function useExecutionStatuses(sentMessages: SentMessage[]) {
  const [loading, setLoading] = useState(false);
  const currentPromise = useRef<Promise<ExecutionStatusesResult> | null>(null);
  const [result, setResult] = useState<ExecutionStatusesResult>([[], []]);

  async function refresh() {
    setLoading(true);
    if (sentMessages.length === 0) {
      setResult([[], []]);
      setLoading(false);
      return;
    }
    const promise = getExecutionStatuses(sentMessages);
    currentPromise.current = promise;
    const data = await promise;
    if (currentPromise.current === promise) {
      setResult(data);
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [sentMessages]);

  return [result[0], result[1], loading, refresh] as const;
}
