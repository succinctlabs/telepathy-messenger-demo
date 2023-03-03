import { Copy } from "phosphor-react";
import { createRef, ReactNode } from "react";

import Button from "./Button";

import { ChainId } from "@/lib/chain";
import { getExplorerUrl } from "@/lib/util";

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
      ={" "}
      <Orange>
        {/* <Border> */}
        {targetChain}
        {/* </Border> */}
      </Orange>
      <Teal>;</Teal>
    </span>,
    <span key="5">
      string memory{" "}
      <Teal>
        <Border>input</Border>
      </Teal>{" "}
      ={" "}
      <Orange>
        {isUnicodeString ? <Neon>unicode</Neon> : ""}&quot;
        {/* <Border> */}
        {msg
          .replaceAll("\\", "\\\\")
          .replaceAll('"', '\\"')
          .replaceAll("\n", "\\n")}
        {/* </Border> */}
        &quot;
      </Orange>
      <Teal>;</Teal>
    </span>,
    " ",
    <span key="7">
      <Neon>ITelepathyBroadcaster</Neon>(<Teal>router</Teal>).
      <Neon>send</Neon>(<Teal>targetChain</Teal>, <Teal>mailbox</Teal>,{" "}
      <span className="text-succinct-teal">bytes</span>(<Teal>input</Teal>))
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
      {/* <div className="h-full flex flex-row pl-4 pt-4">
        <pre className="h-full flex flex-col">
          {codeLines.map((line, lineNum) => (
            <span
              key={lineNum}
              className="table-cell text-right pr-4 select-none text-succinct-teal opacity-50"
            >
              {lineNum + 1}
            </span>
          ))}
        </pre>
        <pre
          ref={ref}
          className={clsx(
            "table-cell h-full flex-col relative customScrollBar whitespace-pre-wrap"
          )}
        >
          {codeLines.map((line, lineNum) => (
            <div key={lineNum}>{line}</div>
          ))}
        </pre>
        <Button
          className="absolute bottom-4 right-4 focus:ring-offset-[#0A1B2A]"
          onClick={copyToClipboard}
        >
          <Copy />
          <span>Copy snippet</span>
        </Button>
      </div>
    </div> */}
      <div className="h-full flex pl-4 pt-4">
        <pre className="h-full table" ref={ref}>
          {codeLines.map((line, lineNum) => (
            <div key={lineNum}>
              <span className="table-cell text-right pr-4 select-none text-succinct-teal opacity-50">
                {lineNum + 1}
              </span>
              <span className="table-cell whitespace-pre-line">{line}</span>
            </div>
          ))}
        </pre>
        {/* <pre
          ref={ref}
          className={clsx(
            "table-cell h-full flex-col relative customScrollBar whitespace-pre-wrap"
          )}
        >
          {codeLines.map((line, lineNum) => (
            <div key={lineNum}>{line}</div>
          ))}
        </pre> */}
        <Button
          className="absolute bottom-4 right-4 focus:ring-offset-[#0A1B2A]"
          onClick={copyToClipboard}
        >
          <Copy />
          <span>Copy snippet</span>
        </Button>
      </div>
    </div>
  );
}
