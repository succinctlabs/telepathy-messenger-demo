import { BackgroundDottedLine } from "@/components/BackgroundDottedLine/BackgroundDottedLine";
import Button from "@/components/Button";
import ChainSelector from "@/components/ChainSelector/ChainSelector";
import { CodeBlock } from "@/components/CodeBlock";
import styles from "@/styles/Index.module.css";
import { PaperPlaneTilt, Shuffle } from "phosphor-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function Home() {
  const [message, setMessage] = useState(
    "Telepathy uses zero-knowledge succinct proofs in the form of zkSNARKs to generate a validity proof of the state of a chain. Consensus of the source chain is verified in the execution environment of the target chain."
  );
  return (
    <div className="w-full flex justify-center mt-10 max-w-[1200px]">
      <div className="w-full">
        <div>
          <div className="text-succinct-teal-50 font-mono text-sm">DEMO</div>
          <div>
            <h2 className="text-3xl mt-2">Arbitrary messenger</h2>
          </div>
          <BackgroundDottedLine />
        </div>
        <div className="grid grid-cols-2 mt-6 space-x-8">
          <div className="col-span-1 flex flex-col space-y-2 w-full text-succinct-teal">
            <div className="grid grid-cols-2 space-x-4">
              <ChainSelector name="From" defaultChain="mainnet" />
              <ChainSelector name="To" defaultChain="goerli" />
            </div>

            <div className="w-full grow">
              <div
                className={twMerge(
                  "relative mt-6 h-[300px]",
                  styles.sendTextarea
                )}
              >
                <textarea
                  className={twMerge(
                    "w-full h-full bg-succinct-teal-10 p-4 customScrollBar"
                  )}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div
                  className={twMerge(
                    "absolute w-full h-[100px] bottom-0 left-0 select-none pointer-events-none",
                    styles.sendTextareaGradient
                  )}
                >
                  <Button
                    className="absolute bottom-4 left-4 focus:ring-offset-succinct-teal-10 pointer-events-auto"
                    size="lg"
                  >
                    <Shuffle />
                    <span>Shuffle</span>
                  </Button>
                  <Button
                    className="absolute bottom-4 right-4 focus:ring-offset-succinct-teal-10 pointer-events-auto"
                    size="xl"
                    variant="secondary"
                  >
                    <PaperPlaneTilt />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <CodeBlock
              chainId={1}
              telepathy="0x0bF0813EC9170356c51c1bAD52c3fe146d1ccc48"
              mailbox="0x873D63274Da701ca18a7287e2D57a4d23793c797"
              msg={message}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
