import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ProductParams } from "@/types";

interface Props {
  filters: ProductParams;
  searchText: string;
  setSearchText: (value: string) => void;
  onFilterChange: (filters: ProductParams) => void;
}

const sortOptions = [
  { label: "Default", value: "" },
  { label: "Price ↑", value: "price" },
  { label: "Price ↓", value: "-price" },
  { label: "A-Z", value: "title" },
  { label: "Z-A", value: "-title" },
] as const;

export default function ProductFilterBar({
  filters,
  searchText,
  setSearchText,
  onFilterChange,
}: Props) {
  return (
    <Card className="mb-6 py-4">
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
          <div className="relative lg:col-span-5">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-9"
            />
          </div>

          <Button
            className="lg:col-span-2"
            onClick={() => onFilterChange({ ...filters, search: searchText })}
          >
            Search
          </Button>

          <Input
            type="number"
            placeholder="Min price"
            className="lg:col-span-2"
            value={filters.price_min ?? ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                price_min: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />

          <Input
            type="number"
            placeholder="Max price"
            className="lg:col-span-3"
            value={filters.price_max ?? ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                price_max: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <Button
              key={option.label}
              size="sm"
              variant={
                (filters.ordering ?? "") === option.value
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                onFilterChange({ ...filters, ordering: option.value })
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
