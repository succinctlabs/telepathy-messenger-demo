import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const FooterLinkColumn = ({
  children,
  title,
}: {
  children: ReactNode;
  title: ReactNode;
}) => {
  return (
    <div className="w-[50%] sm:w-[33%] md:w-[200px]">
      <div className={twMerge("mb-[20px] capitalize")}>{title}</div>
      <div className="flex flex-col gap-[12px]">{children}</div>
    </div>
  );
};
