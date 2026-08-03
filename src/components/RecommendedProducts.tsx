import ProductCard from "./ProductCard";

import { useUserRecommendations } from "../hooks/useRecommendations";
import type { ProductRecommendation } from "../types/recommendation";
import { useAuth } from "../context/AuthContext";

export default function RecommendedProducts() {
  const { user } = useAuth();

  if (!user) return null;
  const { data, isLoading, error } = useUserRecommendations();

  if (isLoading) return <p>Loading recommendations...</p>;

  if (error) return null;

  const recommendations = data?.data ?? [];

  if (recommendations.length === 0) return null;

  return (
    <div className="mb-5">
      <h2 className="mb-4">Recommended For You</h2>

      <div className="row">
        {recommendations
          .slice(0, 4)
          .map((recommendation: ProductRecommendation) => (
            <div key={recommendation.product.id} className="col-md-4 mb-4">
              <ProductCard product={recommendation.product} />
            </div>
          ))}
      </div>
    </div>
  );
}
