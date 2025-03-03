import { useMemo } from 'react';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/shadcnUi/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pageNumbers = useMemo(() => {
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        '...',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  }, [currentPage, totalPages]);

  return (
    <nav
      className="flex items-center justify-center space-x-2"
      aria-label="Навигация по страницам"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Предыдущая страница"
        title="Предыдущая страница"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="hidden space-x-2 sm:flex" role="list">
        {pageNumbers.map((pageNumber, index) =>
          pageNumber === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-4 py-2"
              aria-hidden="true"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? 'default' : 'outline'}
              onClick={() =>
                typeof pageNumber === 'number' && onPageChange(pageNumber)
              }
              aria-current={currentPage === pageNumber ? 'page' : undefined}
              aria-label={`Страница ${pageNumber}`}
            >
              {pageNumber}
            </Button>
          )
        )}
      </div>
      <div className="sm:hidden">
        <span className="text-sm font-medium" role="status">
          {currentPage} из {totalPages}
        </span>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Следующая страница"
        title="Следующая страница"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};
