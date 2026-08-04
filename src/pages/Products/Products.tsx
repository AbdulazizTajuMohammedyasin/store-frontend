import { useState } from "react";

import ProductCard from "../../components/ProductCard";
import ProductFilterBar from "../../components/ProductFilterBar";
import RecommendedProducts from "../../components/RecommendedProducts";

import useProducts from "../../hooks/useProducts";

import type { ProductParams } from "../../types";

export const Products = () => {
  const [searchText, setSearchText] = useState("");

  const [filters, setFilters] = useState<ProductParams>({});

  const { data, isLoading, error } = useProducts(filters);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error loading products.</p>;

  return (
    <div className="container mt-4">
      <RecommendedProducts />

      <hr className="my-5" />

      <ProductFilterBar
        filters={filters}
        searchText={searchText}
        setSearchText={setSearchText}
        onFilterChange={setFilters}
      />

      <h2 className="mb-4">All Products</h2>

      <div className="row">
        {data?.data.map((product) => (
          <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};
