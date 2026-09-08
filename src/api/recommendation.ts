import client from "./client";
import type { ProductRecommendation } from "../types/recommendation";

export const getSimilarProducts = (
  productId: number | string
) => {
  return client.get<ProductRecommendation[]>(
    `/products/${productId}/similar/`
  );
};

export const getUserRecommendations = () => {
  return client.get<ProductRecommendation[]>("/recommendations/");
};