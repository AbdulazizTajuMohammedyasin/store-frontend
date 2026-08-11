import { useQuery } from "@tanstack/react-query";
import { getCollections } from "@/api/collections";

const useCollections = () => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: getCollections,
    staleTime: 1000 * 60 * 10,
  });
};

export default useCollections;