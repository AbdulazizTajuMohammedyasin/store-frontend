import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductImage, deleteProductImage } from "../api/productimage";

export const useCreateProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      image,
    }: {
      productId: number;
      image: File;
    }) => createProductImage(productId, image),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
    },
  });
};

export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      imageId,
    }: {
      productId: number;
      imageId: number;
    }) => deleteProductImage(productId, imageId),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
    },
  });
};