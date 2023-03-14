import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={twMerge(
        "mx-auto",
        "w-full max-w-[1312px]",
        "px-[24px] sm:px-[56px] lg:px-14",
        "relative"
      )}
    >
      {children}
    </div>
  );
};
