import OrderCard from "../../components/OrderCard";
import { useOrders } from "../../hooks/useOrders";

export default function Orders() {
  const { data, isLoading, error } = useOrders();

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error loading orders.</p>;

  const orders = data?.data ?? [];

  return (
    <div className="container mt-5">
      <h1>My Orders</h1>

      <div className="mt-4">
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
}
