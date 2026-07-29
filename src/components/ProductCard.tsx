import type { Product } from "../types";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <div className="card">
      <img
        src={product.images[0]?.image || "/default.jpg"}
        alt={product.title}
        className="card-img-top"
      />
      <h4>{product.title}</h4>
      <p>{product.collection}</p>
      <strong>£{product.price}</strong>
    </div>
  );
}
