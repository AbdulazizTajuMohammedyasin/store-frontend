import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
  useAdminCollections,
  useCreateAdminCollection,
  useDeleteAdminCollection,
  useUpdateAdminCollection,
} from "@/hooks/useAdminCollections";
import { useAllProducts } from "@/hooks/useAllProducts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Check, ChevronsUpDown } from "lucide-react";

const collectionSchema = z.object({
  title: z.string().min(1, "Title is required."),
  featured_product: z.number().nullable(),
});
type CollectionFormInput = z.input<typeof collectionSchema>;
type CollectionFormOutput = z.output<typeof collectionSchema>;

export default function AdminCollections() {
  const { data: collections, isLoading, isError } = useAdminCollections();
  const deleteCollection = useDeleteAdminCollection();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [open, setOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<
    number | undefined
  >(undefined);
  const isEditing = editingCollection !== undefined;

  const createCollectionMutation = useCreateAdminCollection();
  const updateCollectionMutation = useUpdateAdminCollection();

  const [productSearch, setProductSearch] = useState("");
  const [selectedProductName, setSelectedProductName] = useState<string | null>(
    null,
  );
  const { data: allProducts = [], isLoading: isLoadingProducts } =
    useAllProducts();
  const filteredProducts = allProducts.filter((product) =>
    product.title.toLowerCase().includes(productSearch.toLowerCase()),
  );

  const form = useForm<CollectionFormInput, unknown, CollectionFormOutput>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      title: "",
      featured_product: null,
    },
  });

  // Fix #2: use `=== undefined` so an id of 0 doesn't fall through.
  // Fix #1 + #3: populate the featured-product label and clear any
  // leftover search text when we start editing a collection.
  useEffect(() => {
    if (editingCollection === undefined || !collections) return;
    const collection = collections.find((c) => c.id === editingCollection);
    if (!collection) return;
    form.reset({
      title: collection.title,
      featured_product: collection.featured_product,
    });
    setSelectedProductName(collection.featured_product_details?.title ?? null);
    setProductSearch("");
  }, [editingCollection, collections, form]);

  const closeDialog = () => {
    form.reset();
    setEditingCollection(undefined);
    setProductSearch("");
    setSelectedProductName(null);
    setOpen(false);
  };

  const onSubmit = (values: CollectionFormOutput) => {
    if (isEditing) {
      updateCollectionMutation.mutate(
        {
          id: editingCollection!,
          data: values,
        },
        {
          onSuccess: closeDialog,
        },
      );
      return;
    }
    createCollectionMutation.mutate(values, {
      onSuccess: closeDialog,
    });
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this collection?",
    );
    if (!confirmed) return;
    setDeletingId(id);
    deleteCollection.mutate(id, {
      onSettled: () => {
        setDeletingId(null);
      },
    });
  };

  if (isLoading) {
    return <div>Loading collections...</div>;
  }
  if (isError) {
    return <div>Failed to load collections.</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Collections</h1>

          <p className="text-muted-foreground">
            Manage your product collections.
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
            <Button
              onClick={() => {
                setEditingCollection(undefined);
                form.reset({
                  title: "",
                  featured_product: null,
                });
                setProductSearch("");
                setSelectedProductName(null);
              }}
            >
              Add Collection
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Collection" : "Create Collection"}
              </DialogTitle>

              <DialogDescription>
                {isEditing
                  ? "Update collection details."
                  : "Create a new collection."}
              </DialogDescription>
            </DialogHeader>

            <form
              id="collection-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FieldGroup>
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Collection Title</FieldLabel>

                      <Input {...field} aria-invalid={fieldState.invalid} />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="featured_product"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <Field>
                        <FieldLabel>Featured Product</FieldLabel>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between"
                            >
                              <span className="truncate">
                                {selectedProductName ?? "Select a product"}
                              </span>

                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="w-[400px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search products..."
                                value={productSearch}
                                onValueChange={setProductSearch}
                              />

                              <div className="h-60 overflow-y-auto">
                                <CommandList className="max-h-none overflow-visible">
                                  {isLoadingProducts && (
                                    <div className="p-3 text-sm text-muted-foreground">
                                      Loading products...
                                    </div>
                                  )}

                                  {!isLoadingProducts &&
                                    filteredProducts.length === 0 && (
                                      <CommandEmpty>
                                        No products found.
                                      </CommandEmpty>
                                    )}

                                  <CommandGroup>
                                    <CommandItem
                                      value="none"
                                      onSelect={() => {
                                        field.onChange(null);
                                        setSelectedProductName(null);
                                        setProductSearch("");
                                      }}
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${
                                          field.value === null
                                            ? "opacity-100"
                                            : "opacity-0"
                                        }`}
                                      />
                                      No featured product
                                    </CommandItem>

                                    {filteredProducts.map((product) => (
                                      <CommandItem
                                        key={product.id}
                                        value={`${product.title} ${product.id}`}
                                        onSelect={() => {
                                          field.onChange(product.id);
                                          setSelectedProductName(product.title);
                                          setProductSearch("");
                                        }}
                                      >
                                        <Check
                                          className={`mr-2 h-4 w-4 ${
                                            field.value === product.id
                                              ? "opacity-100"
                                              : "opacity-0"
                                          }`}
                                        />

                                        {product.title}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </div>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
            </form>

            <DialogFooter>
              <Button
                form="collection-form"
                type="submit"
                disabled={
                  createCollectionMutation.isPending ||
                  updateCollectionMutation.isPending
                }
              >
                {isEditing
                  ? updateCollectionMutation.isPending
                    ? "Saving..."
                    : "Save Changes"
                  : createCollectionMutation.isPending
                    ? "Creating..."
                    : "Create Collection"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Collections</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Collection</TableHead>

                <TableHead>Featured Product</TableHead>

                <TableHead>Products</TableHead>

                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {collections?.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell className="font-medium">
                    {collection.title}
                  </TableCell>

                  <TableCell>
                    {collection.featured_product_details?.title ?? "None"}
                  </TableCell>

                  <TableCell>{collection.products_count}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCollection(collection.id);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deletingId === collection.id}
                        onClick={() => handleDelete(collection.id)}
                      >
                        {deletingId === collection.id
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {collections?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No collections found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
