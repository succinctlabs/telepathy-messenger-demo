import { Children, ReactNode } from "react";

export function MessagesTable({
  colNames,
  children,
}: {
  colNames: string[];
  children: ReactNode;
}) {
  const rows = Children.toArray(children);
  return (
    <table className="w-full border-separate border-spacing-y-3">
      <thead>
        <tr className="font-mono text-succinct-teal-50 text-left [&>th]:p-4">
          {colNames.map((colName) => (
            <th key={colName}>{colName}</th>
          ))}
        </tr>
      </thead>
      <tbody className="">
        {rows.map((row, i) => (
          <tr
            key={i}
            className="bg-succinct-teal-5 [&>:first-child]:rounded-l-xl [&>:last-child]:rounded-r-xl [&>td]:p-4"
          >
            {row}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
