import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../../api/products";
import ProductCard from "../../components/ProductCard";

export default function CollectionDetail() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["collection-products", id],

    queryFn: () =>
      getProducts({
        collection: id,
      }),

    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="mx-auto mt-6 w-full max-w-7xl px-4">
        <h3>Loading...</h3>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto mt-6 w-full max-w-7xl px-4">
        <h3>Something went wrong</h3>
      </div>
    );
  }

  const products = data?.data.results ?? [];

  return (
    <div className="mx-auto mt-6 w-full max-w-7xl px-4">
      <h1 className="mb-6">Collection Products</h1>

      <div className="grid grid-cols-1 gap-x-6 md:grid-cols-3">
        {products.map((product) => (
          <div className="mb-6" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
