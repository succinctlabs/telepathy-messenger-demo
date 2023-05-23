import Link from "next/link";
import { Info } from "phosphor-react";
import { Tooltip } from "react-tooltip";

export function StatusTooltip() {
  return (
    <>
      <Tooltip id="status-tooltip" clickable>
        <ul className="break-words font-sans font-normal text-base">
          <h2 className="font-bold">
            The steps for a message to land on the destination chain:
          </h2>
          <li>
            <b>Waiting for slot to finalize:</b> 64+ beacon chain slots must
            pass so the slot is finalized
          </li>
          <li>
            <b>Waiting for light client update:</b>{" "}
            <Link
              href="https://docs.telepathy.xyz/protocol/actors#operator"
              target="_blank"
              referrerPolicy="no-referrer"
              className="underline"
            >
              an operator
            </Link>{" "}
            must generate and submit a zkSNARK proof
          </li>
          <li>
            <b>Waiting for safety threshold:</b> must wait safety buffer of 2
            minutes
          </li>
          <li>
            <b>Waiting for relayer:</b>{" "}
            <Link
              href="https://docs.telepathy.xyz/protocol/actors#operator"
              target="_blank"
              referrerPolicy="no-referrer"
              className="underline"
            >
              a relayer
            </Link>{" "}
            must relay the message
          </li>
          <li>
            <b>Delivered:</b> success!
          </li>
          <Link
            href="https://docs.telepathy.xyz/protocol/overview"
            target="_blank"
            referrerPolicy="no-referrer"
            className="underline"
          >
            More info
          </Link>
        </ul>
      </Tooltip>
      <Info
        data-tooltip-id="status-tooltip"
        className="w-5 h-5 text-succinct-teal-50"
      />
    </>
  );
}
