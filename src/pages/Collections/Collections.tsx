import CollectionCard from "@/components/CollectionCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useCollections from "@/hooks/useCollections";
import { pageContainer, pageSubtitle, pageTitle } from "@/lib/Store";

export default function Collections() {
  const { data, isLoading } = useCollections();
  const collections = data?.data ?? [];

  return (
    <div className={pageContainer}>
      <div className="mb-8">
        <h1 className={pageTitle}>Collections</h1>
        <p className={pageSubtitle}>Shop by curated categories.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] rounded-xl" />
          ))}
        </div>
      ) : collections.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No collections available yet.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
