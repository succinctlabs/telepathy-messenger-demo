import { utils } from "ethers";
import { Check, CircleNotch, Spinner } from "phosphor-react";
import { Fragment, ReactNode } from "react";

import { ExecutedMessage, SentMessage } from "@/../.graphclient";
import { ChainId } from "@/lib/chain";
import { shortenAddress, titlecase } from "@/lib/util";

function StatusComplete() {
  return (
    <span className="text-succinct-teal-50 flex flex-row items-center space-x-2">
      <Check weight="bold" size={20} />
      <span>Complete</span>
    </span>
  );
}

function StatusLoading({ children }: { children: ReactNode }) {
  return (
    // <span className="text-succinct-teal-50 flex flex-row items-center space-x-2">
    //   <span className="animate-pulse">{children}</span>
    // </span>
    <span className="text-succinct-teal flex flex-row items-center space-x-2">
      <span className="animate-pulse">
        <CircleNotch className="animate-spin" size={20} />
      </span>
      <span>{children}</span>
    </span>
  );
}

export function MessageRow({
  sentMessage,
  receivedMessage,
}: {
  sentMessage: SentMessage;
  receivedMessage?: ExecutedMessage;
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
        <StatusLoading>Updating light client</StatusLoading>
        {/* <StatusLoading>Finalizing source block</StatusLoading> */}
      </td>
    </Fragment>
  );
}
