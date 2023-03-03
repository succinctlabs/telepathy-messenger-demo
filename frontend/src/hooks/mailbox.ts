import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { SentMessage } from "@/../.graphclient";
import { CONTRACTS } from "@/lib";
import { ChainId } from "@/lib/chain";
import { ContractId } from "@/lib/config";
import { ExecutionStatus } from "@/lib/types";
import { addressToBytes32 } from "@/lib/util";

async function getExecutionStatuses(
  sentMessages: SentMessage[]
): Promise<ExecutionStatus[]> {
  if (sentMessages.length === 0) {
    return [];
  }
  const res = await axios.post(
    process.env.NEXT_PUBLIC_TELEPATHY_FUNCTIONS_ENDPOINT +
      "/api/telepathy/getExecutionStatuses",
    { messages: sentMessages }
  );
  if (res.data.status !== "success") {
    throw new Error("Failed to get execution statuses", res.data);
  }
  return res.data.data;
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
          messageSender: sender,
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
  const currentPromise = useRef<Promise<ExecutionStatus[]> | null>(null);
  const [statuses, setStatuses] = useState<ExecutionStatus[]>([]);

  async function refresh() {
    setLoading(true);
    if (sentMessages.length === 0) {
      setStatuses([]);
      setLoading(false);
      return;
    }
    const promise = getExecutionStatuses(sentMessages);
    currentPromise.current = promise;
    const data = await promise;
    if (currentPromise.current === promise) {
      setStatuses(data);
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [sentMessages]);

  return [statuses, loading, refresh] as const;
}
