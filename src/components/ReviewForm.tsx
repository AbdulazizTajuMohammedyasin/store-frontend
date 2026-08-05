import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useCreateReview, useUpdateReview } from "../hooks/useReviews";

interface Props {
  productId: number;
  review?: {
    id: number;
    rating: number;
    comment: string;
  };
}

interface FormData {
  rating: number;
  comment: string;
}

export default function ReviewForm({ productId, review }: Props) {
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      rating: review?.rating ?? 5,
      comment: review?.comment ?? "",
    },
  });

  useEffect(() => {
    if (review) {
      reset({
        rating: review.rating,
        comment: review.comment,
      });
    }
  }, [review, reset]);

  const createReview = useCreateReview(productId);

  const updateReview = useUpdateReview(productId, review?.id ?? 0);

  const onSubmit = (data: FormData) => {
    if (review) {
      updateReview.mutate(data);
    } else {
      createReview.mutate(data, {
        onSuccess: () => {
          reset({
            rating: 5,
            comment: "",
          });
        },
      });
    }
  };

  const isPending = createReview.isPending || updateReview.isPending;

  return (
    <div className="card p-4">
      <h4>{review ? "Edit Your Review" : "Write a Review"}</h4>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label>Rating</label>

          <select
            className="form-select"
            {...register("rating", {
              valueAsNumber: true,
            })}
          >
            <option value={5}>5 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={2}>2 Stars</option>
            <option value={1}>1 Star</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Comment</label>

          <textarea
            className="form-control"
            rows={4}
            {...register("comment")}
          />
        </div>

        <button type="submit" className="btn btn-dark" disabled={isPending}>
          {review
            ? isPending
              ? "Updating..."
              : "Update Review"
            : isPending
              ? "Submitting..."
              : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
