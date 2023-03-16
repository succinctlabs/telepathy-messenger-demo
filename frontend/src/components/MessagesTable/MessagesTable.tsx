import { Children, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { StatusTooltip } from "@/components/StatusTooltip";

export function MessagesTable({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  enableSelect?: boolean;
}) {
  const rows = Children.toArray(children);

  return (
    <table
      className={twMerge(
        "relative w-full border-separate border-spacing-y-3 table-fixed max-w-full min-w-[1100px]",
        className
      )}
    >
      <thead>
        <tr className="font-mono text-succinct-teal-50 text-left [&>th]:p-4">
          <th className="w-[140px]">SENDER</th>
          <th className="w-[110px]">SOURCE</th>
          <th className="w-[110px]">DEST</th>
          <th className="w-auto min-w-[150px]">MESSAGE</th>
          <th className="w-[180px]">TRANSACTION</th>
          <th className="w-[280px]">
            <div className="flex flex-row items-center gap-2">
              STATUS <StatusTooltip />
            </div>
          </th>
          <th className="w-[80px]"></th>
        </tr>
      </thead>
      <tbody className="relative">
        {rows.map((row, i) => (
          <tr
            key={i}
            className={
              "bg-succinct-teal-5 [&>:first-child]:rounded-l-xl [&>:last-child]:rounded-r-xl [&>td]:py-4 [&>td]:px-4 align-text-top"
            }
          >
            {row}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
