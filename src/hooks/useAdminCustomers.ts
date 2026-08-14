import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomerMembership } from "@/api/customers";
import type { UpdateCustomerMembershipData } from "@/types/customer";

export const useUpdateCustomerMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateCustomerMembershipData;
    }) => updateCustomerMembership(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-customers"] });
    },
  });
};