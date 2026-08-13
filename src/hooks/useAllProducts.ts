import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/products";
import type { Product } from "@/types";

export const useAllProducts = () => {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const allProducts: Product[] = [];

      let page = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await getProducts({
          page,
        });

        const data = response.data;

        allProducts.push(...data.results);

        if (data.next) {
          page += 1;
        } else {
          hasNextPage = false;
        }
      }

      return allProducts;
    },
  });
};