import client from "./client";

import type {
  Review,
} from "../types";



export const getReviews = (
  productId: number
) => {
  return client.get<Review[]>(
    `/products/${productId}/reviews/`
  );
};



export const createReview = (
  productId: number,
  data: {
    rating: number;
    comment: string;
  }
) => {
  return client.post(
    `/products/${productId}/reviews/`,
    data
  );
};

export const updateReview = (
  productId: number,
  reviewId: number,
  data: {
    rating: number;
    comment: string;
  }
) =>
  client.patch(
    `/products/${productId}/reviews/${reviewId}/`,
    data
  );