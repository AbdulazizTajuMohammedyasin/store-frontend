import { Link } from "react-router-dom";

import { useReviews } from "../hooks/useReviews";
import { useAuth } from "../context/AuthContext";
import ReviewForm from "./ReviewForm";

interface Props {
  productId: number;
}

export default function ReviewList({ productId }: Props) {
  const { data, isLoading } = useReviews(productId);
  const { user } = useAuth();

  if (isLoading) return <p>Loading reviews...</p>;

  const reviews = data?.data ?? [];

  const userReview = reviews.find(
    (review) => review.reviewed_by === user?.username,
  );

  return (
    <>
      <div>
        <h3 className="mb-4">Customer Reviews</h3>

        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map((review) => (
          <div key={review.id} className="card mb-3">
            <div className="card-body">
              <h6>{review.reviewed_by}</h6>

              <p>{"⭐".repeat(review.rating)}</p>

              <p>{review.comment}</p>

              <small className="text-muted">
                {new Date(review.created_at).toLocaleString()}
              </small>
            </div>
          </div>
        ))}
      </div>

      {!user && (
        <div className="alert alert-info">
          <Link to="/login" className="btn btn-primary">
            Login to Review
          </Link>
        </div>
      )}

      {user && <ReviewForm productId={productId} review={userReview} />}
    </>
  );
}
