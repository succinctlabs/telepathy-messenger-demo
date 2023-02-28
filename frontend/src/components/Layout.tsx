import Head from "next/head";
import { ReactNode } from "react";

import NavBar from "./NavBar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>Telepathy Demo</title>
        <meta name="description" content="Telepathy Demo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full min-h-screen px-10 lg:px-32 flex-col items-center text-white bg-succinct-black">
        <>
          <div className="min-h-full w-full max-w-[1200px]">
            <NavBar />
            {children}
          </div>
        </>
      </main>
      {/* <Footer /> */}
    </>
  );
}
