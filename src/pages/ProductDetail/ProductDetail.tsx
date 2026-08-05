import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "../../hooks/useProducts";
import { useAddToCart } from "../../hooks/useCart";
import SimilarProducts from "../../components/SimilarProducts";
import ReviewList from "../../components/ReviewList";

import "./ProductDetail.css";

export const ProductDetail = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useProduct(id!);

  const addToCartMutation = useAddToCart();

  const [activeTab, setActiveTab] = useState<"reviews" | "similar">("reviews");

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Something went wrong.</p>;

  const product = data!.data;

  return (
    <>
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

            <button
              className="btn btn-success"
              onClick={() =>
                addToCartMutation.mutate({
                  product_id: product.id,
                  quantity: 1,
                })
              }
              disabled={addToCartMutation.isPending}
            >
              {addToCartMutation.isPending ? "Adding..." : "Add To Cart"}
            </button>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="tab-buttons">
          <button
            className={activeTab === "reviews" ? "active" : ""}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>

          <button
            className={activeTab === "similar" ? "active" : ""}
            onClick={() => setActiveTab("similar")}
          >
            Similar Products
          </button>
        </div>

        <div className="slider-container">
          <div
            className={`slider ${
              activeTab === "similar" ? "show-similar" : ""
            }`}
          >
            <div className="page">
              <ReviewList productId={product.id} />
            </div>

            <div className="page">
              <SimilarProducts productId={product.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
