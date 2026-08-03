import ProductCard from "./ProductCard";

import { useSimilarProducts } from "../hooks/useRecommendations";

interface Props {
  productId: number;
}

export default function SimilarProducts({ productId }: Props) {
  const { data, isLoading, error } = useSimilarProducts(productId);

  if (isLoading) return <p>Loading similar products...</p>;

  if (error) return null;

  const recommendations = data?.data ?? [];

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-5">
      <h3 className="mb-4">Similar Products</h3>

      <div className="row">
        {recommendations.map((recommendation) => (
          <div key={recommendation.product.id} className="col-md-3 mb-4">
            <ProductCard product={recommendation.product} />
          </div>
        ))}
      </div>
    </div>
  );
}
