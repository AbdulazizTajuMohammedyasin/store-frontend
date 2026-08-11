import { useState } from "react";
import { useProducts, useCreateProduct } from "@/hooks/useProducts";
import useCollections from "@/hooks/useCollections";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const productSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  inventory: z.coerce.number().min(0, "Inventory cannot be negative."),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  collection: z.coerce.number().min(1, "Collection ID is required."),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AdminProducts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data: collectionsData } = useCollections();
  const collections = collectionsData?.data ?? [];

  const { data, isLoading, isError } = useProducts({
    page,
    search: search || undefined,
  });
  const createProductMutation = useCreateProduct();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      inventory: 0,
      price: 0,
      collection: undefined,
    },
  });

  const onSubmit = (values: ProductFormData) => {
    createProductMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
      },
    });
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (isError) {
    return <div>Failed to load products.</div>;
  }

  const products = data?.data.results ?? [];
  const totalProducts = data?.data.count ?? 0;

  const hasNextPage = data?.data.next !== null;
  const hasPreviousPage = data?.data.previous !== null;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>

          <p className="text-sm text-muted-foreground">
            Manage your store products
          </p>
        </div>

        <Dialog
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (!nextOpen) {
              form.reset();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Product</DialogTitle>
              <DialogDescription>Add a new product.</DialogDescription>
            </DialogHeader>

            <form
              className="space-y-0"
              id="create-product-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup>
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="product-title">Title</FieldLabel>
                      <Input
                        {...field}
                        id="product-title"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="product-description">
                        Description
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id="product-description"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="inventory"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="product-inventory">
                        Inventory
                      </FieldLabel>
                      <Input
                        {...field}
                        id="product-inventory"
                        type="number"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="price"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="product-price">Price</FieldLabel>
                      <Input
                        {...field}
                        id="product-price"
                        type="number"
                        step="0.01"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="collection"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="product-collection">
                        Collection ID
                      </FieldLabel>
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger
                          id="product-collection"
                          className="w-full"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Select a collection" />
                        </SelectTrigger>

                        <SelectContent>
                          {collections.map((collection) => (
                            <SelectItem
                              key={collection.id}
                              value={String(collection.id)}
                            >
                              {collection.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>

            <DialogFooter>
              <Button
                type="submit"
                form="create-product-form"
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending
                  ? "Creating..."
                  : "Create Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />

        <p className="text-sm text-muted-foreground">
          {totalProducts} products
        </p>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Collection</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Images</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  {/* Product */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.images.length > 0 ? (
                        <img
                          src={product.images[0].image}
                          alt={product.title}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-xs">
                          No image
                        </div>
                      )}

                      <div>
                        <p className="font-medium">{product.title}</p>

                        <p className="text-xs text-muted-foreground">
                          ID: {product.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Collection */}
                  <TableCell>{product.collection}</TableCell>

                  {/* Price */}
                  <TableCell>RM {Number(product.price).toFixed(2)}</TableCell>

                  {/* Images */}
                  <TableCell>{product.images.length}</TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Page {page}</p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={!hasPreviousPage}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            disabled={!hasNextPage}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
