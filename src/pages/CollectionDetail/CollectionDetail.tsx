import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../../api/products";
import ProductCard from "../../components/ProductCard";
import ProductGridSkeleton from "../../components/ProductGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { displayTitle, pageContainer, productGrid } from "@/lib/Store";

export default function CollectionDetail() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["collection-products", id],

    queryFn: () =>
      getProducts({
        collection: id,
      }),

    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className={pageContainer}>
        <Skeleton className="mb-10 h-14 w-2/3 max-w-md rounded-none" />
        <ProductGridSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={pageContainer}>
        <p
          role="alert"
          className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          Something went wrong
        </p>
      </div>
    );
  }

  const products = data?.data.results ?? [];
  // Every product in this list belongs to the collection, so its name is
  // already in the response — no extra request needed for the heading.
  const collectionName = products[0]?.collection || "Collection products";

  return (
    <div className={pageContainer}>
      <h1 className={`${displayTitle} mb-10`}>{collectionName}</h1>

      <div className={productGrid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showCollection={false}
          />
        ))}
      </div>
    </div>
  );
}
