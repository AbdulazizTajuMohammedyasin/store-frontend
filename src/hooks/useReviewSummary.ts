import { useQuery } from "@tanstack/react-query";
import { getReviewSummary } from "../api/reviewsummary";

export const useReviewSummary = (
  productId?: number,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["review-summary", productId],

    queryFn: () =>
      getReviewSummary(productId as number),
    enabled: productId !== undefined && enabled,
    refetchOnWindowFocus: false
  });
};