import { Info } from "phosphor-react";
import { Tooltip } from "react-tooltip";

export function StatusTooltip() {
  return (
    <>
      <Tooltip id="status-tooltip">
        <ul className="break-words font-sans font-normal text-base">
          <h2 className="font-bold">
            The steps for a message to land on the target chain:
          </h2>
          <li>
            <b>Waiting for slot to finalize:</b> 64+ beacon chain slots must
            pass so the slot is finalized (~13 min on mainnet)
          </li>
          <li>
            <b>Waiting for light client update:</b> an operator must generate
            and submit a zkSNARK proof (our operator currently runs every ~12
            minutes)
          </li>
          <li>
            <b>Waiting for safety threshold:</b> must wait safety buffer of 2
            minutes
          </li>
          <li>
            <b>Waiting for relayer:</b> a relayer must relay the message
          </li>
          <li>
            <b>Delivered:</b> success!
          </li>
        </ul>
      </Tooltip>
      <Info
        data-tooltip-id="status-tooltip"
        className="w-5 h-5 text-succinct-teal-50"
      />
    </>
  );
}
