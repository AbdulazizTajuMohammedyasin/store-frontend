import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { neutralLink } from "@/lib/Store";
import type { Collection } from "@/types";

export default function CollectionCard({
  collection,
}: {
  collection: Collection;
}) {
  const image = collection.featured_product?.image || "/default.jpg";

  return (
    <Link
      to={`/collections/${collection.id}`}
      className={cn(neutralLink, "group block h-full")}
    >
      <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={image}
            alt={collection.title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
            <p className="text-[10px] tracking-[0.15em] text-white/70 uppercase sm:text-xs">
              Collection
            </p>
            <h3 className="mt-1 text-base font-semibold sm:text-lg">
              {collection.title}
            </h3>
            {collection.featured_product && (
              <p className="mt-1 line-clamp-2 text-xs text-white/80 sm:text-sm">
                Featured: {collection.featured_product.title}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
