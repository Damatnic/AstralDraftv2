import React, { useMemo } from &apos;react&apos;;

interface Column<T> {
}
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;

interface TableProps<T> {
}
  data: T[];
  columns: Column<T>[];
  onSort?: (key: keyof T) => void;
  sortKey?: keyof T;
  sortDirection?: &apos;asc&apos; | &apos;desc&apos;;

export function Table<T>({ data, columns, onSort, sortKey, sortDirection }: TableProps<T>) {
}
  return (
    <div className="overflow-x-auto sm:px-4 md:px-6 lg:px-8">
      <table className="w-full glass-pane sm:px-4 md:px-6 lg:px-8">
        <thead>
          <tr className="border-b border-white/20 sm:px-4 md:px-6 lg:px-8">
            {columns.map((col: any) => (
}
              <th
                key={String(col.key)}
                className={`p-3 text-left font-semibold ${col.sortable ? &apos;cursor-pointer hover:bg-white/10&apos; : &apos;&apos;}`}
                onClick={col.sortable ? () => onSort?.(col.key) : undefined}
              >
                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
}
                    <span>{sortDirection === &apos;asc&apos; ? &apos;↑&apos; : &apos;↓&apos;}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
}
            <tr key={index} className="border-b border-white/10 hover:bg-white/5 sm:px-4 md:px-6 lg:px-8">
              {columns.map((col: any) => (
}
                <td key={String(col.key)} className="p-3 sm:px-4 md:px-6 lg:px-8">
                  {col.render ? col.render(item[col.key], item) : String(item[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
