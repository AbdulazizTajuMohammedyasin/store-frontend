import client from "./client";

export interface ReviewSummary {
  summary: string;
}

export const getReviewSummary = (
  productId: number
) => {
  return client.get<ReviewSummary>(
    `/products/${productId}/summary/`
  );
};