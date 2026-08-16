import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { neutralLink } from "@/lib/Store";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0]?.image || "/default.jpg";

  return (
    <Card className="group h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
      <Link
        to={`/products/${product.id}`}
        className={cn(neutralLink, "flex h-full flex-col")}
      >
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={image}
            alt={product.title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <CardHeader className="gap-1 px-4">
          <CardTitle className="line-clamp-2 text-sm font-medium sm:text-base">
            {product.title}
          </CardTitle>
          <p className="line-clamp-1 text-xs text-muted-foreground sm:text-sm">
            {product.collection}
          </p>
        </CardHeader>

        <CardFooter className="mt-auto flex items-center justify-between border-t-0 bg-transparent px-4 pt-0 pb-4">
          <span className="text-base font-semibold sm:text-lg">
            £{product.price}
          </span>
          <Button size="sm" variant="outline" className="pointer-events-none">
            View
            <ArrowRight className="size-3.5" />
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
