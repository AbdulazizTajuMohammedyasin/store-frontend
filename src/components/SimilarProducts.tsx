import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useSimilarProducts } from "@/hooks/useRecommendations";

export default function SimilarProducts({ productId }: { productId: number }) {
  const { data, isLoading, error } = useSimilarProducts(productId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) return null;

  const recommendations = data?.data ?? [];
  if (recommendations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No similar products found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
      {recommendations.map((item) => (
        <ProductCard key={item.product.id} product={item.product} />
      ))}
    </div>
  );
}
