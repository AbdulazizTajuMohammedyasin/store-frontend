import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductFilterBar from "@/components/ProductFilterBar";
import Pagination from "@/components/Pagination";
import RecommendedProducts from "@/components/RecommendedProducts";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import { useProducts } from "@/hooks/useProducts";
import {
  displayTitle,
  pageContainer,
  pageSubtitle,
  productGrid,
} from "@/lib/Store";
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
      <div className="mb-10">
        <h1 className={displayTitle}>All products</h1>
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
        <ProductGridSkeleton />
      ) : error ? (
        <p
          role="alert"
          className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          Error loading products.
        </p>
      ) : (
        <div className={productGrid}>
          {data?.data.results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="mt-14">
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
