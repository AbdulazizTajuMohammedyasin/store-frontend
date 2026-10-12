import OrderCard from "@/components/OrderCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/useOrders";
import { pageContainer, pageSubtitle, sectionTitle } from "@/lib/Store";

export default function Orders() {
  const { data, isLoading, error } = useOrders();
  const orders = data?.data ?? [];

  return (
    <div className={pageContainer}>
      <div className="mb-8">
        <h1 className={sectionTitle}>My orders</h1>
        <p className={pageSubtitle}>Track your past purchases.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-none" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">Error loading orders.</p>
      ) : orders.length === 0 ? (
        <div className="border border-border px-5 py-10 text-center text-muted-foreground">
          No orders yet.
        </div>
      ) : (
        orders.map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </div>
  );
}