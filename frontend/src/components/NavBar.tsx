import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import SuccinctLogo from "public/svgs/succinct.svg";
import { twMerge } from "tailwind-merge";

function NavLink({ href, name }: { href: string; name: string }) {
  const { pathname } = useRouter();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={twMerge(
        "mt-1 opacity-50 transition-opacity",
        isActive && "opacity-100"
      )}
    >
      {name}
    </Link>
  );
}

export default function NavBar() {
  return (
    <nav className="py-8 flex flex-row items-center justify-between">
      <div className="flex flex-row items-center space-x-6">
        <Link href="https://succinct.xyz">
          <Image src={SuccinctLogo} alt="Succinct Labs logo" />
        </Link>
        <NavLink href="/" name="Messenger" />
        <NavLink href="/dashboard" name="Dashboard" />
        <NavLink href="/explorer" name="Explorer" />
        <NavLink href="/docs" name="Docs" />
      </div>
      <div className="flex flex-row items-center space-x-4">
        <Link href="/" className="mt-1">
          Become an early partner
        </Link>
        <ConnectButton />
      </div>
    </nav>
  );
}
