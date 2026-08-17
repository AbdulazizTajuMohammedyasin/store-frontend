import { useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart, useUpdateCartItem, useDeleteCartItem } from "@/hooks/useCart";
import { pageContainer, pageSubtitle, pageTitle } from "@/lib/Store";

export default function Cart() {
  const { data, isLoading, error } = useCart();
  const updateMutation = useUpdateCartItem();
  const deleteMutation = useDeleteCartItem();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className={pageContainer}>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-6 h-40 w-full rounded-xl" />
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

  const cart = data?.data?.[0];

  if (!cart || cart.cartitem_set.length === 0) {
    return (
      <div className={pageContainer}>
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" />
            <div>
              <h1 className={pageTitle}>Your cart is empty</h1>
              <p className={pageSubtitle}>Add products to get started.</p>
            </div>
            <Button onClick={() => navigate("/products")}>
              Browse products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={pageContainer}>
      <div className="mb-8">
        <h1 className={pageTitle}>Shopping cart</h1>
        <p className={pageSubtitle}>Review items before checkout.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {cart.cartitem_set.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{item.product.title}</p>
                  <p className="text-sm text-muted-foreground">
                    £{item.product.price} each
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() =>
                      updateMutation.mutate({
                        id: item.id,
                        quantity: item.quantity - 1,
                      })
                    }
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="size-4" />
                  </Button>

                  <span className="min-w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>

                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() =>
                      updateMutation.mutate({
                        id: item.id,
                        quantity: item.quantity + 1,
                      })
                    }
                  >
                    <Plus className="size-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="ml-auto sm:ml-2"
                    onClick={() => deleteMutation.mutate(item.id)}
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </Button>
                </div>

                <p className="font-semibold sm:text-right">
                  £{item.total_price}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <CardContent className="space-y-4 py-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">£{cart.total_price}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span>£{cart.total_price}</span>
            </div>
            <Button
              className="h-11 w-full"
              onClick={() => navigate("/payment")}
            >
              Proceed to payment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
