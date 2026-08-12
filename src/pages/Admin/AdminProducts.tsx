import { useEffect, useState } from "react";
import {
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
} from "@/hooks/useProducts";
import {
  useCreateProductImage,
  useDeleteProductImage,
} from "@/hooks/useProductImages";
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
  images: z.array(z.instanceof(File)).optional(),
});

// z.coerce fields make the "input" (before validation) type differ from the
// "output" (after validation) type. Giving useForm both fixes the resolver
// generic mismatch you were seeing (ts2322 / ts2345).
type ProductFormInput = z.input<typeof productSchema>;
type ProductFormOutput = z.output<typeof productSchema>;

export default function AdminProducts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | undefined>(
    undefined,
  );
  const isEditing = editingProductId !== undefined;

  const { data: collectionsData } = useCollections();
  const collections = collectionsData?.data ?? [];

  const { data, isLoading, isError } = useProducts({
    page,
    search: search || undefined,
  });

  // Fires only once editingProductId is set (see "enabled" in useProduct).
  // This hits GET /products/:id, which — for a staff user — returns the
  // admin serializer with the real `inventory` value and a numeric
  // `collection` id, unlike the list rows which omit inventory entirely.
  const { data: editingProductResponse, isFetching: isLoadingEditingProduct } =
    useProduct(editingProductId);

  const createProductMutation = useCreateProduct();
  const createProductImageMutation = useCreateProductImage();
  const deleteProductImageMutation = useDeleteProductImage();
  const updateProductMutation = useUpdateProduct();

  const form = useForm<ProductFormInput, unknown, ProductFormOutput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      inventory: 0,
      price: 0,
      collection: undefined,
      images: [],
    },
  });

  useEffect(() => {
    const product = editingProductResponse?.data;
    if (!product) return;

    form.reset({
      title: product.title,
      description: product.description,
      inventory: product.inventory,
      price: Number(product.price),
      collection: product.collection,
      images: [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProductResponse]);

  const closeDialog = () => {
    form.reset();
    setEditingProductId(undefined);
    setOpen(false);
  };

  const onSubmit = (values: ProductFormOutput) => {
    const { images, ...productData } = values;

    const uploadImages = async (productId: number) => {
      if (!images || images.length === 0) return;
      // Uploaded sequentially rather than Promise.all so a failure partway
      // through doesn't fire a burst of parallel requests against the
      // same product; simpler to reason about for now.
      for (const image of images) {
        await createProductImageMutation.mutateAsync({ productId, image });
      }
    };

    if (isEditing) {
      updateProductMutation.mutate(
        { id: editingProductId, data: productData },
        {
          onSuccess: async () => {
            await uploadImages(editingProductId);
            closeDialog();
          },
        },
      );
      return;
    }

    createProductMutation.mutate(productData, {
      onSuccess: async (response) => {
        const productId = response.data.id;
        await uploadImages(productId);
        closeDialog();
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
            if (!nextOpen) {
              closeDialog();
            } else {
              setOpen(true);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProductId(undefined)}>
              Add Product
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Product" : "Create Product"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update this product's details."
                  : "Add a new product."}
              </DialogDescription>
            </DialogHeader>

            {isEditing && isLoadingEditingProduct && (
              <p className="text-sm text-muted-foreground">
                Loading product details...
              </p>
            )}

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
                <Field>
                  <FieldLabel>Product Images</FieldLabel>

                  {isEditing && (
                    <div className="flex flex-wrap gap-3">
                      {(editingProductResponse?.data.images ?? []).length ===
                        0 &&
                        !isLoadingEditingProduct && (
                          <p className="text-xs text-muted-foreground">
                            No images yet.
                          </p>
                        )}

                      {(editingProductResponse?.data.images ?? []).map(
                        (existingImage) => (
                          <div
                            key={existingImage.id}
                            className="relative h-20 w-20"
                          >
                            <img
                              src={existingImage.image}
                              alt=""
                              className="h-20 w-20 rounded-md object-cover"
                            />
                            <button
                              type="button"
                              aria-label="Delete image"
                              disabled={deleteProductImageMutation.isPending}
                              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground disabled:opacity-50"
                              onClick={() => {
                                // Deletes immediately rather than waiting
                                // for "Save Changes" — matches typical
                                // admin UX where removing an image is its
                                // own action, not part of the form diff.
                                deleteProductImageMutation.mutate({
                                  productId: editingProductId,
                                  imageId: existingImage.id,
                                });
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </Field>

                <Controller
                  name="images"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="product-image">
                        {isEditing ? "Add New Images" : "Product Images"}
                      </FieldLabel>

                      <Input
                        id="product-image"
                        type="file"
                        accept="image/*"
                        multiple
                        aria-invalid={fieldState.invalid}
                        onChange={(event) => {
                          const files = event.target.files
                            ? Array.from(event.target.files)
                            : [];
                          field.onChange(files);
                        }}
                      />

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
                disabled={
                  createProductMutation.isPending ||
                  updateProductMutation.isPending ||
                  (isEditing && isLoadingEditingProduct)
                }
              >
                {isEditing
                  ? updateProductMutation.isPending
                    ? "Saving..."
                    : "Save Changes"
                  : createProductMutation.isPending
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Just open the dialog and set the id — the actual
                        // GET /products/:id fetch (via useProduct) and the
                        // form.reset() with the real inventory + numeric
                        // collection id happen in the useEffect above once
                        // that request resolves.
                        setEditingProductId(product.id);
                        setOpen(true);
                      }}
                    >
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
