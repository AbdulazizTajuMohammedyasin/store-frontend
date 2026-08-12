import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts, getProduct, createProduct, updateProduct} from "../api/products";
import type {ProductParams, UpdateProductData} from "../types";

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

export const useProduct = (id?: number | string) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProduct(id as number | string),
        // Only fires once an id is actually set — lets AdminProducts fetch a
        // single product's full (admin) detail on demand when "Edit" is
        // clicked, instead of always running.
        enabled: id !== undefined,
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

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateProductData;
    }) => updateProduct(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};