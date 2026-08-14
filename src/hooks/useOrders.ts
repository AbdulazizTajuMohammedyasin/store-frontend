import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createOrder,
  getOrder,
  getOrders,
  updateOrder
} from "../api/orders";

import type {UpdateOrderData } from "@/types/order"

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

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateOrderData;
    }) => updateOrder(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["order", variables.id],
      });
    },
  });
};