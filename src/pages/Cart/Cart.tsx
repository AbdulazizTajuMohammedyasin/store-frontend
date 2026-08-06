import {
  useCart,
  useUpdateCartItem,
  useDeleteCartItem,
} from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useCreateOrder } from "../../hooks/useOrders";

export default function Cart() {
  const { data, isLoading, error } = useCart();

  const updateMutation = useUpdateCartItem();

  const deleteMutation = useDeleteCartItem();

  const navigate = useNavigate();

  const createOrderMutation = useCreateOrder();

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Something went wrong.</p>;

  const cart = data?.data?.[0];

  if (!cart || cart.cartitem_set.length === 0) {
    return (
      <div className="container mt-5">
        <h3>Your cart is empty</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Shopping Cart</h1>

      {cart.cartitem_set.map((item) => (
        <div key={item.id} className="card mb-3">
          <div className="card-body">
            <h5>{item.product.title}</h5>

            <p>Price: £{item.product.price}</p>

            <div className="d-flex align-items-center gap-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() =>
                  updateMutation.mutate({
                    id: item.id,
                    quantity: item.quantity - 1,
                  })
                }
                disabled={item.quantity <= 1}
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                className="btn btn-outline-secondary"
                onClick={() =>
                  updateMutation.mutate({
                    id: item.id,
                    quantity: item.quantity + 1,
                  })
                }
              >
                +
              </button>

              <button
                className="btn btn-danger ms-auto"
                onClick={() => deleteMutation.mutate(item.id)}
              >
                Remove
              </button>
            </div>

            <p className="mt-3">Subtotal: £{item.total_price}</p>
          </div>
        </div>
      ))}

      <hr />

      <h3>Total: £{cart.total_price}</h3>

      <button
        className="btn btn-success mt-3"
        onClick={() => navigate("/payment")}
      >
        Proceed to Payment
      </button>
    </div>
  );
}
