import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowUpRight } from "phosphor-react";
import TelepathyLogo from "public/svgs/telepathy.svg";
import { twMerge } from "tailwind-merge";

import Button from "@/components/Button";

function NavLink({
  href,
  name,
  openInNewTab = false,
}: {
  href: string;
  name: string;
  openInNewTab?: boolean;
}) {
  const { pathname } = useRouter();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={twMerge(
        "mt-1 opacity-50 transition-opacity flex flex-row gap-1 items-center",
        isActive && "opacity-100"
      )}
      target={openInNewTab ? "_blank" : undefined}
      referrerPolicy={openInNewTab ? "no-referrer" : undefined}
    >
      {name} {isActive && <span className="sr-only">(current)</span>}{" "}
      {openInNewTab && <span className="sr-only">(opens in a new tab)</span>}
      {openInNewTab && <ArrowUpRight className="mt-0.5" />}
    </Link>
  );
}

function MobileNavLink({ href, name }: { href: string; name: string }) {
  const { pathname } = useRouter();
  const isActive = pathname === href;
  return (
    <Disclosure.Button
      as={Link}
      href={href}
      className={twMerge(
        "block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700",
        isActive && "border-white"
      )}
    >
      {name}
    </Disclosure.Button>
  );
}

export default function NavBar() {
  return (
    <>
      <Disclosure as="nav" className="">
        {({ open }) => (
          <>
            <div className="py-8 flex flex-row items-center justify-between whitespace-nowrap">
              <div className="flex flex-row items-center space-x-6">
                <Link href="https://telepathy.xyz">
                  <Image
                    src={TelepathyLogo}
                    alt="Telepathy logo"
                    className="min-w-[110px] mt-0.5"
                  />
                </Link>
                <div className="gap-4 hidden xl:flex">
                  <NavLink href="/" name="Messenger" />
                  <NavLink href="/dashboard" name="Dashboard" />
                  <NavLink
                    href="https://scan.succinct.xyz/"
                    name="Explorer"
                    openInNewTab
                  />
                  <NavLink
                    href="https://docs.succinct.xyz/"
                    name="Docs"
                    openInNewTab
                  />
                </div>
              </div>

              <div className="flex flex-row items-center space-x-4 mt-1 ml-4">
                <Button
                  as={Link}
                  href="https://airtable.com/shrKT6HrHi2oDcmrf"
                  className="hidden xl:block bg-transparent text-succinct-neon hover:bg-transparent focus:ring-0 focus:ring-offset-0"
                >
                  Become an early partner
                </Button>
                <div className="connect-button-container">
                  <ConnectButton />
                </div>

                <div className="-mr-2 flex items-center xl:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="xl:hidden">
              <div className="space-y-2 -mt-4 pb-3">
                <MobileNavLink href="/" name="Messenger" />
                <MobileNavLink href="/dashboard" name="Dashboard" />
                <MobileNavLink
                  href="https://scan.succinct.xyz/"
                  name="Explorer"
                />
                <MobileNavLink href="https://docs.succinct.xyz/" name="Docs" />
                <Button
                  as="a"
                  href="https://airtable.com/shrKT6HrHi2oDcmrf"
                  className="w-full text-succinct-neon bg-transparent border-succinct-neon hover:bg-succinct-neon hover:text-succinct-black"
                >
                  Become an early partner
                </Button>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
