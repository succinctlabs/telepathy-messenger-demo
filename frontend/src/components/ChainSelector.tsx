import { Menu } from "@headlessui/react";
import { CaretDown } from "phosphor-react";
import { twMerge } from "tailwind-merge";

import { ChainId } from "@/lib/chain";

function ChainItem({
  chain,
  name,
  setSelectedChain,
}: {
  chain: ChainId | "all";
  name: string;
  setSelectedChain: (newSelection: ChainId | "all") => void;
}) {
  const onClick = () => {
    setSelectedChain(chain);
  };

  return (
    <Menu.Item>
      <div
        className="hover:bg-succinct-teal-20 p-2 cursor-pointer text-center capitalize"
        onClick={onClick}
      >
        {name}
      </div>
    </Menu.Item>
  );
}

// const sourceChains =

export default function ChainSelector({
  className,
  label,
  chains,
  selectedChain,
  setSelectedChain,
}: {
  className?: string;
  label: string;
  chains: ChainId[];
  selectedChain: ChainId | "all";
  setSelectedChain: (newSelection: ChainId | "all") => void;
}) {
  const options: (ChainId | "all")[] = ["all", ...chains];
  return (
    <Menu as="div" className="relative">
      <Menu.Button
        className={twMerge(
          "px-3 py-3 rounded-xl space-x-2 flex flex-row items-center border border-transparent focus:outline-none",
          "bg-succinct-teal-10 hover:bg-succinct-teal-20 text-succinct-teal",
          className
        )}
      >
        <span className="text-succinct-teal-50">{label}</span>
        <span className="capitalize">
          {selectedChain === "all" ? "All" : ChainId.toName(selectedChain)}
        </span>
        <CaretDown />
      </Menu.Button>
      <Menu.Items className="z-[99] w-full absolute right-0 mt-2 origin-top-right divide-y divide-succinct-teal-5 rounded-md bg-white shadow-lg focus:outline-none bg-succinct-teal-10 overflow-hidden">
        {options.map((chain) => (
          <ChainItem
            key={chain}
            chain={chain}
            name={chain === "all" ? chain : ChainId.toName(chain)}
            setSelectedChain={setSelectedChain}
          />
        ))}
      </Menu.Items>
    </Menu>
  );
}
