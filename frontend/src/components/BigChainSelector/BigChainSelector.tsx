import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import { CaretDown, CaretUp } from "phosphor-react";
import { forwardRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";

import styles from "./BigChainSelector.module.css";

import { ChainId } from "@/lib/chain";

type ChainItemProps = {
  chain: ChainId;
  active?: boolean;
  onClick?: () => void;
};
const ChainItem = forwardRef<HTMLDivElement, ChainItemProps>(
  (props: ChainItemProps, ref) => {
    const { chain, active } = props;
    const chainName = ChainId.toName(chain);
    return (
      <div
        className={twMerge(
          "w-full flex items-center justify-center h-[50px] z-10 cursor-pointer",
          active && "bg-succinct-teal-30"
        )}
        ref={ref}
        // Prop spreading so Menu.Item passes props correctly
        {...props}
      >
        <Image
          src={`/svgs/chains/${chainName}.svg`}
          height={50}
          width={140}
          alt={`${chainName} logo`}
          draggable={false}
          className="max-w-[80%] max-h-[35px]"
        />
      </div>
    );
  }
);
ChainItem.displayName = "ChainSelectorChain";

export default function BigChainSelector({
  name,
  chains,
  className,
  selectedChain,
  setSelectedChain,
}: {
  name: string;
  chains: ChainId[];
  className?: string;
  selectedChain: ChainId;
  setSelectedChain: (newSelection: ChainId) => void;
}) {
  useEffect(() => {
    if (!chains.includes(selectedChain)) {
      setSelectedChain(chains[0]);
    }
  }, [chains]);

  return (
    <div className={className}>
      <Menu as="div" className={twMerge("relative w-full")}>
        <Menu.Button
          className={twMerge(
            styles.sendChainSelect,
            name === "From"
              ? styles.sendChainSelectFrom
              : styles.sendChainSelectTo,
            "w-full cursor-pointer select-none"
          )}
        >
          <div className="py-4 flex flex-col items-center">
            <div className="flex flex-row items-center justify-center space-x-1">
              <span>{name}</span>
              <CaretDown />
            </div>
            <ChainItem chain={selectedChain} />
          </div>
        </Menu.Button>
        <Transition
          className={twMerge(
            "origin-top rounded-[40px] absolute left-0 top-0 w-full bg-succinct-teal-10 border-succinct-teal border z-10 overflow-hidden select-none"
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
                  <ChainItem chain={selectedChain} active={active} />
                )}
              </Menu.Item>
              {chains
                .filter((chain) => chain !== selectedChain)
                .map((chain) => (
                  <Menu.Item key={chain}>
                    {({ active }) => (
                      <ChainItem
                        chain={chain}
                        active={active}
                        onClick={() => setSelectedChain(chain)}
                      />
                    )}
                  </Menu.Item>
                ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
