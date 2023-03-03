import { Children, ReactNode } from "react";

const COLUMNS = [
  "SENDER",
  "SOURCE",
  "TARGET",
  "MESSAGE",
  "TRANSACTION",
  "STATUS",
];
const WIDTHS = ["140px", "110px", "110px", "auto", "auto", "230px"];

export function MessagesTable({ children }: { children: ReactNode }) {
  const rows = Children.toArray(children);
  return (
    <table className="w-full border-separate border-spacing-y-3 table-fixed max-w-full">
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
            className="bg-succinct-teal-5 [&>:first-child]:rounded-l-xl [&>:last-child]:rounded-r-xl [&>td]:py-4 [&>td]:px-4"
          >
            {row}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
