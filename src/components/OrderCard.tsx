import { Link } from "react-router-dom";
import { ChevronRight, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { neutralLink } from "@/lib/Store";
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

export default function OrderCard({ order }: { order: Order }) {
  const itemCount = order.items.length;

  return (
    <Link to={`/orders/${order.id}`} className={cn(neutralLink, "block")}>
      <div className="mb-3 border border-border bg-card transition-colors hover:bg-muted/40">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <Package className="size-4 shrink-0 text-muted-foreground" />
              <p className="font-medium">Order #{order.id}</p>
              <span
                className={cn(
                  "px-2 py-0.5 text-xs font-medium",
                  STATUS_CLASS[order.payment_status],
                )}
              >
                {STATUS_LABEL[order.payment_status]}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(order.placed_at).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </p>
          </div>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        </div>
      </div>
    </Link>
  );
}
