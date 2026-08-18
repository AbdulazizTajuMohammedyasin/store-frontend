import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SimilarProducts from "@/components/SimilarProducts";
import ReviewList from "@/components/ReviewList";
import { useProduct } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { pageContainer } from "@/lib/Store";

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

  if (isLoading) {
    return (
      <div className={pageContainer}>
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-11 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={pageContainer}>
        <p className="text-sm text-destructive">Something went wrong.</p>
      </div>
    );
  }

  const product = data!.data;
  const image = product.images[0]?.image || "/default.jpg";

  return (
    <div className={pageContainer}>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <Card className="overflow-hidden py-0">
          <img
            src={image}
            alt={product.title}
            className="aspect-square w-full object-cover"
          />
        </Card>

        <div className="flex flex-col">
          <Badge variant="secondary" className="mb-3 w-fit">
            {product.collection}
          </Badge>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {product.title}
          </h1>

          <p className="mt-4 text-3xl font-bold">£{product.price}</p>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {product.description}
          </p>

          <Button
            size="lg"
            className="mt-6 h-11 w-full sm:w-fit"
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

      <div className="mt-12">
        <Tabs defaultValue="reviews">
          <TabsList>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="similar">Similar products</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="mt-6">
            <ReviewList productId={product.id} />
          </TabsContent>

          <TabsContent value="similar" className="mt-6">
            <SimilarProducts productId={product.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
