import { Link } from "react-router-dom";
import type { Collection } from "../types";
import "./CollectionCard.css";

interface Props {
  collection: Collection;
}

export default function CollectionCard({ collection }: Props) {
  return (
    <Link
      to={`/collections/${collection.id}`}
      className="text-decoration-none text-dark"
    >
      <div className="card h-100 shadow-sm collection-card">
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
    </Link>
  );
}
