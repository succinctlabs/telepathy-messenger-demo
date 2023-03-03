import { twMerge } from "tailwind-merge";

export default function Button({
  children,
  className,
  onClick,
  disabled,
  size = "md",
  variant = "primary",
  title = "",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary";
  title?: string;
}) {
  return (
    <button
      className={twMerge(
        "px-3 py-2 rounded-[10px] space-x-2 flex flex-row items-center justify-center border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        size === "xl" && "text-xl px-4 py-3",
        variant === "primary" &&
          "bg-succinct-teal-20 text-succinct-teal focus:ring-succinct-teal-30",
        !disabled && variant === "primary" && "hover:bg-succinct-teal-30",
        variant === "secondary" &&
          "bg-succinct-teal text-succinct-black focus:ring-succinct-teal-80",
        !disabled && variant === "secondary" && "hover:bg-succinct-teal-80",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}
