import { useParams } from "react-router-dom";
import { useProduct } from "../../hooks/useProducts";

export const ProductDetail = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useProduct(id!);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Something went wrong.</p>;

  const product = data!.data;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.images[0]?.image || "/default.jpg"}
            alt={product.title}
            className="img-fluid rounded"
          />
        </div>

        <div className="col-md-6">
          <h2>{product.title}</h2>

          <p className="text-muted">{product.collection}</p>

          <h3>£{product.price}</h3>

          <p>{product.description}</p>

          <button className="btn btn-success">Add To Cart</button>
        </div>
      </div>
    </div>
  );
};
