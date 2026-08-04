import { useQuery } from "@tanstack/react-query";
import { getProducts, getProduct } from "../api/products";
import type {ProductParams} from "../types";

export default function useProducts(
  params?: ProductParams
) {
  return useQuery({
    queryKey: ["products", params],

    queryFn: () =>
      getProducts(params),

    placeholderData: (previousData) =>
      previousData,
  });
}

export const useProduct = (id: number | string) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProduct(id),
    });
};