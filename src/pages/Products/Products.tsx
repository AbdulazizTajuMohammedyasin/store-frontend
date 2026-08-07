import { useState } from "react";

import ProductCard from "../../components/ProductCard";
import ProductFilterBar from "../../components/ProductFilterBar";
import Pagination from "../../components/pagination";
import RecommendedProducts from "../../components/RecommendedProducts";

import useProducts from "../../hooks/useProducts";

import type { ProductParams } from "../../types";
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

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error loading products.</p>;

  return (
    <>
      <div className="container mt-4">
        <RecommendedProducts />

        <hr className="my-5" />

        <ProductFilterBar
          filters={filters}
          searchText={searchText}
          setSearchText={setSearchText}
          onFilterChange={handleFilterChange}
        />

        <h2 className="mb-4">All Products</h2>

        <div className="row">
          {data?.data.results.map((product) => (
            <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex justify-content-center mt-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};
