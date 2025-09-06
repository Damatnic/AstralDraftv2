/**
 * AccessibleTable Component
 * WCAG 2.1 Level AA Compliant Data Table
 */

import React, { useState, useRef, useEffect } from 'react';
import { KEYBOARD_KEYS, announceToScreenReader } from '../../../utils/accessibility';

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
  ariaLabel?: (row: T) => string;

interface AccessibleTableProps<T> {
  columns: Column<T>[];
  data: T[];
  caption: string;
  summary?: string;
  sortable?: boolean;
  selectable?: boolean;
  onRowSelect?: (row: T, index: number) => void;
  selectedRows?: Set<number>;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  loading?: boolean;
  emptyMessage?: string;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  keyExtractor?: (row: T, index: number) => string | number;

function AccessibleTable<T extends Record<string, any>>({
  columns,
  data,
  caption,
  summary,
  sortable = false,
  selectable = false,
  onRowSelect,
  selectedRows = new Set(),
  onSort,
  loading = false,
  emptyMessage = 'No data available',
  striped = true,
  hoverable = true,
  compact = false,
  stickyHeader = false,
//   keyExtractor
}: AccessibleTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number }>({ row: -1, col: -1 });
  const tableRef = useRef<HTMLTableElement>(null);

  // Handle sorting
  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnKey);
    setSortDirection(newDirection);
    
    if (onSort) {
      onSort(columnKey, newDirection);
    }

    announceToScreenReader(
      `Sorted by ${columns.find((c: any) => c.key === columnKey)?.label} ${newDirection === 'asc' ? 'ascending' : 'descending'}`,
      'polite'
    );
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
    let newRow = rowIndex;
    let newCol = colIndex;

    switch (e.key) {
      case KEYBOARD_KEYS.ARROW_UP:
        e.preventDefault();
        newRow = Math.max(0, rowIndex - 1);
        break;
      case KEYBOARD_KEYS.ARROW_DOWN:
        e.preventDefault();
        newRow = Math.min(data.length - 1, rowIndex + 1);
        break;
      case KEYBOARD_KEYS.ARROW_LEFT:
        e.preventDefault();
        newCol = Math.max(0, colIndex - 1);
        break;
      case KEYBOARD_KEYS.ARROW_RIGHT:
        e.preventDefault();
        newCol = Math.min(columns.length - 1, colIndex + 1);
        break;
      case KEYBOARD_KEYS.HOME:
        e.preventDefault();
        if (e.ctrlKey) {
          newRow = 0;
          newCol = 0;
        } else {
          newCol = 0;
        }
        break;
      case KEYBOARD_KEYS.END:
        e.preventDefault();
        if (e.ctrlKey) {
          newRow = data.length - 1;
          newCol = columns.length - 1;
        } else {
          newCol = columns.length - 1;
        }
        break;
      case KEYBOARD_KEYS.ENTER:
      case KEYBOARD_KEYS.SPACE:
        if (selectable && onRowSelect) {
          e.preventDefault();
          onRowSelect(data[rowIndex], rowIndex);
        }
        break;
      default:
        return;
    }

    setFocusedCell({ row: newRow, col: newCol });
    
    // Focus the new cell
    const cell = tableRef.current?.querySelector(
      `[data-row="${newRow}"][data-col="${newCol}"]`
    ) as HTMLElement;
    cell?.focus();
  };

  // Size styles
  const cellPadding = compact ? 'px-3 py-2' : 'px-4 py-3';

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8" role="status" aria-live="polite">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="ml-2 text-gray-400">Loading table data...</span>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-700">
      <table
        ref={tableRef}
        className="w-full border-collapse"
        role="table"
        aria-label={caption}
        aria-rowcount={data.length + 1}
        aria-colcount={columns.length}
      >
        <caption className="sr-only">
          {caption}
          {summary && `. ${summary}`}
        </caption>
        
        <thead className={`${stickyHeader ? 'sticky top-0 z-10' : ''} bg-gray-800`}>
          <tr role="row">
            {columns.map((column, colIndex) => (
              <th
                key={column.key as string}
                className={`
                  ${cellPadding}
                  text-${column.align || 'left'}
                  font-semibold text-gray-200
                  border-b border-gray-700
                  ${column.sortable ? 'cursor-pointer hover:bg-gray-700' : ''}
                  ${column.width || ''}
                `}
                role="columnheader"
                aria-sort={
                  sortColumn === column.key
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
                onClick={() => column.sortable && handleSort(column.key as string)}
                onKeyDown={(e: any) => {
                  if (column.sortable && (e.key === KEYBOARD_KEYS.ENTER || e.key === KEYBOARD_KEYS.SPACE)) {
                    e.preventDefault();
                    handleSort(column.key as string);
                  }
                }}
                tabIndex={column.sortable ? 0 : -1}
                scope="col"
              >
                <div className="flex items-center justify-between">
                  <span>{column.label}</span>
                  {column.sortable && (
                    <span className="ml-2" aria-hidden="true">
                      {sortColumn === column.key ? (
                        sortDirection === 'asc' ? '↑' : '↓'
                      ) : (
                        <span className="text-gray-500">↕</span>
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 text-gray-400"
                role="cell"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const rowKey = keyExtractor ? keyExtractor(row, rowIndex) : rowIndex;
              const isSelected = selectedRows.has(rowIndex);
              
              return (
                <tr
                  key={rowKey}
                  className={`
                    ${striped && rowIndex % 2 === 0 ? 'bg-gray-800/50' : ''}
                    ${hoverable ? 'hover:bg-gray-700/50' : ''}
                    ${isSelected ? 'bg-blue-900/30' : ''}
                    ${selectable ? 'cursor-pointer' : ''}
                    transition-colors
                  `}
                  role="row"
                  aria-rowindex={rowIndex + 2}
                  aria-selected={selectable ? isSelected : undefined}
                  onClick={() => selectable && onRowSelect && onRowSelect(row, rowIndex)}
                >
                  {columns.map((column, colIndex) => {
                    const value = column.key in row ? row[column.key as keyof T] : '';
                    const cellContent = column.render ? column.render(value, row, rowIndex) : value;
                    
                    return (
                      <td
                        key={`${rowKey}-${column.key as string}`}
                        className={`
                          ${cellPadding}
                          text-${column.align || 'left'}
                          text-gray-300
                          border-b border-gray-700/50
                        `}
                        role="cell"
                        aria-colindex={colIndex + 1}
                        data-row={rowIndex}
                        data-col={colIndex}
                        tabIndex={focusedCell.row === rowIndex && focusedCell.col === colIndex ? 0 : -1}
                        onKeyDown={(e: any) => handleKeyDown(e, rowIndex, colIndex)}
                        onFocus={() => setFocusedCell({ row: rowIndex, col: colIndex })}
                        aria-label={column.ariaLabel ? column.ariaLabel(row) : undefined}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      
      {/* Screen reader summary */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {`Table with ${data.length} rows and ${columns.length} columns. ${
          selectable ? 'Press Enter or Space to select a row.' : ''
        } Use arrow keys to navigate.`}
      </div>
    </div>
  );

export default AccessibleTable;