import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

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
      <div className="flex flex-wrap items-center justify-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading || currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 text-muted-foreground"
            >
              …
            </span>
          ) : (
            <Button
              key={page}
              size="sm"
              variant={page === currentPage ? "default" : "outline"}
              disabled={isLoading}
              className={cn("min-w-9")}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={isLoading || currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
}
