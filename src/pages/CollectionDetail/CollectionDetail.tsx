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
      <div className="container mt-4">
        <h3>Loading...</h3>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mt-4">
        <h3>Something went wrong</h3>
      </div>
    );
  }

  const products = data?.data ?? [];

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Collection Products</h1>

      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
