import { Skeleton } from "@/components/ui/skeleton";
import { productGrid } from "@/lib/Store";

export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={productGrid} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square rounded-none bg-tile" />
          <Skeleton className="h-4 w-4/5 rounded-none" />
          <Skeleton className="h-4 w-1/3 rounded-none" />
        </div>
      ))}
    </div>
  );
}
