import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductFilterBar from "@/components/ProductFilterBar";
import Pagination from "@/components/Pagination";
import RecommendedProducts from "@/components/RecommendedProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useProducts";
import { pageContainer, pageSubtitle, pageTitle } from "@/lib/Store";
import type { ProductParams } from "@/types";

const PAGE_SIZE = 12;

export const Products = () => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<ProductParams>({});

  const { data, isLoading, error } = useProducts({ ...filters, page });

  const handleFilterChange = (newFilters: ProductParams) => {
    setFilters(newFilters);
    setPage(1);
  };

  const totalPages = data?.data.count
    ? Math.ceil(data.data.count / PAGE_SIZE)
    : 1;

  return (
    <div className={pageContainer}>
      <div className="mb-8">
        <h1 className={pageTitle}>All products</h1>
        <p className={pageSubtitle}>Browse and filter our full catalog.</p>
      </div>

      <RecommendedProducts />

      <ProductFilterBar
        filters={filters}
        searchText={searchText}
        setSearchText={setSearchText}
        onFilterChange={handleFilterChange}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">Error loading products.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {data?.data.results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="mt-8">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
