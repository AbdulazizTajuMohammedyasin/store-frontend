import { Link } from "react-router-dom";

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
      <div className="aspect-[4/5] overflow-hidden bg-tile">
        <img
          src={image}
          alt=""
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      <h3 className="mt-3 font-display text-2xl leading-none font-extrabold uppercase underline-offset-4 [font-stretch:68%] group-hover:underline">
        {collection.title}
      </h3>
      {collection.featured_product && (
        <p className="mt-1.5 line-clamp-1 text-sm text-muted-foreground">
          Featured: {collection.featured_product.title}
        </p>
      )}
    </Link>
  );
}
