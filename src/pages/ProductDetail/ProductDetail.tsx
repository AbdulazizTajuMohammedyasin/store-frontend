import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SimilarProducts from "@/components/SimilarProducts";
import ReviewList from "@/components/ReviewList";
import { useProduct } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { pageContainer } from "@/lib/Store";

const tabTrigger =
  "h-12 flex-none rounded-none px-0 text-base data-active:bg-transparent dark:data-active:bg-transparent";

export const ProductDetail = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useProduct(id!);
  const addToCartMutation = useAddToCart();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (addToCartMutation.isSuccess) {
      setJustAdded(true);
      const timer = setTimeout(() => setJustAdded(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [addToCartMutation.isSuccess]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className={pageContainer}>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Skeleton className="aspect-square rounded-none bg-tile" />
          <div className="space-y-5">
            <Skeleton className="h-5 w-32 rounded-none" />
            <Skeleton className="h-10 w-4/5 rounded-none" />
            <Skeleton className="h-8 w-28 rounded-none" />
            <Skeleton className="h-24 w-full rounded-none" />
            <Skeleton className="h-12 w-48 rounded-none" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={pageContainer}>
        <p
          role="alert"
          className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          Something went wrong.
        </p>
      </div>
    );
  }

  const product = data!.data;
  const image = product.images[0]?.image || "/default.jpg";

  return (
    <div className={pageContainer}>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-square overflow-hidden bg-tile">
          <img
            src={image}
            alt={product.title}
            className="size-full object-cover"
          />
        </div>

        <div className="flex flex-col lg:py-4">
          <p className="w-fit bg-tile px-2 py-1 text-xs font-medium">
            {product.collection}
          </p>

          <h1 className="mt-4 font-display text-3xl leading-tight font-semibold [font-stretch:112%] sm:text-4xl">
            {product.title}
          </h1>

          <p className="mt-5 text-3xl font-semibold tabular-nums">
            £{product.price}
          </p>

          <p className="mt-6 max-w-prose leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-8 border-t pt-8">
            <Button
              size="lg"
              className="h-12 w-full rounded-none bg-signal px-10 text-base text-signal-foreground hover:bg-signal/85 sm:w-fit"
              onClick={() =>
                addToCartMutation.mutate({
                  product_id: product.id,
                  quantity: 1,
                })
              }
              disabled={addToCartMutation.isPending || justAdded}
            >
              {justAdded ? (
                <>
                  <Check className="size-4" />
                  Added to cart
                </>
              ) : (
                <>
                  <ShoppingCart className="size-4" />
                  {addToCartMutation.isPending ? "Adding..." : "Add to cart"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-16 sm:mt-20">
        <Tabs defaultValue="reviews">
          <TabsList
            variant="line"
            className="w-full justify-start gap-8 border-b group-data-horizontal/tabs:h-12"
          >
            <TabsTrigger value="reviews" className={tabTrigger}>
              Reviews
            </TabsTrigger>
            <TabsTrigger value="similar" className={tabTrigger}>
              Similar products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="mt-8">
            <ReviewList productId={product.id} />
          </TabsContent>

          <TabsContent value="similar" className="mt-8">
            <SimilarProducts productId={product.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
