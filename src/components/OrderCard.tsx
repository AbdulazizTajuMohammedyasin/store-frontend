import type { Order } from "../types/order";

interface Props {
  order: Order;
}

export default function OrderCard({ order }: Props) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5>Order #{order.id}</h5>

        <p>Status: {order.payment_status}</p>

        <p>Date: {new Date(order.placed_at).toLocaleString()}</p>

        <p>Items: {order.items.length}</p>
      </div>
    </div>
  );
}
