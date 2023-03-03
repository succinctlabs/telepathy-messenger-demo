import { utils } from "ethers";
import { Check, CircleNotch, WarningCircle } from "phosphor-react";
import { Fragment, ReactNode } from "react";

import { SentMessage } from "@/../.graphclient";
import { ChainId } from "@/lib/chain";
import { ExecutionStatus } from "@/lib/types";
import { shortenAddress, titlecase } from "@/lib/util";

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

function StatusComplete({ children }: { children?: ReactNode }) {
  return (
    <span className="text-succinct-teal-50 flex flex-row items-center space-x-2">
      <Check weight="bold" size={20} />
      <span>{children}</span>
    </span>
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
  sentMessage,
  executionStatus,
}: {
  sentMessage: SentMessage;
  executionStatus?: ExecutionStatus;
}) {
  return (
    <Fragment>
      <td className="font-mono whitespace-nowrap">
        {shortenAddress(sentMessage.messageSender)}
      </td>
      <td className="font-mono whitespace-nowrap">
        {titlecase(ChainId.toName(sentMessage.messageSenderChainID))}
      </td>
      <td className="font-mono whitespace-nowrap">
        {titlecase(ChainId.toName(sentMessage.messageReceiverChainID))}
      </td>
      <td className="text-succinct-teal whitespace-nowrap text-ellipsis overflow-hidden">
        {utils.toUtf8String(sentMessage.messageData)}
      </td>
      <td className="text-succinct-teal-50 font-mono whitespace-nowrap text-ellipsis overflow-hidden">
        {/* {shortenAddress(message.transactionHash)} */}
        {sentMessage.transactionHash}
        {/* {receivedMessage?.transactionHash} */}
      </td>
      <td className="">
        {/* <span className="text-succinct-teal-50 flex flex-row items-center space-x-2">
          <Check weight="bold" size={20} />
          <span>Complete</span>
        </span> */}
        {/* <StatusComplete /> */}
        {/* <StatusLoading>Relaying transaction</StatusLoading> */}
        {/* <StatusLoading>Updating light client</StatusLoading> */}
        {/* <StatusLoading>{executionStatus}</StatusLoading> */}
        {/* <StatusLoading>Finalizing source block</StatusLoading> */}
        {executionStatus ? STATUS_MAP[executionStatus] : ""}
      </td>
    </Fragment>
  );
}
