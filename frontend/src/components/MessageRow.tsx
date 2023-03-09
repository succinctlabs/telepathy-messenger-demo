import { utils } from "ethers";
import {
  CaretDown,
  CaretUp,
  Check,
  CircleNotch,
  WarningCircle,
} from "phosphor-react";
import { Fragment, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import Button from "@/components/Button";
import { ChainId } from "@/lib/chain";
import { ExecutedMessage, ExecutionStatus, SentMessage } from "@/lib/types";
import { getExplorerUrl, shortenAddress, titlecase } from "@/lib/util";

const STATUS_MAP: Record<ExecutionStatus, React.ElementType> = {
  [ExecutionStatus.WAITING_SLOT_FINALITY]: StatusWaitingSlotFinality,
  [ExecutionStatus.WAITING_LIGHT_CLIENT_UPDATE]: StatusWaitingLightClient,
  [ExecutionStatus.WAITING_SAFETY_DELAY]: StatusWaitingSafetyDelay,
  [ExecutionStatus.WAITING_RELAYER]: StatusWaitingRelayer,
  [ExecutionStatus.EXECUTED_SUCCESS]: StatusExecutedSuccess,
  [ExecutionStatus.EXECUTED_FAIL]: StatusExecutedFail,
  [ExecutionStatus.UNKNOWN]: StatusUnknown,
};

function StatusExecutedSuccess({ href = "#" }: { href?: string }) {
  return (
    <a href={href} target="_blank">
      <span className="text-succinct-teal-50 flex flex-row items-center space-x-2">
        <Check weight="bold" size={20} />
        <span>Delivered</span>
      </span>
    </a>
  );
}

function StatusWaiting({ children }: { children: ReactNode }) {
  return (
    <span className="text-succinct-teal flex flex-row items-center space-x-2">
      <CircleNotch className="animate-spin" weight="bold" size={20} />
      <span>{children}</span>
    </span>
  );
}

function StatusWaitingLightClient({ href }: { href?: string }) {
  return <StatusWaiting>Waiting for light client update</StatusWaiting>;
}

function StatusWaitingSlotFinality({ href }: { href?: string }) {
  return <StatusWaiting>Waiting for slot to finalize</StatusWaiting>;
}

function StatusWaitingSafetyDelay({ href }: { href?: string }) {
  return <StatusWaiting>Waiting for safety threshold</StatusWaiting>;
}

function StatusWaitingRelayer({ href }: { href?: string }) {
  return <StatusWaiting>Waiting for relayer</StatusWaiting>;
}

function StatusUnknown({ href }: { href?: string }) {
  return (
    <a href={href} target="_blank">
      <span className="text-succinct-orange flex flex-row items-center space-x-2">
        <WarningCircle weight="bold" size={20} />
        <span>Unknown</span>
      </span>
    </a>
  );
}

function StatusExecutedFail({ href = "#" }: { href?: string }) {
  return (
    <a href={href} target="_blank">
      <span className="text-succinct-orange flex flex-row items-center space-x-2">
        <WarningCircle weight="bold" size={20} />
        <span>Failed</span>
      </span>
    </a>
  );
}

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

  const executedMessageUrl =
    executedMessage !== null && executedMessage?.transactionHash !== undefined
      ? getExplorerUrl(
          sentMessage.messageReceiverChainID,
          "/tx/" + executedMessage.transactionHash
        )
      : "#";

  const StatusComponent = executionStatus ? STATUS_MAP[executionStatus] : null;

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
        {StatusComponent ? <StatusComponent href={executedMessageUrl} /> : ""}
      </td>
      <td>
        <Button className="ring-offset-succinct-teal-5" onClick={onClick}>
          {selected ? <CaretUp weight="bold" /> : <CaretDown weight="bold" />}
        </Button>
      </td>
    </Fragment>
  );
}
