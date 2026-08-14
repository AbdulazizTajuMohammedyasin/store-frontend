import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "@/api/customers";

export const useAllCustomers = () => {
  return useQuery({
    queryKey: ["all-customers"],
    queryFn: getCustomers,
    staleTime: 1000 * 60 * 5,
  });
};