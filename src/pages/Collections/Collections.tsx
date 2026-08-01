import { useQuery } from "@tanstack/react-query";
import { getCollections } from "../../api/collections";
import CollectionCard from "../../components/CollectionCard";

export default function Collections() {
  const { data, isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: getCollections,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const collections = data?.data;

  return (
    <div className="container">
      <div className="row g-4">
        {collections?.map((collection) => (
          <div className="col-md-4" key={collection.id}>
            <CollectionCard collection={collection} />
          </div>
        ))}
      </div>
    </div>
  );
}
