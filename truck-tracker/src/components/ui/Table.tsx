import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <table className={cn('w-full', className)}>
        {children}
      </table>
    </div>
  );
};

interface TableHeaderProps {
  children: React.ReactNode;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return (
    <thead className="bg-secondary-50 border-b-2 border-secondary-200">
      {children}
    </thead>
  );
};

interface TableBodyProps {
  children: React.ReactNode;
}

export const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  return <tbody className="divide-y divide-secondary-200">{children}</tbody>;
};

interface TableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const TableRow: React.FC<TableRowProps> = ({ children, onClick, className }) => {
  return (
    <tr
      className={cn(
        'transition-colors',
        onClick && 'cursor-pointer hover:bg-secondary-50',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

interface TableHeadProps {
  children: React.ReactNode;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
  className?: string;
}

export const TableHead: React.FC<TableHeadProps> = ({
  children,
  sortable = false,
  sortDirection,
  onSort,
  className,
}) => {
  return (
    <th
      className={cn(
        'px-6 py-3 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider',
        sortable && 'cursor-pointer select-none hover:bg-secondary-100 transition-colors',
        className
      )}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && (
          <div className="flex flex-col">
            <ChevronUp
              size={12}
              className={cn(
                'transition-colors',
                sortDirection === 'asc' ? 'text-primary-600' : 'text-secondary-400'
              )}
            />
            <ChevronDown
              size={12}
              className={cn(
                'transition-colors -mt-1',
                sortDirection === 'desc' ? 'text-primary-600' : 'text-secondary-400'
              )}
            />
          </div>
        )}
      </div>
    </th>
  );
};

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}

export const TableCell: React.FC<TableCellProps> = ({ children, className, colSpan }) => {
  return (
    <td className={cn('px-6 py-4 text-sm text-secondary-900', className)} colSpan={colSpan}>
      {children}
    </td>
  );
};
