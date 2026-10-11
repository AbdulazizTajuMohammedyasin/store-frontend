import CollectionCard from "@/components/CollectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import useCollections from "@/hooks/useCollections";
import { displayTitle, pageContainer, pageSubtitle } from "@/lib/Store";

const collectionGrid =
  "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3";

export default function Collections() {
  const { data, isLoading } = useCollections();
  const collections = data?.data ?? [];

  return (
    <div className={pageContainer}>
      <div className="mb-10">
        <h1 className={displayTitle}>Collections</h1>
        <p className={pageSubtitle}>Shop by curated categories.</p>
      </div>

      {isLoading ? (
        <div className={collectionGrid} aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/5] rounded-none bg-tile" />
              <Skeleton className="h-6 w-1/2 rounded-none" />
              <Skeleton className="h-4 w-3/4 rounded-none" />
            </div>
          ))}
        </div>
      ) : collections.length > 0 ? (
        <div className={collectionGrid}>
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <p className="border-y py-12 text-center text-muted-foreground">
          No collections available yet.
        </p>
      )}
    </div>
  );
}
