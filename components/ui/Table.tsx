import React from 'react';

interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onSort?: (key: keyof T) => void;
  sortKey?: keyof T;
  sortDirection?: 'asc' | 'desc';
}

export function Table<T>({ data, columns, onSort, sortKey, sortDirection }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full glass-pane">
        <thead>
          <tr className="border-b border-white/20">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`p-3 text-left font-semibold ${col.sortable ? 'cursor-pointer hover:bg-white/10' : ''}`}
                onClick={col.sortable ? () => onSort?.(col.key) : undefined}
              >
                <div className="flex items-center gap-2">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b border-white/10 hover:bg-white/5">
              {columns.map((col) => (
                <td key={String(col.key)} className="p-3">
                  {col.render ? col.render(item[col.key], item) : String(item[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}