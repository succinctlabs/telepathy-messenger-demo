import { formatDistanceToNowStrict } from "date-fns";
import { utils } from "ethers";
import { twMerge } from "tailwind-merge";

import { MessageStatus } from "@/components/MessageStatus";
import { StatusTooltip } from "@/components/StatusTooltip";
import { ChainId } from "@/lib/chain";
import { ExecutedMessage, ExecutionStatus, SentMessage } from "@/lib/types";
import { getExplorerUrl } from "@/lib/util";

export function MobileMessage({
  sentMessage,
  executionStatus,
  executedMessage,
}: {
  sentMessage: SentMessage;
  executionStatus: ExecutionStatus | null | undefined;
  executedMessage: ExecutedMessage | null;
}) {
  return (
    <div className="rounded-xl bg-succinct-teal-5 border border-succinct-teal-20">
      {/* {sentMessages[0].messageSender} */}
      <div
        className={twMerge(
          "p-4 border-b-succinct-teal-20 border-b rounded-t-xl flex flex-row justify-between flex-wrap gap-2"
          //   "text-succinct-black bg-succinct-teal"
        )}
      >
        <div className="flex flex-row flex-wrap gap-1.5">
          <span>
            <span className="capitalize">
              {ChainId.toName(sentMessage.messageSenderChainID)}
            </span>{" "}
            to{" "}
            <span className="capitalize">
              {ChainId.toName(sentMessage.messageReceiverChainID)}
            </span>
          </span>
          <a
            href={getExplorerUrl(
              sentMessage.messageSenderChainID,
              "/tx/" + sentMessage.transactionHash
            )}
            target="_blank"
            className="underline"
          >
            {formatDistanceToNowStrict(
              new Date(parseInt(sentMessage.blockTimestamp) * 1000),
              {
                addSuffix: true,
              }
            )}
          </a>
        </div>
        <div className="flex flex-row items-center gap-2">
          <MessageStatus
            executionStatus={executionStatus}
            executedMessage={executedMessage}
          />
          <StatusTooltip />
        </div>
      </div>
      <pre className="whitespace-pre-wrap p-4 overflow-auto break-words">
        {utils.toUtf8String(sentMessage.messageData)}
      </pre>
    </div>
  );
}
