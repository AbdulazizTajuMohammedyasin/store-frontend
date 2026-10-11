import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { neutralLink } from "@/lib/Store";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0]?.image || "/default.jpg";

  return (
    <Link
      to={`/products/${product.id}`}
      className={cn(neutralLink, "group flex h-full flex-col")}
    >
      <div className="relative aspect-square overflow-hidden bg-tile">
        <img
          src={image}
          alt={product.title}
          loading="lazy"
          className="size-full object-cover"
        />
        {product.collection && (
          <span className="absolute top-2 left-2 max-w-[calc(100%-1rem)] truncate bg-background px-2 py-1 text-[11px] leading-none font-medium text-foreground">
            {product.collection}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 pt-3">
        <h3 className="line-clamp-2 font-display text-sm leading-snug font-semibold [font-stretch:112%] underline-offset-4 group-hover:underline sm:text-[15px]">
          {product.title}
        </h3>
        <p className="mt-auto text-sm text-muted-foreground tabular-nums">
          £{product.price}
        </p>
      </div>
    </Link>
  );
}
