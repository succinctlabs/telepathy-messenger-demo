import { CHAINS } from "@/content/chains";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import { CaretDown, CaretUp } from "phosphor-react";
import { forwardRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import styles from "./ChainSelector.module.css";

const ChainSelectorChain = (props: {
  chain: string;
  active?: boolean;
  onClick?: () => void;
}) => {
  const { chain, active } = props;
  console.log(chain, active);
  return (
    <div
      className={twMerge(
        "w-full flex items-center justify-center h-[50px] z-10 cursor-pointer",
        active && "bg-succinct-teal-30"
      )}
      // Prop spreading so Menu.Item passes props correctly
      {...props}
    >
      <Image
        src={`/svgs/chains/${chain}.svg`}
        height={50}
        width={160}
        alt={`${chain} logo`}
        style={{ maxHeight: "35px" }}
      />
    </div>
  );
};

export default function ChainSelector({
  name,
  defaultChain,
}: {
  name: string;
  defaultChain?: string;
}) {
  const [selected, setSelected] = useState(defaultChain || "mainnet");

  return (
    <Menu as="div" className="relative w-full">
      <Menu.Button className="w-full">
        <button
          className={twMerge(
            styles.sendChainSelect,
            styles.sendChainSelectFrom,
            "w-full cursor-pointer"
          )}
        >
          <div className="py-4 flex flex-col items-center">
            <div className="flex flex-row items-center justify-center space-x-1">
              <span>{name}</span>
              <CaretDown />
            </div>
            <ChainSelectorChain chain={selected} />
          </div>
        </button>
      </Menu.Button>
      <Transition
        className={twMerge(
          "origin-top rounded-[40px] absolute left-0 top-0 w-full bg-succinct-teal-10 border-succinct-teal border z-10 overflow-hidden"
        )}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items>
          <div className="pb-4 flex flex-col items-center">
            <Menu.Item>
              <div className="pt-4 w-full flex flex-row items-center justify-center space-x-1 cursor-pointer">
                <span>{name}</span>
                <CaretUp />
              </div>
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <ChainSelectorChain chain={selected} active={active} />
              )}
            </Menu.Item>
            {CHAINS.filter((chain) => chain !== selected).map((chain) => (
              <Menu.Item key={chain}>
                {({ active }) => (
                  <ChainSelectorChain
                    chain={chain}
                    active={active}
                    onClick={() => setSelected(chain)}
                  />
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
