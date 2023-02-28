import "@/styles/globals.css";
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { Check, X } from "phosphor-react";
import { Toaster } from "react-hot-toast";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { gnosis, goerli, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import Layout from "@/components/Layout";
import { colors, getTailwindColor } from "@/lib/theme";
import "@rainbow-me/rainbowkit/styles.css";

const { chains, provider } = configureChains(
  [goerli, gnosis, polygon],
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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        theme={darkTheme({
          // accentColor: "#18232A",
          accentColor: colors?.neon as string,
          accentColorForeground: colors?.black as string,
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
