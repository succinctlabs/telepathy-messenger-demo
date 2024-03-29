import Head from "next/head";
import { ReactNode } from "react";

import NavBar from "./NavBar";

import { SuccinctFooterSection } from "@/components/footer/SuccinctFooterSection";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>Telepathy Demo</title>
        <meta name="description" content="Telepathy Demo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full min-h-screen px-6 md:px-10 lg:px-32 pb-20 flex-col items-center text-white">
        <>
          <div className="min-h-full w-full max-w-[1200px]">
            <NavBar />
            {children}
          </div>
        </>
      </main>
      <SuccinctFooterSection />
    </>
  );
}
