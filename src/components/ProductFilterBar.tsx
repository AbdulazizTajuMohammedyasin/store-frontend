import type { ProductParams } from "../types";

interface Props {
  filters: ProductParams;
  searchText: string;
  setSearchText: (value: string) => void;
  onFilterChange: (filters: ProductParams) => void;
}

export default function ProductFilterBar({
  filters,
  searchText,
  setSearchText,
  onFilterChange,
}: Props) {
  return (
    <div className="card shadow-sm p-3 mb-4">
      <div className="row g-2 align-items-center">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <button
            className="btn btn-dark w-100"
            onClick={() =>
              onFilterChange({
                ...filters,
                search: searchText,
              })
            }
          >
            Search
          </button>
        </div>

        <div className="col-md-2">
          <input
            type="number"
            placeholder="Min Price"
            className="form-control"
            value={filters.price_min || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                price_min: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>

        <div className="col-md-2">
          <input
            type="number"
            placeholder="Max Price"
            className="form-control"
            value={filters.price_max || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                price_max: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>

      <hr />

      <div className="d-flex gap-2 flex-wrap">
        <button
          className="btn btn-outline-secondary"
          onClick={() =>
            onFilterChange({
              ...filters,
              ordering: "",
            })
          }
        >
          Default
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() =>
            onFilterChange({
              ...filters,
              ordering: "price",
            })
          }
        >
          Price ↑
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() =>
            onFilterChange({
              ...filters,
              ordering: "-price",
            })
          }
        >
          Price ↓
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() =>
            onFilterChange({
              ...filters,
              ordering: "title",
            })
          }
        >
          A-Z
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() =>
            onFilterChange({
              ...filters,
              ordering: "-title",
            })
          }
        >
          Z-A
        </button>
      </div>
    </div>
  );
}
