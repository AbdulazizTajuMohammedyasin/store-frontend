import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createOrder,
  getOrder,
  getOrders,
} from "../api/orders";



export const useOrders = () => {

  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

};



export const useOrder = (
  id: number | string
) => {

  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id),
  });

};



export const useCreateOrder = () => {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: createOrder,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

    },

  });

};