import Link from "next/link";
import { ArrowClockwise } from "phosphor-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useAccount } from "wagmi";

import { BackgroundDottedLine } from "@/components/BackgroundDottedLine/BackgroundDottedLine";
import Button from "@/components/Button";
import ChainSelector from "@/components/ChainSelector";
import { MessageRow } from "@/components/MessageRow";
import { MessagesTable } from "@/components/MessagesTable/MessagesTable";
import { SliderSelector } from "@/components/SliderSelector/SliderSelector";
import { useExecutionStatuses, useSentMessages } from "@/hooks/mailbox";
import { SOURCE_CHAINS } from "@/lib";
import { ChainId } from "@/lib/chain";

export default function Dashboard() {
  const [selectedChain, setSelectedChain] = useState<ChainId | "all">("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [viewAll, setViewAll] = useState(false);

  const account = useAccount();

  const [sentMessages, loadingSent, refreshSent] = useSentMessages(
    viewAll ? undefined : account.address,
    selectedChain === "all" ? undefined : selectedChain
  );

  const [executionStatuses, loadingStatuses] =
    useExecutionStatuses(sentMessages);

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="w-full">
        <div>
          <div className="text-succinct-teal-50 font-mono text-sm">
            DASHBOARD
          </div>
          <div>
            <h2 className={twMerge("text-3xl mt-2")}>Messages</h2>
          </div>
          <BackgroundDottedLine />
          <div className="relative">
            <div className="flex flex-row justify-between">
              <div className="flex flex-row space-x-2">
                <ChainSelector
                  label="From"
                  chains={SOURCE_CHAINS}
                  selectedChain={selectedChain}
                  setSelectedChain={setSelectedChain}
                />
                {account.address && (
                  <SliderSelector state={viewAll} setState={setViewAll} />
                )}
              </div>
              <div>
                <Button
                  className="h-[50px] w-[50px] ring-offset-succinct-teal-5"
                  onClick={refreshSent}
                  disabled={loadingSent || loadingStatuses}
                >
                  <ArrowClockwise weight="bold" size={"20px"} />
                </Button>
              </div>
            </div>
            <MessagesTable enableSelect>
              {loadingSent &&
                Array.from(Array(9).keys()).map((_, i) => (
                  <td
                    key={i}
                    colSpan={7}
                    className="p-4 font-mono rounded-xl h-[56px]
                        relative before:absolute before:inset-0 before:-translate-x-full
                        before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r
                        before:from-transparent before:via-succinct-teal-10 before:to-transparent
                        overflow-hidden"
                  />
                ))}
              {loadingSent && (
                <td>
                  <div className="absolute w-full h-full top-0 left-0 z-10 bg-gradient-to-b from-transparent to-succinct-black flex flex-col space-y-4 items-center justify-center">
                    {/* <h2 className="text-3xl">Loading messages...</h2> */}
                  </div>
                </td>
              )}

              {!loadingSent &&
                sentMessages.length === 0 &&
                Array.from(Array(9).keys()).map((_, i) => (
                  <td
                    key={i}
                    colSpan={7}
                    className="p-4 font-mono rounded-xl h-[56px]"
                  />
                ))}
              {!loadingSent && sentMessages.length === 0 && (
                <td>
                  <div className="absolute w-full h-full top-0 left-0 z-10 bg-gradient-to-b from-transparent to-succinct-black flex flex-col space-y-3 items-center justify-center">
                    <h2 className="text-3xl">No messages yet</h2>
                    <h6>New messages can take ~12 seconds to show up</h6>
                    <Link href="/">
                      <Button size="xl" className="ring-offset-succinct-teal-5">
                        Send a message
                      </Button>
                    </Link>
                  </div>
                </td>
              )}

              {!loadingSent &&
                sentMessages.map((message, idx) => (
                  <MessageRow
                    selected={selectedIndex === idx}
                    setSelected={setSelectedIndex}
                    index={idx}
                    sentMessage={message}
                    key={message.id}
                    executionStatus={executionStatuses[idx]}
                  />
                ))}
            </MessagesTable>
          </div>
        </div>
      </div>
    </div>
  );
}
