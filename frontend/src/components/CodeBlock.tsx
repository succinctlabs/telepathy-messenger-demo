import Link from "next/link";
import { ArrowSquareOut } from "phosphor-react";
import { createRef, ReactNode } from "react";

import Button from "./Button";

import { ChainId } from "@/lib/chain";
import { getExplorerUrl } from "@/lib/util";

function Teal({ children }: { children: ReactNode }) {
  return <span className="text-succinct-teal opacity-70">{children}</span>;
}

function LightTeal({ children }: { children: ReactNode }) {
  return <span className="text-succinct-teal">{children}</span>;
}

function Neon({ children }: { children: ReactNode }) {
  return <span className="text-succinct-neon">{children}</span>;
}

function Border({ children }: { children: ReactNode }) {
  return (
    <span className="border-succinct-teal border-solid border-[1px]">
      {children}
    </span>
  );
}

function Orange({ children }: { children: ReactNode }) {
  return <span className="text-succinct-orange">{children}</span>;
}

function hasNonAscii(str: string) {
  // eslint-disable-next-line no-control-regex
  return /[^\x00-\x7F]/.test(str);
}

export function CodeBlock({
  sourceChain,
  targetChain,
  telepathy,
  mailbox,
  msg,
}: {
  sourceChain: ChainId;
  targetChain: ChainId;
  telepathy: string;
  mailbox: string;
  msg: string;
}) {
  const ref = createRef<HTMLPreElement>();
  const isUnicodeString = hasNonAscii(msg);
  const codeLines = [
    <span key="1">
      address <Teal>router</Teal> ={" "}
      <Orange>
        <a
          target="_blank"
          href={getExplorerUrl(sourceChain, `/address/${telepathy}#code`)}
          className="underline"
        >
          {telepathy}
        </a>
      </Orange>
      <Teal>;</Teal>
    </span>,
    <span key="2">
      address <Teal>mailbox</Teal> ={" "}
      <Orange>
        <a
          target="_blank"
          href={getExplorerUrl(targetChain, `/address/${mailbox}#code`)}
          className="underline"
        >
          {mailbox}
        </a>
      </Orange>
      <Teal>;</Teal>
    </span>,
    " ",
    <span key="4">
      uint32{" "}
      <Teal>
        <Border>targetChain</Border>
      </Teal>{" "}
      = <Orange>{targetChain}</Orange>
      <Teal>;</Teal>
    </span>,
    <span key="5">
      string memory{" "}
      <Teal>
        <Border>input</Border>
      </Teal>{" "}
      ={" "}
      <Orange>
        {isUnicodeString ? <LightTeal>unicode</LightTeal> : ""}&quot;
        {msg
          .replaceAll("\\", "\\\\")
          .replaceAll('"', '\\"')
          .replaceAll("\n", "\\n")}
        &quot;
      </Orange>
      <Teal>;</Teal>
    </span>,
    "",
    <span className="text-succinct-teal-40">
      // Append ENS/address and balance to the end of the message
    </span>,
    <span className="text-succinct-teal-40">
      // ex. "Hello world! - vitalik.eth (1.23 ETH)"
    </span>,
    <span>
      string memory <Teal>ens</Teal> = <LightTeal>ENSUtil</LightTeal>.
      <LightTeal>reverseResolve</LightTeal>(<Teal>msg</Teal>.<Teal>sender</Teal>
      )<Teal>;</Teal>
    </span>,
    <span>
      string memory <Teal>balance</Teal> = <LightTeal>StringsUtil</LightTeal>.
      <LightTeal>getBalance</LightTeal>(<Teal>msg</Teal>.<Teal>sender</Teal>)
      <Teal>;</Teal>
    </span>,
    <span key="5">
      string memory <Teal>message</Teal> = <LightTeal>string</LightTeal>.
      <LightTeal>concat</LightTeal>(<Teal>input</Teal>, <Teal>ens</Teal>,{" "}
      <Teal>balance</Teal>)<Teal>;</Teal>
    </span>,
    "",
    <span key="7">
      <Neon>ITelepathyRouter</Neon>(<Teal>router</Teal>).
      <Neon>send</Neon>(<Teal>targetChain</Teal>, <Teal>mailbox</Teal>,{" "}
      <LightTeal>bytes</LightTeal>(<Teal>message</Teal>))
      <Teal>;</Teal>
    </span>,
  ];

  const copyToClipboard = () => {
    if (ref.current !== null) {
      const text = ref.current.innerText
        .replaceAll("\n \n", "\n\n")
        .split("\n")
        .map((line) => line.split("\t").slice(1).join(" "))
        .join("\n");
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="bg-[#0A1B2A] h-full relative rounded overflow-hidden p-4">
      <div className="flex">
        <pre className="h-full table" ref={ref}>
          {codeLines.map((line, lineNum) => (
            <div key={lineNum}>
              <span className="table-cell w-[36px] text-right pr-4 select-none text-succinct-teal opacity-50">
                {lineNum + 1}
              </span>
              <span className="table-cell whitespace-pre-line">{line}</span>
            </div>
          ))}
        </pre>
      </div>
      <div className="flex flex-row justify-end pt-4">
        <Button
          as={Link}
          target="_blank"
          rel="noreferrer"
          href="https://github.com/succinctlabs/messenger-demo/blob/main/contracts/src/CrossChainMailbox.sol#L30"
          className=" focus:ring-offset-[#0A1B2A]"
        >
          <span>View on GitHub</span>
          <ArrowSquareOut weight="bold" />
        </Button>
      </div>
    </div>
  );
}
