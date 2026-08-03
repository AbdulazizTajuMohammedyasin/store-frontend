import { useParams } from "react-router-dom";
import { useOrder } from "../../hooks/useOrders";

export default function OrderDetail() {
  const { id } = useParams();

  const { data, isLoading, error } = useOrder(id!);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Something went wrong.</p>;

  const order = data!.data;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Order #{order.id}</h1>

      <div className="card mb-4">
        <div className="card-body">
          <p>
            <strong>Status:</strong> {order.payment_status}
          </p>

          <p>
            <strong>Placed At:</strong>{" "}
            {new Date(order.placed_at).toLocaleString()}
          </p>
        </div>
      </div>

      <h3 className="mb-3">Items</h3>

      {order.items.map((item) => (
        <div key={item.id} className="card mb-3">
          <div className="card-body">
            <h5>{item.product.title}</h5>

            <p>Quantity: {item.quantity}</p>

            <p>Unit Price: £{item.unit_price}</p>

            <p>Total: £{(item.unit_price * item.quantity).toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
