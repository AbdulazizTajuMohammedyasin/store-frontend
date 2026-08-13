import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAdminCollections,
  createAdminCollection,
  updateAdminCollection,
  deleteAdminCollection,
} from "@/api/admincollections";
import type { CollectionInput } from "@/api/admincollections";

export const useAdminCollections = () => {
  return useQuery({
    queryKey: ["admin-collections"],
    queryFn: getAdminCollections,
  });
};

export const useCreateAdminCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CollectionInput) =>
      createAdminCollection(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-collections"],
      });

      // Also refresh normal collections if they are
      // currently cached.
      queryClient.invalidateQueries({
        queryKey: ["collections"],
      });
    },
  });
};

export const useUpdateAdminCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: CollectionInput;
    }) => updateAdminCollection(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-collections"],
      });

      queryClient.invalidateQueries({
        queryKey: ["collections"],
      });
    },
  });
};

export const useDeleteAdminCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      deleteAdminCollection(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-collections"],
      });

      queryClient.invalidateQueries({
        queryKey: ["collections"],
      });
    },
  });
};