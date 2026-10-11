import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const pageButton = "h-11 min-w-11 rounded-none px-3 tabular-nums";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  return (
    <nav aria-label="Pagination" className="flex justify-center">
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <Button
          variant="outline"
          className={pageButton}
          disabled={isLoading || currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              aria-hidden="true"
              className="px-1 text-muted-foreground"
            >
              …
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              disabled={isLoading}
              className={pageButton}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          className={pageButton}
          disabled={isLoading || currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
}
