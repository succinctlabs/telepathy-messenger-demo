import { utils } from "ethers";
import { CaretDown, CaretUp } from "phosphor-react";
import { Fragment } from "react";
import { twMerge } from "tailwind-merge";

import Button from "@/components/Button";
import { MessageStatus } from "@/components/MessageStatus";
import { ChainId } from "@/lib/chain";
import { ExecutedMessage, ExecutionStatus, SentMessage } from "@/lib/types";
import { getExplorerUrl, shortenAddress, titlecase } from "@/lib/util";

export function MessageRow({
  selected,
  setSelected,
  index,
  sentMessage,
  executionStatus,
  executedMessage,
}: {
  selected: boolean;
  setSelected: (selected: number | null) => void;
  index: number;
  sentMessage: SentMessage;
  executionStatus?: ExecutionStatus;
  executedMessage: ExecutedMessage | null;
}) {
  const onClick = () => {
    setSelected(selected ? null : index);
  };

  return (
    <Fragment>
      <td className="font-mono whitespace-nowrap">
        {shortenAddress(sentMessage.transactionOrigin)}
      </td>
      <td className="font-mono whitespace-nowrap">
        {titlecase(ChainId.toName(sentMessage.messageSenderChainID))}
      </td>
      <td className="font-mono whitespace-nowrap">
        {titlecase(ChainId.toName(sentMessage.messageReceiverChainID))}
      </td>
      <td
        className={twMerge(
          "text-succinct-teal overflow-hidden break-words",
          !selected && "text-ellipsis whitespace-nowrap"
        )}
      >
        {utils.toUtf8String(sentMessage.messageData)}
      </td>
      <td className="text-succinct-teal-50 font-mono whitespace-nowrap text-ellipsis overflow-hidden">
        <a
          href={getExplorerUrl(
            sentMessage.messageSenderChainID,
            "/tx/" + sentMessage.transactionHash
          )}
          className="underline"
          target="_blank"
          title={sentMessage.transactionHash}
        >
          {sentMessage.transactionHash}
        </a>
      </td>
      <td className="">
        <MessageStatus
          executionStatus={executionStatus}
          executedMessage={executedMessage}
        />
      </td>
      <td>
        <Button className="ring-offset-succinct-teal-5" onClick={onClick}>
          {selected ? <CaretUp weight="bold" /> : <CaretDown weight="bold" />}
        </Button>
      </td>
    </Fragment>
  );
}
