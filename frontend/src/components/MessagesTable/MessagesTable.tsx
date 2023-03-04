import { Children, MouseEvent, ReactNode, useState } from "react";
import { twMerge } from "tailwind-merge";

const COLUMNS = [
  "SENDER",
  "SOURCE",
  "TARGET",
  "MESSAGE",
  "TRANSACTION",
  "STATUS",
  "",
];
const WIDTHS = ["140px", "110px", "110px", "auto", "180px", "280px", "80px"];

export function MessagesTable({
  children,
}: {
  children: ReactNode;
  enableSelect?: boolean;
}) {
  const rows = Children.toArray(children);

  return (
    <table className="relative w-full border-separate border-spacing-y-3 table-fixed max-w-full">
      <thead>
        <tr className="font-mono text-succinct-teal-50 text-left [&>th]:p-4">
          {COLUMNS.map((colName, i) => (
            <th key={colName} style={{ width: WIDTHS[i] }}>
              {colName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="">
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
