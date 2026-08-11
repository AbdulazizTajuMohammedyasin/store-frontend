import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts, getProduct, createProduct } from "../api/products";
import type {ProductParams} from "../types";

export const useProducts = (
  params?: ProductParams
) => {
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

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};