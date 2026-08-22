import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder } from "@/hooks/useOrders";
import { pageContainer, pageSubtitle, pageTitle } from "@/lib/Store";

export default function OrderDetail() {
  const { id } = useParams();
  const { data, isLoading, error } = useOrder(id!);

  if (isLoading) {
    return (
      <div className={pageContainer}>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-6 h-32 w-full rounded-xl" />
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

  const order = data!.data;

  return (
    <div className={pageContainer}>
      <div className="mb-8">
        <h1 className={pageTitle}>Order #{order.id}</h1>
        <p className={pageSubtitle}>Order details and items.</p>
      </div>

      <Card className="mb-6">
        <CardContent className="space-y-3 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant="secondary">{order.payment_status}</Badge>
          </div>
          <p className="text-sm">
            <span className="text-muted-foreground">Placed at: </span>
            {new Date(order.placed_at).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <h2 className="mb-4 text-lg font-semibold">Items</h2>

      <div className="space-y-3">
        {order.items.map((item) => (
          <Card key={item.id}>
            <CardContent className="py-4">
              <p className="font-medium">{item.product.title}</p>
              <div className="mt-2 grid gap-1 text-sm text-muted-foreground sm:grid-cols-3">
                <p>Quantity: {item.quantity}</p>
                <p>Unit price: £{item.unit_price}</p>
                <p>Total: £{(item.unit_price * item.quantity).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
