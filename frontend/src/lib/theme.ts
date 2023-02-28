import resolveConfig from "tailwindcss/resolveConfig";
import { RecursiveKeyValuePair } from "tailwindcss/types/config";

import configFile from "../../tailwind.config";

export const tailwindConfig = resolveConfig(configFile);
export const colors = tailwindConfig.theme?.colors;

export function getTailwindColor(color: string): string {
  const keys = color.split(".");
  let colorObj = colors as RecursiveKeyValuePair<string, string>;
  for (const key of keys) {
    colorObj = (colorObj as RecursiveKeyValuePair<string, string>)[
      key
    ] as RecursiveKeyValuePair<string, string>;
  }
  return colorObj as unknown as string;
}
