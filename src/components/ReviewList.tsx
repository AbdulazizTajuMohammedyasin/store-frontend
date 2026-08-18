import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { neutralLink } from "@/lib/Store";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/context/AuthContext";
import ReviewForm from "./ReviewForm";

export default function ReviewList({ productId }: { productId: number }) {
  const { data, isLoading } = useReviews(productId);
  const { user } = useAuth();

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Loading reviews...</p>;

  const reviews = data?.data ?? [];
  const userReview = reviews.find(
    (review) => review.reviewed_by === user?.username,
  );

  return (
    <div className="space-y-6">
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{review.reviewed_by}</p>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm">{review.comment}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(review.created_at).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))
      )}

      {!user && (
        <Card>
          <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Login to leave a review.
            </p>
            <Button asChild size="sm">
              <Link to="/login" className={neutralLink}>
                Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {user && <ReviewForm productId={productId} review={userReview} />}
    </div>
  );
}
