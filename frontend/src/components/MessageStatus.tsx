import { Check, CircleNotch, WarningCircle } from "phosphor-react";
import { ReactNode } from "react";

import { ExecutedMessage, ExecutionStatus } from "@/lib/types";
import { getExplorerUrl } from "@/lib/util";

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
        <span className="underline">Delivered</span>
      </span>
    </a>
  );
}

function StatusWaiting({ children }: { children: ReactNode }) {
  return (
    <span className="text-succinct-teal flex flex-row items-center space-x-2">
      <CircleNotch
        className="animate-spin min-w-[20px]"
        weight="bold"
        size={20}
      />
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
        <span className="underline">Unknown</span>
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

export function MessageStatus({
  executionStatus,
  executedMessage,
}: {
  executionStatus: ExecutionStatus | null | undefined;
  executedMessage: ExecutedMessage | null;
}) {
  const executedMessageUrl =
    executedMessage !== null && executedMessage?.transactionHash !== undefined
      ? getExplorerUrl(
          executedMessage.messageReceiverChainID,
          "/tx/" + executedMessage.transactionHash
        )
      : "#";

  const StatusComponent = executionStatus ? STATUS_MAP[executionStatus] : null;
  return StatusComponent ? (
    <StatusComponent href={executedMessageUrl} />
  ) : (
    <></>
  );
}
