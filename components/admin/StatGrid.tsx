'use client';

import { ReactNode } from 'react';

interface StatGridProps {
  children: ReactNode;
  cols?: 2 | 3 | 4;
}

const colsMap = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

export function StatGrid({ children, cols = 4 }: StatGridProps) {
  return (
    <div className={`grid ${colsMap[cols]} gap-4`}>
      {children}
    </div>
  );
}