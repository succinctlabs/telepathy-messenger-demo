import clsx from "clsx";
import { Copy } from "phosphor-react";
import { ReactNode } from "react";
import styles from "@/styles/CodeBlock.module.css";
import Highlight, { defaultProps } from "prism-react-renderer";
import { Prism } from "prism-react-renderer";
import Button from "./Button";

function Teal({ children }: { children: ReactNode }) {
  return <span className="text-succinct-teal opacity-70">{children}</span>;
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

// @ts-ignore
// (typeof global !== "undefined" ? global : window).Prism = Prism;
// require("prismjs/components/prism-solidity");

// const code = `uint256 chainId = 1;
// address telepathy = 0x12;
// address mailbox = 0x12;
// bytes memory msg = "asdf alsj falksdjf laskj falskfj laskj ";

// ITelepathy(telepathy).send( chainId, mailbox, msg );`;

export function CodeBlock({
  chainId,
  telepathy,
  mailbox,
  msg,
}: {
  chainId: number;
  telepathy: string;
  mailbox: string;
  msg: string;
}) {
  const codeLines = [
    <span key="2">
      address <Teal>telepathy</Teal> = {telepathy}
      <Teal>;</Teal>
    </span>,
    <span key="3">
      address <Teal>mailbox</Teal> = {mailbox}
      <Teal>;</Teal>
    </span>,
    " ",
    <span key="1">
      uint256 <Teal>targetChain</Teal> = <Border>{chainId}</Border>
      <Teal>;</Teal>
    </span>,
    <span key="4">
      bytes memory <Teal>msg</Teal> = &quot;
      <Border>
        {msg
          .replaceAll("\\", "\\\\")
          .replaceAll('"', '\\"')
          .replaceAll("\n", "\\n")}
      </Border>
      &quot;
      <Teal>;</Teal>
    </span>,
    " ",
    <span key="6">
      <Teal>
        ITelepathy(telepathy).<Neon>send</Neon>(targetChain, mailbox, msg);
      </Teal>
    </span>,
  ];

  return (
    <div className="bg-[#0A1B2A] h-full relative rounded overflow-hidden">
      {/* <Highlight
        {...defaultProps}
        code={code}
        language="solidity"
        prism={Prism}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={clsx(className, "p-4 overflow-x-auto w-full")}
            style={style}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                <span className="text-right pr-4 select-none">{i + 1}</span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight> */}
      <div className="h-full flex flex-row pl-4 pt-4">
        <pre className="h-full flex flex-col">
          {codeLines.map((line, lineNum) => (
            <span
              key={lineNum}
              className="text-right pr-4 select-none text-succinct-teal opacity-50"
            >
              {lineNum + 1}
            </span>
          ))}
        </pre>
        <pre
          className={clsx(
            "h-full flex flex-col relative",
            styles.customScrollBar
          )}
        >
          {codeLines.map((line, lineNum) => (
            <div key={lineNum}>{line}</div>
          ))}
        </pre>
        <Button className="absolute bottom-4 right-4 focus:ring-offset-[#0A1B2A]">
          <Copy />
          <span>Copy snippet</span>
        </Button>
      </div>
    </div>
  );
}
