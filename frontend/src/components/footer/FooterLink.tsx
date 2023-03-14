import Link from "next/link";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const linkClass =
  "opacity-50 hover:opacity-100 transition-opacity duration-[250ms] ease-out";

export const FooterLink = ({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) => {
  return (
    <Link
      href={href}
      target="_blank"
      referrerPolicy="no-referrer"
      className="w-fit"
    >
      <div className={twMerge("text-[16px]", "text-succinct-teal", linkClass)}>
        {children}
      </div>
    </Link>
  );
};
