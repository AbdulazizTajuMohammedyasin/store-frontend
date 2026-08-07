import type { Order } from "../types/order";
import { Link } from "react-router-dom";

interface Props {
  order: Order;
}

export default function OrderCard({ order }: Props) {
  return (
    <Link to={`/orders/${order.id}`} className="text-decoration-none text-dark">
      <div className="card mb-3">
        <div className="card-body">
          <h5>Order #{order.id}</h5>

          <p>Status: {order.payment_status}</p>

          <p>Date: {new Date(order.placed_at).toLocaleString()}</p>

          <p>Items: {order.items.length}</p>
        </div>
      </div>
    </Link>
  );
}
