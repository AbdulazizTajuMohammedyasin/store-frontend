import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAddresses, createAddress, updateAddress, deleteAddress } from "../api/address";
import type { Address } from "../types/address";

export function useAddress() {
  return useQuery({
    queryKey: ["address"],
    queryFn: async () => {
      const response = await getAddresses();
      return response.data[0] ?? null;
    },
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["address"],
      });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Omit<Address, "id">;
    }) => updateAddress(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["address"],
      });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["address"],
      });
    },
  });
}