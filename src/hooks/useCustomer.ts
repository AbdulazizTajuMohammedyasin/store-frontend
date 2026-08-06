import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentCustomer,updateCustomer} from "../api/customers";


export const useCustomer = () => {
  const queryClient = useQueryClient();
  const customerQuery = useQuery({
    queryKey: ["customer"],
    queryFn: getCurrentCustomer,
  });
  const updateMutation = useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customer"],
      });
    },
  });

  return {
    ...customerQuery,
    updateCustomer: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};