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

import { SentMessage } from "@/../.graphclient";
import Button from "@/components/Button";
import { ChainId } from "@/lib/chain";
import { ExecutionStatus } from "@/lib/types";
import { getExplorerUrl, shortenAddress, titlecase } from "@/lib/util";

const STATUS_MAP: Record<ExecutionStatus, ReactNode> = {
  [ExecutionStatus.WAITING_SLOT_FINALITY]: (
    <StatusLoading>Waiting for slot to finalize</StatusLoading>
  ),
  [ExecutionStatus.WAITING_LIGHT_CLIENT_UPDATE]: (
    <StatusLoading>Waiting for light client update</StatusLoading>
  ),
  [ExecutionStatus.WAITING_SAFETY_DELAY]: (
    <StatusLoading>Waiting for safety threshold</StatusLoading>
  ),
  [ExecutionStatus.WAITING_RELAYER]: (
    <StatusLoading>Waiting for relayer</StatusLoading>
  ),
  [ExecutionStatus.EXECUTED_SUCCESS]: <StatusComplete>Complete</StatusComplete>,
  [ExecutionStatus.EXECUTED_FAIL]: <StatusError>Failed</StatusError>,
  [ExecutionStatus.UNKNOWN]: <StatusError>Unknown</StatusError>,
};

function StatusComplete({
  children,
  href = "#",
}: {
  children: ReactNode;
  href?: string;
}) {
  return (
    <a href={href} target="_blank">
      <span className="text-succinct-teal-50 flex flex-row items-center space-x-2">
        <Check weight="bold" size={20} />
        <span>{children}</span>
      </span>
    </a>
  );
}

function StatusLoading({ children }: { children: ReactNode }) {
  return (
    <span className="text-succinct-teal flex flex-row items-center space-x-2">
      <CircleNotch className="animate-spin" weight="bold" size={20} />
      <span>{children}</span>
    </span>
  );
}

function StatusError({ children }: { children: ReactNode }) {
  return (
    <span className="text-succinct-orange flex flex-row items-center space-x-2">
      <WarningCircle weight="bold" size={20} />
      <span>{children}</span>
    </span>
  );
}

export function MessageRow({
  selected,
  setSelected,
  index,
  sentMessage,
  executionStatus,
}: {
  selected: boolean;
  setSelected: (selected: number | null) => void;
  index: number;
  sentMessage: SentMessage;
  executionStatus?: ExecutionStatus;
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
      <td className="">{executionStatus ? STATUS_MAP[executionStatus] : ""}</td>
      <td>
        <Button className="ring-offset-succinct-teal-5" onClick={onClick}>
          {selected ? <CaretUp weight="bold" /> : <CaretDown weight="bold" />}
        </Button>
      </td>
    </Fragment>
  );
}
