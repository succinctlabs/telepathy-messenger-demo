import { twMerge } from "tailwind-merge";

import { Footer } from "./Footer";

export const SuccinctFooterSection = () => {
  return (
    <div
      className={twMerge(
        "relative",
        "min-h-[331px] ",
        "z-10",
        "bg-gradient-to-t from-succinct-teal-5 via-succinct-teal-5 to-succinct-teal-5"
      )}
    >
      <Footer />
    </div>
  );
};
