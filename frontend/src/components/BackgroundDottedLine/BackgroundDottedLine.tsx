import { twMerge } from "tailwind-merge";

import styles from "./BackgroundDottedLine.module.css";

export function BackgroundDottedLine() {
  return (
    <div
      className={twMerge(
        "relative left-[50%] ml-[-50vw] w-[100vw] h-[2px] my-4",
        styles.backgroundLine
      )}
    />
  );
}
