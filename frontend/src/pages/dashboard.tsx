import { Tab } from "@headlessui/react";
import { utils } from "ethers/lib";
import Link from "next/link";
import { Check } from "phosphor-react";
import { Fragment, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useAccount, useProvider } from "wagmi";

import { BackgroundDottedLine } from "@/components/BackgroundDottedLine/BackgroundDottedLine";
import Button from "@/components/Button";
import ChainSelector from "@/components/ChainSelector";
import { MessagesTable } from "@/components/MessagesTable/MessagesTable";
import { SliderSelector } from "@/components/SliderSelector/SliderSelector";
import { useSentMessages } from "@/hooks/mailbox";
import { SOURCE_CHAINS } from "@/lib";
import { ChainId } from "@/lib/chain";
import { shortenAddress } from "@/lib/util";

export default function Dashboard() {
  const [selectedChain, setSelectedChain] = useState<ChainId | "all">("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewAll, setViewAll] = useState(false);

  const provider = useProvider();

  const account = useAccount();

  const [messages, loading, refreshMessages] = useSentMessages(
    viewAll ? undefined : account.address,
    selectedChain === "all" ? undefined : selectedChain
  );

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="w-full">
        <div>
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <div className="text-succinct-teal-50 font-mono text-sm">
              DASHBOARD
            </div>
            <Tab.List as="div" className="flex flex-row space-x-6">
              <Tab
                as="h2"
                className={twMerge(
                  "text-3xl mt-2 cursor-pointer focus:outline-none transition-opacity",
                  selectedIndex !== 0 && "opacity-50"
                )}
              >
                Sent
              </Tab>
              <Tab
                as="h2"
                className={twMerge(
                  "text-3xl mt-2 cursor-pointer focus:outline-none transition-opacity",
                  selectedIndex !== 1 && "opacity-50"
                )}
              >
                Received
              </Tab>
            </Tab.List>
            <BackgroundDottedLine />
            <Tab.Panels>
              <Tab.Panel className="relative">
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
                <MessagesTable
                  colNames={["FROM", "MESSAGE", "STATUS", "TRANSACTION"]}
                >
                  {loading &&
                    Array.from(Array(9).keys()).map((_, i) => (
                      <td
                        key={i}
                        colSpan={4}
                        className="p-4 font-mono rounded-xl h-[56px]
                        relative before:absolute before:inset-0 before:-translate-x-full
                        before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r
                        before:from-transparent before:via-succinct-teal-10 before:to-transparent
                        overflow-hidden"
                      />
                    ))}
                  {loading && (
                    <td>
                      <div className="absolute w-full h-full top-0 left-0 z-10 bg-gradient-to-b from-transparent to-succinct-black flex flex-col space-y-4 items-center justify-center">
                        {/* <h2 className="text-3xl">Loading messages...</h2> */}
                      </div>
                    </td>
                  )}

                  {!loading &&
                    messages.length === 0 &&
                    Array.from(Array(9).keys()).map((_, i) => (
                      <td
                        key={i}
                        colSpan={4}
                        className="p-4 font-mono rounded-xl h-[56px]"
                      />
                    ))}
                  {!loading && messages.length === 0 && (
                    <td>
                      <div className="absolute w-full h-full top-0 left-0 z-10 bg-gradient-to-b from-transparent to-succinct-black flex flex-col space-y-4 items-center justify-center">
                        <h2 className="text-3xl">No messages yet</h2>
                        <Link href="/">
                          <Button size="xl">Send a message</Button>
                        </Link>
                      </div>
                    </td>
                  )}

                  {!loading &&
                    messages.map((message) => (
                      <Fragment key={message.id}>
                        <td className="font-mono whitespace-nowrap">
                          {shortenAddress(message.messageSender)}
                        </td>
                        <td className="text-succinct-teal whitespace-nowrap max-w-[690px] text-ellipsis overflow-hidden">
                          {utils.toUtf8String(message.messageData)}
                        </td>
                        <td className="">
                          <span className="text-succinct-teal-50 flex flex-row items-center space-x-2">
                            <Check size={20} />
                            <span>Complete</span>
                          </span>
                        </td>
                        <td className="text-succinct-teal-50 font-mono">
                          {/* {shortenAddress(message.transactionHash)} */}
                          {message.transactionHash.slice(0, 20) + "…"}
                        </td>
                      </Fragment>
                    ))}
                </MessagesTable>
              </Tab.Panel>

              <Tab.Panel>
                <div className="flex flex-row space-x-2">
                  <SliderSelector state={viewAll} setState={setViewAll} />
                  <ChainSelector
                    label="From"
                    chains={SOURCE_CHAINS}
                    selectedChain={selectedChain}
                    setSelectedChain={setSelectedChain}
                  >
                    Goerli
                  </ChainSelector>
                </div>
                <MessagesTable
                  colNames={["FROM", "MESSAGE", "PROOF", "TRANSACTION"]}
                >
                  <>
                    <td className="font-mono">0x1a2b…0x3c4d</td>
                    <td className="text-succinct-teal">Hello world!</td>
                    <td className="text-succinct-teal-50 font-mono">
                      0x9a378d086c209b25b60...
                    </td>
                    <td className="text-succinct-teal-50 font-mono">
                      0x9a378d086c209b25b60...
                    </td>
                  </>
                  <>
                    <td className="font-mono">0x1a2b…0x3c4d</td>
                    <td className="text-succinct-teal">Hello world!</td>
                    <td className="text-succinct-teal-50 font-mono">
                      0x9a378d086c209b25b60...
                    </td>
                    <td className="text-succinct-teal-50 font-mono">
                      0x9a378d086c209b25b60...
                    </td>
                  </>
                  <>
                    <td className="font-mono">0x1a2b…0x3c4d</td>
                    <td className="text-succinct-teal">Hello world!</td>
                    <td className="text-succinct-teal-50 font-mono">
                      0x9a378d086c209b25b60...
                    </td>
                    <td className="text-succinct-teal-50 font-mono">
                      0x9a378d086c209b25b60...
                    </td>
                  </>
                  <>
                    <td className="font-mono">0x1a2b…0x3c4d</td>
                    <td className="text-succinct-teal">Hello world!</td>
                    <td className="text-succinct-teal-50 font-mono">
                      0x9a378d086c209b25b60...
                    </td>
                    <td className="text-succinct-teal-50 font-mono">
                      0x9a378d086c209b25b60...
                    </td>
                  </>
                  <>
                    <td className="font-mono">0x1a2b…0x3c4d</td>
                    <td className="text-succinct-teal max-w-[500px] overflow-hidden whitespace-nowrap text-ellipsis">
                      This is a longer message with more words, longer message
                      with more words, longer message with more words, longer
                      message with more words
                    </td>
                    <td className="text-succinct-teal-50 font-mono">
                      0x9a378d086c209b25b60...
                    </td>
                    <td className="text-succinct-teal-50 font-mono">
                      0x9a378d086c209b25b60...
                    </td>
                  </>
                </MessagesTable>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}
