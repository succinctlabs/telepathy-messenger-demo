import { BackgroundDottedLine } from "@/components/BackgroundDottedLine/BackgroundDottedLine";
import ChainSelector from "@/components/ChainSelector";
import { MessagesTable } from "@/components/MessagesTable/MessagesTable";
import { SliderSelector } from "@/components/SliderSelector/SliderSelector";
import { Tab } from "@headlessui/react";
import { Check } from "phosphor-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function Dashboard() {
  const [selectedIndex, setSelectedIndex] = useState(0);
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
                <MessagesTable
                  colNames={["FROM", "MESSAGE", "STATUS", "TRANSACTION"]}
                >
                  {/* {Array.from(Array(9).keys()).map((_, i) => (
                    <td
                      key={i}
                      colSpan={4}
                      className="p-4 font-mono rounded-xl h-[56px]"
                    />
                  ))} */}

                  <>
                    <td className="font-mono">0x1a2b…0x3c4d</td>
                    <td className="text-succinct-teal">Hello world!</td>
                    <td className="">
                      {/* Waiting for block to finalize */}
                      {/* <span className="text-succinct-teal flex flex-row items-center space-x-2">
                        <Spinner className="animate-spin" size={20} />
                        <span>Finalizing source chain</span>
                      </span> */}
                      {/* Waiting for operator to step */}
                      {/* <span className="text-succinct-teal flex flex-row items-center space-x-2">
                        <Spinner className="animate-spin" size={20} />
                        <span>Generating proof</span>
                      </span> */}
                      {/* Waiting for relayer to relay */}
                      {/* <span className="text-succinct-teal flex flex-row items-center space-x-2">
                        <Spinner className="animate-spin" size={20} />
                        <span>Sending to target chain</span>
                      </span> */}
                      {/* Success */}
                      <span className="text-succinct-teal-50 flex flex-row items-center space-x-2">
                        <Check size={20} />
                        <span>Complete</span>
                      </span>
                      {/* ?? */}
                      {/* <span className="text-succinct-orange flex flex-row items-center space-x-2">
                        <WarningCircle size={20} />
                        <span>Error / Incomplete</span>
                      </span> */}
                    </td>
                    <td className="text-succinct-teal-50 font-mono">
                      0x9a378d086c209b25b60...
                    </td>
                  </>
                </MessagesTable>
                {/* <div className="absolute w-full h-full top-0 left-0 z-10 bg-gradient-to-b from-transparent to-succinct-black flex flex-col space-y-4 items-center justify-center">
                  <h2 className="text-3xl">No messages yet</h2>
                  <Link href="/">
                    <Button size="xl">Send a message</Button>
                  </Link>
                </div> */}
              </Tab.Panel>

              <Tab.Panel>
                <div className="flex flex-row space-x-2">
                  <SliderSelector />
                  <ChainSelector label="From">Goerli</ChainSelector>
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
