import { useQuery } from "@tanstack/react-query";

import { getSimilarProducts, getUserRecommendations } from "../api/recommendation";

export const useSimilarProducts = (
  productId: number | string
) => {
  return useQuery({
    queryKey: ["similar-products", productId],

    queryFn: () =>
      getSimilarProducts(productId),

    enabled: !!productId,
  });
};

export const useUserRecommendations =
  () => {
    return useQuery({
      queryKey: ["user-recommendations", ],

      queryFn:
        getUserRecommendations,
    });

};