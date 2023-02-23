import { twMerge } from "tailwind-merge";

export default function Button({
  children,
  className,
  onClick,
  disabled,
  size = "md",
  variant = "primary",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      className={twMerge(
        "font-bold px-3 py-2 rounded-[10px] space-x-2 flex flex-row items-center border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        size === "xl" && "text-xl px-4 py-3",
        variant === "primary" &&
          "bg-succinct-teal bg-opacity-10 hover:bg-opacity-20 text-white focus:ring-succinct-teal focus:ring-opacity-20",
        variant === "secondary" &&
          "bg-succinct-teal bg-opacity-100 hover:bg-opacity-80 text-succinct-black focus:ring-succinct-teal",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
