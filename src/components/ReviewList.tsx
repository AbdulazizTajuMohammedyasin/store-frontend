import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { neutralLink } from "@/lib/Store";
import { useReviews } from "@/hooks/useReviews";
import { useReviewSummary } from "@/hooks/useReviewSummary";
import { useAuth } from "@/context/AuthContext";
import ReviewForm from "./ReviewForm";

export default function ReviewList({ productId }: { productId: number }) {
  const { data, isLoading } = useReviews(productId);
  const { user } = useAuth();

  const [wantSummary, setWantSummary] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const {
    data: summaryData,
    isFetching: summaryLoading,
    refetch: refetchSummary,
  } = useReviewSummary(productId, wantSummary);

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Loading reviews...</p>;

  const reviews = data?.data ?? [];
  const userReview = reviews.find(
    (review) => review.reviewed_by === user?.username,
  );

  function handleSummaryClick() {
    if (!wantSummary) {
      setWantSummary(true);
      setShowSummary(true);
    } else if (summaryData && showSummary) {
      setShowSummary(false);
    } else {
      setShowSummary(true);
    }
  }

  const buttonLabel = summaryLoading
    ? "Summarizing..."
    : showSummary
      ? "Hide Summary"
      : "✨ Reviews Summary";

  return (
    <div className="space-y-6">
      {reviews.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={handleSummaryClick}
              disabled={summaryLoading}
            >
              {buttonLabel}
            </Button>

            {showSummary && summaryData && (
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full size-8"
                onClick={() => refetchSummary()}
                disabled={summaryLoading}
                title="Regenerate summary"
              >
                <RotateCw className="size-3.5" />
              </Button>
            )}
          </div>

          {summaryLoading && (
            <Card>
              <CardContent className="py-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          )}

          {!summaryLoading && showSummary && summaryData && (
            <Card>
              <CardContent className="py-4">
                <p className="text-sm">{summaryData.data.summary}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

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
