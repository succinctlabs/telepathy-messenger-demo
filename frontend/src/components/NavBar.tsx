import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import SuccinctLogo from "public/succinct.svg";
console.log(SuccinctLogo);
export default function NavBar() {
  return (
    <nav className="py-8 flex flex-row items-center justify-between">
      <div className="flex flex-row items-center space-x-6">
        <Image src={SuccinctLogo} alt="Succinct Labs logo" />
        <Link href="/" className="mt-1">
          Messenger
        </Link>
        <Link href="/" className="mt-1 opacity-50">
          Dashboard
        </Link>
        <Link href="/" className="mt-1 opacity-50">
          Explorer
        </Link>
        <Link href="/" className="mt-1 opacity-50">
          Docs
        </Link>
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
