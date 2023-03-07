import "@/styles/globals.css";
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
  Theme,
} from "@rainbow-me/rainbowkit";
import { enableMapSet } from "immer";
import merge from "lodash.merge";
import type { AppProps } from "next/app";
import { Check, X } from "phosphor-react";
import { Toaster } from "react-hot-toast";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { gnosis, goerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import Layout from "@/components/Layout";
import { getTailwindColor } from "@/lib/theme";
import { DeepPartial } from "@/lib/types";
import "@rainbow-me/rainbowkit/styles.css";

const { chains, provider } = configureChains(
  [goerli, gnosis],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Telepathy Messenger Demo",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

enableMapSet();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        theme={merge<Theme, DeepPartial<Theme>>(darkTheme(), {
          radii: {
            actionButton: "10px",
            connectButton: "10px",
            modal: "10px",
            modalMobile: "10px",
            menuButton: "10px",
          },
          colors: {
            connectButtonBackground: getTailwindColor("succinct.teal-10"),
            accentColor: getTailwindColor("succinct.neon"),
            accentColorForeground: getTailwindColor("succinct.black"),
            connectButtonInnerBackground: getTailwindColor("succinct.teal-20"),
          },
        })}
        chains={[]}
      >
        <Toaster
          toastOptions={{
            position: "bottom-right",
            className: "bg-succinct-black",
            style: {
              background: getTailwindColor("succinct.teal-20"),
              color: getTailwindColor("succinct.teal"),
            },
            success: {
              icon: <Check weight="bold" className="text-succinct-teal" />,
            },
            error: {
              icon: <X weight="bold" className="text-succinct-orange" />,
            },
          }}
        />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
