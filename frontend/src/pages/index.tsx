import Button from "@/components/Button";
import { CodeBlock } from "@/components/CodeBlock";
import styles from "@/styles/Index.module.css";
import { Inter } from "@next/font/google";
import { PaperPlaneTilt, Shuffle } from "phosphor-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function Home() {
  const [message, setMessage] = useState("");
  return (
    <div className="w-full flex justify-center mt-10">
      <div className="w-full">
        <div>
          <div className="text-succinct-teal opacity-50 font-mono">DEMO</div>
          <div>
            <h2 className="text-3xl mt-2">Arbitrary messenger</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 mt-6 space-x-8">
          <div className="col-span-1 flex flex-col space-y-2 w-full">
            <div className="grid grid-cols-2 space-x-4">
              <select
                className={`${styles.sendChainSelect} ${styles.sendChainSelectFrom}`}
                defaultValue=""
              >
                <option value="" disabled>
                  From
                </option>
                <option>ethereum</option>
              </select>
              <select
                className={`${styles.sendChainSelect} ${styles.sendChainSelectTo}`}
                defaultValue=""
              >
                <option value="" disabled>
                  To
                </option>
                <option>ethereum</option>
              </select>
            </div>

            <div className="w-full h-full grow">
              <div className="relative pt-6 h-full">
                <textarea
                  className={twMerge("w-full h-full", styles.sendTextarea)}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button
                  className="absolute bottom-4 left-4 focus:ring-offset-succinct-teal-dark"
                  size="xl"
                >
                  <Shuffle />
                  <span>Shuffle</span>
                </Button>
                <Button
                  className="absolute bottom-4 right-4 focus:ring-offset-succinct-teal-dark"
                  size="xl"
                  variant="secondary"
                >
                  <PaperPlaneTilt />
                </Button>
              </div>
            </div>
          </div>
          <div className="h-[400px]">
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
