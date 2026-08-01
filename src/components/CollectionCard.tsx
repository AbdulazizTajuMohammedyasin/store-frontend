import type { Collection } from "../types";

interface Props {
  collection: Collection;
}

export default function CollectionCard({ collection }: Props) {
  return (
    <div className="card h-100">
      <img
        src={collection.featured_product?.image || "/default.jpg"}
        className="card-img-top"
        alt={collection.title}
      />

      <div className="card-body">
        <h5 className="card-title">{collection.title}</h5>

        {collection.featured_product && (
          <p className="card-text text-muted">
            Featured: {collection.featured_product.title}
          </p>
        )}
      </div>
    </div>
  );
}
