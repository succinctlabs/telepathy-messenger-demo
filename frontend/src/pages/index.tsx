import { useConnectModal } from "@rainbow-me/rainbowkit";
import { utils } from "ethers";
import { useRouter } from "next/router";
import { CircleNotch, PaperPlaneTilt } from "phosphor-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import { useAccount, useSwitchNetwork } from "wagmi";
import { fetchSigner } from "wagmi/actions";

import { BackgroundDottedLine } from "@/components/BackgroundDottedLine/BackgroundDottedLine";
import BigChainSelector from "@/components/BigChainSelector/BigChainSelector";
import Button from "@/components/Button";
import { CodeBlock } from "@/components/CodeBlock";
import { CrossChainMailer__factory } from "@/contracts";
import { useIsMounted } from "@/hooks/isMounted";
import { CHAIN_MAP, ContractId, CONTRACTS, SOURCE_CHAINS } from "@/lib";
import { ChainId } from "@/lib/chain";
import { getRandomElement } from "@/lib/util";
import styles from "@/styles/Index.module.css";

export default function Home() {
  const [message, setMessage] = useState(
    "Telepathy is Ethereum's first interoperability protocol powered by zero-knowledge succinct proofs, in the form of zkSNARKs, to allow for more secure, decentralized and permissionless interoperability. 🪄"
  );
  const [selectedSourceChain, setSelectedSourceChain] = useState(
    ChainId.Mainnet
  );
  const [selectedTargetChain, setSelectedTargetChain] = useState(
    ChainId.Goerli
  );
  // if we are waiting for user to sign txn
  const [waiting, setWaiting] = useState(false);

  const isMounted = useIsMounted();
  const account = useAccount();
  const walletConnected = isMounted && !!account.address;

  const connectModal = useConnectModal();
  const switchNetwork = useSwitchNetwork();

  const router = useRouter();

  const sendButtonDisabled = !switchNetwork || !message || waiting;

  useEffect(() => {
    setSelectedTargetChain(getRandomElement(CHAIN_MAP[ChainId.Mainnet] || []));
  }, []);

  async function sendTransaction() {
    //send message
    const mailerContract = CONTRACTS[ContractId.CrossChainMailer] as string;
    const mailboxContract = CONTRACTS[ContractId.CrossChainMailbox] as string;
    if (!mailerContract || !mailboxContract) {
      throw new Error("Contract not found");
    }
    if (!switchNetwork?.switchNetworkAsync) {
      toast.error(
        "Please switch chains in your wallet to " +
          ChainId.toName(selectedSourceChain)
      );
      return;
    }
    setWaiting(true);
    const currentChain = await account.connector?.getChainId();
    if (currentChain !== selectedSourceChain) {
      try {
        await switchNetwork.switchNetworkAsync(selectedSourceChain);
      } catch (e: any) {
        toast.error(
          `Please switch chains in your wallet to ${ChainId.toName(
            selectedSourceChain
          )}.`
        );
        return;
      }
    }
    const signer = await fetchSigner({ chainId: selectedSourceChain });
    if (!signer) {
      toast.error("Failed to load signer.");
      return;
    }
    const mailer = CrossChainMailer__factory.connect(mailerContract, signer);
    let tx;
    try {
      tx = await mailer.sendMail(
        selectedTargetChain,
        mailboxContract,
        utils.toUtf8Bytes(message)
      );
    } catch (e: any) {
      if (e?.code === "ACTION_REJECTED") {
        toast.error("Transaction rejected.");
      } else {
        toast.error("Transaction failed.");
      }
      return;
    } finally {
      setWaiting(false);
    }
    toast.success("Transaction sent.");
    router.push("/dashboard");
  }

  async function onSendButton() {
    if (!walletConnected) {
      //connect wallet
      if (connectModal.openConnectModal) {
        connectModal.openConnectModal();
      }
    } else {
      await sendTransaction();
    }
  }

  return (
    <div className="w-full flex justify-center mt-10 max-w-[1200px]">
      <div className="w-full">
        {/* Header */}
        <div>
          <div className="text-succinct-teal-50 font-mono text-sm">DEMO</div>
          <div>
            <h2 className="text-3xl mt-2">Arbitrary messenger</h2>
          </div>
          <BackgroundDottedLine />
        </div>

        {/* Messenger */}
        <div className="grid grid-cols-3 mt-6 space-x-8">
          {/* Inputs */}
          <div className="col-span-1 flex flex-col space-y-6 w-full text-succinct-teal">
            {/* Chain selectors */}
            <div className="grid grid-cols-2 relative">
              <BigChainSelector
                name="From"
                className="pr-3"
                chains={SOURCE_CHAINS}
                selectedChain={selectedSourceChain}
                setSelectedChain={setSelectedSourceChain}
              />
              <BigChainSelector
                name="To"
                className="pl-3"
                chains={CHAIN_MAP[selectedSourceChain] || []}
                selectedChain={selectedTargetChain}
                setSelectedChain={setSelectedTargetChain}
              />
              <div className="absolute left-1/2 translate-x-[-50%] top-1/2 translate-y-[-50%]">
                <div className={twMerge("relative")}>
                  <img src="/svgs/arrows.svg" className={twMerge("")} />
                </div>
              </div>
            </div>

            {/* Message input */}
            <div className="w-full grow">
              <div className={twMerge("relative h-full", styles.sendTextarea)}>
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
                  {/* <Button
                    className="absolute bottom-4 left-4 focus:ring-offset-succinct-teal-10 pointer-events-auto"
                    size="lg"
                  >
                    <Shuffle />
                    <span>Ask ChatGPT</span>
                  </Button> */}
                  <Button
                    className="transition-width absolute bottom-4 right-4 focus:ring-offset-succinct-teal-10 pointer-events-auto h-[46px] min-w-[50px] justify-center"
                    size="lg"
                    variant="secondary"
                    onClick={onSendButton}
                    disabled={sendButtonDisabled}
                    title={waiting ? "Waiting for transaction signature" : ""}
                  >
                    {waiting ? (
                      <CircleNotch className="animate-spin" />
                    ) : walletConnected ? (
                      <PaperPlaneTilt />
                    ) : (
                      "Connect Wallet"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Code preview */}
          <div className="col-span-2">
            <CodeBlock
              sourceChain={selectedSourceChain}
              targetChain={selectedTargetChain}
              telepathy={CONTRACTS[ContractId.TelepathyRouter] || ""}
              mailbox={
                (CONTRACTS[ContractId.CrossChainMailbox] as string) || ""
              }
              msg={message}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
