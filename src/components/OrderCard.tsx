import { Link } from "react-router-dom";
import { ChevronRight, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { neutralLink } from "@/lib/Store";
import type { Order } from "@/types/order";

export default function OrderCard({ order }: { order: Order }) {
  const badgeVariant =
    order.payment_status === "C"
      ? "default"
      : order.payment_status === "P"
        ? "secondary"
        : "destructive";

  return (
    <Link to={`/orders/${order.id}`} className={cn(neutralLink, "block")}>
      <Card className="mb-3 transition-shadow hover:shadow-md">
        <CardContent className="flex items-center justify-between gap-4 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Package className="size-4 text-muted-foreground" />
              <p className="font-medium">Order #{order.id}</p>
              <Badge variant={badgeVariant}>{order.payment_status}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(order.placed_at).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  );
}
