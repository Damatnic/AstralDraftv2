import React, { useMemo } from 'react';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;

}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }: any) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm sm:px-4 md:px-6 lg:px-8">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRightIcon className="w-4 h-4 text-[var(--text-muted)] sm:px-4 md:px-6 lg:px-8" />
          )}
          {index === items.length - 1 ? (
            <span className="text-[var(--text-primary)] font-medium sm:px-4 md:px-6 lg:px-8" aria-current="page">
              {item.label}
            </span>
          ) : (
            <button
              onClick={item.onClick}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors sm:px-4 md:px-6 lg:px-8"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};