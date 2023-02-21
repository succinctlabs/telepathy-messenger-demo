import resolveConfig from "tailwindcss/resolveConfig";
import configFile from "../../tailwind.config";

export const tailwindConfig = resolveConfig(configFile);
export const colors = tailwindConfig.theme?.colors;
