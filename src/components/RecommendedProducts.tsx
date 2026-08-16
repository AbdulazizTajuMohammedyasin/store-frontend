import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserRecommendations } from "@/hooks/useRecommendations";
import { useAuth } from "@/context/AuthContext";
import { pageTitle } from "@/lib/Store";

export default function RecommendedProducts() {
  const { user } = useAuth();
  const { data, isLoading, error } = useUserRecommendations();

  if (!user) return null;
  if (error) return null;

  const recommendations = data?.data ?? [];
  if (!isLoading && recommendations.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className={pageTitle}>Recommended for you</h2>

      {isLoading ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {recommendations.slice(0, 4).map((item) => (
            <ProductCard key={item.product.id} product={item.product} />
          ))}
        </div>
      )}
    </section>
  );
}
