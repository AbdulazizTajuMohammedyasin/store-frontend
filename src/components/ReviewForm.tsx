import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview, useUpdateReview } from "@/hooks/useReviews";

interface Props {
  productId: number;
  review?: { id: number; rating: number; comment: string };
}

interface FormData {
  rating: number;
  comment: string;
}

export default function ReviewForm({ productId, review }: Props) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>({
    defaultValues: {
      rating: review?.rating ?? 5,
      comment: review?.comment ?? "",
    },
  });

  useEffect(() => {
    if (review) {
      reset({ rating: review.rating, comment: review.comment });
    }
  }, [review, reset]);

  const createReview = useCreateReview(productId);
  const updateReview = useUpdateReview(productId, review?.id ?? 0);
  const rating = watch("rating");

  const onSubmit = (data: FormData) => {
    if (review) {
      updateReview.mutate(data);
    } else {
      createReview.mutate(data, {
        onSuccess: () => reset({ rating: 5, comment: "" }),
      });
    }
  };

  const isPending = createReview.isPending || updateReview.isPending;

  return (
    <section
      aria-labelledby="review-form-title"
      className="border p-6"
    >
      <h2
        id="review-form-title"
        className="font-display text-2xl leading-none font-extrabold uppercase [font-stretch:68%]"
      >
        {review ? "Edit your review" : "Write a review"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="review-rating">Rating</Label>
          <Select
            value={String(rating)}
            onValueChange={(value) => setValue("rating", Number(value))}
          >
            <SelectTrigger
              id="review-rating"
              className="h-11 w-full rounded-none data-[size=default]:h-11"
            >
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              {[5, 4, 3, 2, 1].map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value} star{value !== 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comment">Comment</Label>
          <Textarea
            id="comment"
            rows={4}
            className="rounded-none"
            {...register("comment")}
          />
        </div>

        <Button
          type="submit"
          className="h-11 w-full rounded-none px-6 sm:w-fit"
          disabled={isPending}
        >
          {review
            ? isPending
              ? "Updating..."
              : "Update review"
            : isPending
              ? "Submitting..."
              : "Submit review"}
        </Button>
      </form>
    </section>
  );
}
