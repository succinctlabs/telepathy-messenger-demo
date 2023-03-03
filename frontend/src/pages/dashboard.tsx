import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useAccount, useProvider } from "wagmi";

import { BackgroundDottedLine } from "@/components/BackgroundDottedLine/BackgroundDottedLine";
import Button from "@/components/Button";
import ChainSelector from "@/components/ChainSelector";
import { MessageRow } from "@/components/MessageRow";
import { MessagesTable } from "@/components/MessagesTable/MessagesTable";
import { SliderSelector } from "@/components/SliderSelector/SliderSelector";
import { useReceivedMessages, useSentMessages } from "@/hooks/mailbox";
import { SOURCE_CHAINS } from "@/lib";
import { ChainId } from "@/lib/chain";
import { graphSDK } from "@/lib/graphSDK";

export default function Dashboard() {
  const [selectedChain, setSelectedChain] = useState<ChainId | "all">("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewAll, setViewAll] = useState(false);

  const provider = useProvider();

  const account = useAccount();

  const [sentMessages, loadingSent, refreshSent] = useSentMessages(
    viewAll ? undefined : account.address,
    selectedChain === "all" ? undefined : selectedChain
  );

  console.log(sentMessages);

  const sentMsgHashes = useMemo(
    () => sentMessages.map((msg) => msg.msgHash),
    [sentMessages]
  );

  const [receivedMessages, loadingReceived, refreshReceived] =
    useReceivedMessages(
      sentMsgHashes,
      selectedChain === "all" ? undefined : selectedChain
    );

  useEffect(() => {
    async function test() {
      const res = await graphSDK.GetSentMessages(
        { count: 1 },
        { subgraphName: "succinctlabs/telepathy-goerli" }
      );
      console.log(res);
    }
    test();
  }, []);

  console.log(receivedMessages);

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
            <div className="flex flex-row space-x-2">
              <ChainSelector
                label="From"
                chains={SOURCE_CHAINS}
                selectedChain={selectedChain}
                setSelectedChain={setSelectedChain}
              >
                Goerli
              </ChainSelector>
              {account.address && (
                <SliderSelector state={viewAll} setState={setViewAll} />
              )}
            </div>
            <MessagesTable>
              {loadingSent &&
                Array.from(Array(9).keys()).map((_, i) => (
                  <td
                    key={i}
                    colSpan={6}
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
                    colSpan={6}
                    className="p-4 font-mono rounded-xl h-[56px]"
                  />
                ))}
              {!loadingSent && sentMessages.length === 0 && (
                <td>
                  <div className="absolute w-full h-full top-0 left-0 z-10 bg-gradient-to-b from-transparent to-succinct-black flex flex-col space-y-4 items-center justify-center">
                    <h2 className="text-3xl">No messages yet</h2>
                    <Link href="/">
                      <Button size="xl">Send a message</Button>
                    </Link>
                  </div>
                </td>
              )}

              {!loadingSent &&
                sentMessages.map((message) => (
                  <MessageRow
                    sentMessage={message}
                    key={message.id}
                    receivedMessage={receivedMessages.get(message.msgHash)}
                  />
                ))}
            </MessagesTable>
          </div>
        </div>
      </div>
    </div>
  );
}
