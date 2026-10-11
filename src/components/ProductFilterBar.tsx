import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ProductParams } from "@/types";

interface Props {
  filters: ProductParams;
  searchText: string;
  setSearchText: (value: string) => void;
  onFilterChange: (filters: ProductParams) => void;
}

const sortOptions = [
  { label: "Default", value: "" },
  { label: "Price ↑", value: "price", ariaLabel: "Price, low to high" },
  { label: "Price ↓", value: "-price", ariaLabel: "Price, high to low" },
  { label: "A-Z", value: "title", ariaLabel: "Name, A to Z" },
  { label: "Z-A", value: "-title", ariaLabel: "Name, Z to A" },
] as const;

const field = "h-11 rounded-none bg-background";

export default function ProductFilterBar({
  filters,
  searchText,
  setSearchText,
  onFilterChange,
}: Props) {
  return (
    <div className="mb-10 space-y-5 border-y py-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,22rem)] lg:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="product-search" className="text-sm font-medium">
            Search
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="product-search"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className={cn(field, "pl-9")}
            />
          </div>
        </div>

        <Button
          className="h-11 rounded-none px-8 md:self-end"
          onClick={() => onFilterChange({ ...filters, search: searchText })}
        >
          Search
        </Button>

        <fieldset className="space-y-1.5 md:col-span-2 lg:col-span-1">
          <legend className="mb-1.5 text-sm font-medium">Price (£)</legend>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              aria-label="Minimum price"
              placeholder="Min"
              className={field}
              value={filters.price_min ?? ""}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  price_min: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
            <Input
              type="number"
              aria-label="Maximum price"
              placeholder="Max"
              className={field}
              value={filters.price_max ?? ""}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  price_max: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
        </fieldset>
      </div>

      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
        <span id="sort-label" className="text-sm font-medium">
          Sort by
        </span>
        <div
          role="group"
          aria-labelledby="sort-label"
          className="grid grid-cols-5 gap-1.5 sm:flex sm:flex-wrap sm:gap-2"
        >
          {sortOptions.map((option) => {
            const active = (filters.ordering ?? "") === option.value;
            return (
              <Button
                key={option.label}
                variant={active ? "default" : "outline"}
                aria-pressed={active}
                aria-label={"ariaLabel" in option ? option.ariaLabel : undefined}
                className="h-11 min-w-11 rounded-none px-1 tabular-nums sm:px-4"
                onClick={() =>
                  onFilterChange({ ...filters, ordering: option.value })
                }
              >
                {option.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
