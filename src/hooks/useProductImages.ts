import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductImage } from "@/api/productimage";

export const useCreateProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      image,
    }: {
      productId: number | string;
      image: File;
    }) => createProductImage(productId, image),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-images", variables.productId],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};