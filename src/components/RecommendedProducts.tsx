import ProductCard from "./ProductCard";
import ProductGridSkeleton from "./ProductGridSkeleton";
import { useUserRecommendations } from "@/hooks/useRecommendations";
import { useAuth } from "@/context/AuthContext";
import { productGrid, sectionTitle } from "@/lib/Store";

export default function RecommendedProducts() {
  const { user } = useAuth();
  const { data, isLoading, error } = useUserRecommendations();

  if (!user) return null;
  if (error) return null;

  const recommendations = data?.data ?? [];
  if (!isLoading && recommendations.length === 0) return null;

  return (
    <section className="mb-14">
      <h2 className={sectionTitle}>Recommended for you</h2>

      <div className="mt-6">
        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className={productGrid}>
            {recommendations.slice(0, 4).map((item) => (
              <ProductCard key={item.product.id} product={item.product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
