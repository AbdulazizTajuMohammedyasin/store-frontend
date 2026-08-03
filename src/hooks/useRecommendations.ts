import { useQuery } from "@tanstack/react-query";

import { getSimilarProducts } from "../api/recommendation";

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