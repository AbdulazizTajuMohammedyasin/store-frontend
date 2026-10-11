import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, RotateCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { neutralLink } from "@/lib/Store";
import { useReviews } from "@/hooks/useReviews";
import { useReviewSummary } from "@/hooks/useReviewSummary";
import { useAuth } from "@/context/AuthContext";
import ReviewForm from "./ReviewForm";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-foreground">
      <span className="sr-only">Rated {rating} out of 5</span>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={
            i < rating
              ? "size-3.5 fill-current"
              : "size-3.5 text-muted-foreground/40"
          }
        />
      ))}
    </div>
  );
}

export default function ReviewList({ productId }: { productId: number }) {
  const { data, isLoading } = useReviews(productId);
  const { user } = useAuth();

  const [wantSummary, setWantSummary] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const {
    data: summaryData,
    isFetching: summaryLoading,
    isError: summaryError,
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
      ? "Hide summary"
      : "Reviews summary";

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
      <div className="space-y-8">
        {reviews.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-11 gap-2 rounded-none px-4"
                onClick={handleSummaryClick}
                disabled={summaryLoading}
              >
                <Sparkles className="size-4" />
                {buttonLabel}
              </Button>

              {showSummary && summaryData && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-11 rounded-none"
                  onClick={() => refetchSummary()}
                  disabled={summaryLoading}
                  title="Regenerate summary"
                  aria-label="Regenerate summary"
                >
                  <RotateCw className="size-4" />
                </Button>
              )}
            </div>

            <div aria-live="polite">
              {summaryLoading && (
                <div className="space-y-2 bg-tile p-5">
                  <Skeleton className="h-4 w-full rounded-none" />
                  <Skeleton className="h-4 w-5/6 rounded-none" />
                  <Skeleton className="h-4 w-2/3 rounded-none" />
                </div>
              )}

              {!summaryLoading && showSummary && summaryError && !summaryData && (
                <p className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  Summary isn't available right now.
                </p>
              )}

              {!summaryLoading && showSummary && summaryData && (
                <div className="bg-tile p-5">
                  <p className="leading-relaxed">{summaryData.data.summary}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet.</p>
        ) : (
          <ul className="divide-y border-y">
            {reviews.map((review) => (
              <li key={review.id} className="py-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold">{review.reviewed_by}</p>
                  <Stars rating={review.rating} />
                </div>
                <p className="mt-2 leading-relaxed">{review.comment}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        {!user && (
          <div className="flex flex-col gap-4 bg-tile p-6">
            <p className="text-muted-foreground">Login to leave a review.</p>
            <Button
              asChild
              variant="outline"
              className="h-11 w-fit rounded-none border-foreground bg-transparent px-6 dark:bg-transparent"
            >
              <Link to="/login" className={neutralLink}>
                Login
              </Link>
            </Button>
          </div>
        )}

        {user && <ReviewForm productId={productId} review={userReview} />}
      </div>
    </div>
  );
}
