import {useMutation,useQuery,useQueryClient,} from "@tanstack/react-query";

import {getReviews,createReview,updateReview,} from "../api/reviews";



export const useReviews = (
  productId: number
) => {
  return useQuery({
    queryKey: ["reviews",productId,],
    queryFn: () =>
      getReviews(productId),
  });
};

export const useCreateReview =
  (productId: number) => {

    const queryClient =
      useQueryClient();

    return useMutation({

      mutationFn: (
        data: {
          rating: number;
          comment: string;
        }
      ) =>
        createReview(
          productId,
          data
        ),

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "reviews",
              productId,
            ],
          }
        );
        queryClient.invalidateQueries(
          {
            queryKey: [
              "review-summary", 
              productId
            ],
          }
        );
      },
    });
  };

export const useUpdateReview = (
  productId: number,
  reviewId: number
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: {
        rating: number;
        comment: string;
      }
    ) =>
      updateReview(
        productId,
        reviewId,
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "reviews",
          productId,
        ],
      });
      queryClient.invalidateQueries(
          {
            queryKey: [
              "review-summary", 
              productId
            ],
          }
        );
    },
  });
};