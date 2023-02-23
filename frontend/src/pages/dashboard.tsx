import { BackgroundDottedLine } from "@/components/BackgroundDottedLine/BackgroundDottedLine";
import Button from "@/components/Button";
import ChainSelector from "@/components/ChainSelector";
import { SliderSelector } from "@/components/SliderSelector/SliderSelector";
import { Tab } from "@headlessui/react";
import Link from "next/link";
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
                <table className="w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr className="font-mono text-succinct-teal-50 text-left">
                      <th className="p-4">FROM</th>
                      <th className="p-4">MESSAGE</th>
                      <th className="p-4">PROOF</th>
                      <th className="p-4">TRANSACTION</th>
                    </tr>
                  </thead>
                  <tbody className="border-spacing-2">
                    {Array.from(Array(9).keys()).map((_, i) => (
                      <tr key={i} className="bg-succinct-teal-5">
                        <td
                          colSpan={4}
                          className="p-4 font-mono rounded-xl h-[56px]"
                        ></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="absolute w-full h-full top-0 left-0 z-10 bg-gradient-to-b from-transparent to-succinct-black flex flex-col space-y-4 items-center justify-center">
                  <h2 className="text-3xl">No messages yet</h2>
                  <Link href="/">
                    <Button size="xl">Send a message</Button>
                  </Link>
                </div>
              </Tab.Panel>

              <Tab.Panel>
                <div className="flex flex-row space-x-2">
                  <SliderSelector />
                  <ChainSelector label="From">Goerli</ChainSelector>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="font-mono text-succinct-teal-50 text-left">
                      <th className="p-4">FROM</th>
                      <th className="p-4">MESSAGE</th>
                      <th className="p-4">PROOF</th>
                      <th className="p-4">TRANSACTION</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    <tr className="bg-succinct-teal-5">
                      <td className="p-4 rounded-l-xl font-mono">
                        0x1a2b…0x3c4d
                      </td>
                      <td className="p-4 text-succinct-teal">Hello world!</td>
                      <td className="p-4 text-succinct-teal-50 font-mono">
                        0x9a378d086c209b25b60...
                      </td>
                      <td className="p-4 text-succinct-teal-50 font-mono rounded-r-xl">
                        0x9a378d086c209b25b60...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}
