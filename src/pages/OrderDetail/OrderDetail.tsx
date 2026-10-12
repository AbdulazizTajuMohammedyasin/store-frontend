import { useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder } from "@/hooks/useOrders";
import { cn } from "@/lib/utils";
import { pageContainer, pageSubtitle, sectionTitle } from "@/lib/Store";
import type { Order } from "@/types/order";

const STATUS_LABEL: Record<Order["payment_status"], string> = {
  P: "Pending",
  C: "Completed",
  F: "Failed",
};

const STATUS_CLASS: Record<Order["payment_status"], string> = {
  P: "bg-warning/15 text-warning",
  C: "bg-success/15 text-success",
  F: "bg-destructive/15 text-destructive",
};

export default function OrderDetail() {
  const { id } = useParams();
  const { data, isLoading, error } = useOrder(id!);

  if (isLoading) {
    return (
      <div className={pageContainer}>
        <Skeleton className="h-10 w-48 rounded-none" />
        <Skeleton className="mt-6 h-32 w-full rounded-none" />
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
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0,
  );

  return (
    <div className={pageContainer}>
      <div className="mb-8">
        <h1 className={sectionTitle}>Order #{order.id}</h1>
        <p className={pageSubtitle}>Order details and items.</p>
      </div>

      {/* Summary tile */}
      <div className="mb-6 border border-border bg-card px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground">Status</span>
          <span
            className={cn(
              "px-2 py-0.5 text-xs font-medium",
              STATUS_CLASS[order.payment_status],
            )}
          >
            {STATUS_LABEL[order.payment_status]}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Placed {new Date(order.placed_at).toLocaleString()}
        </p>
      </div>

      {/* Items */}
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Items
      </h2>

      <div className="divide-y divide-border border border-border">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-4 px-5 py-4"
          >
            <p className="font-medium leading-snug">{item.product.title}</p>
            <div className="shrink-0 text-right text-sm text-muted-foreground tabular-nums">
              <p>
                {item.quantity} × £{Number(item.unit_price).toFixed(2)}
              </p>
              <p className="mt-0.5 font-medium text-foreground">
                £{(item.unit_price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Subtotal */}
      <Separator className="mt-6 mb-4" />
      <div className="flex justify-end">
        <p className="text-sm text-muted-foreground">
          Subtotal (excl. shipping &amp; tax):{" "}
          <span className="ml-2 font-semibold text-foreground tabular-nums">
            £{subtotal.toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  );
}
