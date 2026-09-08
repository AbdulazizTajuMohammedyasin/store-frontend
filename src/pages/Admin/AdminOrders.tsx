import { useMemo, useState } from "react";

import { useOrders, useUpdateOrder } from "@/hooks/useOrders";
import { useAllCustomers } from "@/hooks/useAllCustomers";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

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
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";

const getCustomerLabel = (
  customer:
    | { first_name: string; last_name: string; email: string }
    | undefined,
  customerId: number,
) => {
  if (!customer) return `Customer #${customerId}`;

  const fullName = `${customer.first_name} ${customer.last_name}`.trim();

  return fullName || customer.email || `Customer #${customerId}`;
};

const getStatusLabel = (status: "P" | "C" | "F") => {
  switch (status) {
    case "P":
      return "Pending";

    case "C":
      return "Complete";

    case "F":
      return "Failed";

    default:
      return status;
  }
};

const getOrderTotal = (order: {
  items: { unit_price: string | number; quantity: number }[];
}) =>
  order.items.reduce(
    (total, item) => total + Number(item.unit_price) * item.quantity,
    0,
  );

type SortOption =
  | "newest"
  | "oldest"
  | "pending-first"
  | "complete-first"
  | "failed-first";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest → Oldest" },
  { value: "oldest", label: "Oldest → Newest" },
  { value: "pending-first", label: "Pending first" },
  { value: "complete-first", label: "Complete first" },
  { value: "failed-first", label: "Failed first" },
];

// Lower number sorts first when a status-priority sort is selected.
const STATUS_PRIORITY: Record<
  SortOption,
  Partial<Record<"P" | "C" | "F", number>>
> = {
  "pending-first": { P: 0, C: 1, F: 1 },
  "complete-first": { C: 0, P: 1, F: 1 },
  "failed-first": { F: 0, P: 1, C: 1 },
  newest: {},
  oldest: {},
};

export default function AdminOrders() {
  const { data: ordersResponse, isLoading, isError } = useOrders();
  const { data: customers } = useAllCustomers();

  const updateOrder = useUpdateOrder();

  const [search, setSearch] = useState("");

  const [sortOption, setSortOption] = useState<SortOption>("newest");

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<"P" | "C" | "F">("P");

  const orders = ordersResponse?.data ?? [];

  // id -> customer lookup, built once whenever the customer list changes.
  const customersById = useMemo(() => {
    const map = new Map<number, NonNullable<typeof customers>[number]>();
    customers?.forEach((customer) => map.set(customer.id, customer));
    return map;
  }, [customers]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    const matched = !query
      ? orders
      : orders.filter((order) => {
          const customerLabel = getCustomerLabel(
            customersById.get(order.customer),
            order.customer,
          ).toLowerCase();

          return (
            String(order.id).toLowerCase().includes(query) ||
            customerLabel.includes(query)
          );
        });

    const sorted = [...matched];

    const priorityMap = STATUS_PRIORITY[sortOption];
    const isStatusSort = Object.keys(priorityMap).length > 0;

    sorted.sort((a, b) => {
      if (isStatusSort) {
        const priorityDiff =
          (priorityMap[a.payment_status] ?? 1) -
          (priorityMap[b.payment_status] ?? 1);

        if (priorityDiff !== 0) return priorityDiff;

        // Same status group: fall back to newest first.
        return (
          new Date(b.placed_at).getTime() - new Date(a.placed_at).getTime()
        );
      }

      const diff =
        new Date(a.placed_at).getTime() - new Date(b.placed_at).getTime();

      return sortOption === "oldest" ? diff : -diff;
    });

    return sorted;
  }, [orders, search, customersById, sortOption]);

  const selectedOrder = orders.find((order) => order.id === selectedOrderId);

  const openOrder = (orderId: number) => {
    const order = orders.find((order) => order.id === orderId);

    if (!order) return;

    setSelectedOrderId(order.id);
    setSelectedStatus(order.payment_status);
  };

  const closeOrder = () => {
    setSelectedOrderId(null);
  };

  const handleStatusChange = () => {
    if (selectedOrderId === null) return;

    updateOrder.mutate(
      {
        id: selectedOrderId,
        data: {
          payment_status: selectedStatus,
        },
      },
      {
        onSuccess: () => {
          closeOrder();
        },
      },
    );
  };

  if (isLoading) {
    return <div className="p-6">Loading orders...</div>;
  }

  if (isError) {
    return <div className="p-6">Failed to load orders.</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* ================= HEADER ================= */}

      <div>
        <h1 className="text-2xl font-bold">Orders</h1>

        <p className="text-muted-foreground">
          Manage customer orders and payment status.
        </p>
      </div>

      {/* ================= SEARCH & SORT ================= */}

      <Card>
        <CardHeader>
          <CardTitle>Search Orders</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Search by order ID, customer name, or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="sm:flex-1"
          />

          <Select
            value={sortOption}
            onValueChange={(value) => setSortOption(value as SortOption)}
          >
            <SelectTrigger className="sm:w-56">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>

            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* ================= ORDERS TABLE ================= */}

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>

                <TableHead>Customer</TableHead>

                <TableHead>Date</TableHead>

                <TableHead>Items</TableHead>

                <TableHead>Total</TableHead>

                <TableHead>Status</TableHead>

                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  {/* ORDER */}

                  <TableCell className="font-medium">#{order.id}</TableCell>

                  {/* CUSTOMER */}

                  <TableCell>
                    {(() => {
                      const customer = customersById.get(order.customer);
                      const hasName = Boolean(
                        `${customer?.first_name ?? ""} ${customer?.last_name ?? ""}`.trim(),
                      );

                      return (
                        <>
                          <div className="font-medium">
                            {getCustomerLabel(customer, order.customer)}
                          </div>

                          {hasName && customer?.email && (
                            <div className="text-sm text-muted-foreground">
                              {customer.email}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </TableCell>

                  {/* DATE */}

                  <TableCell>
                    {new Date(order.placed_at).toLocaleDateString()}
                  </TableCell>

                  {/* ITEMS */}

                  <TableCell>
                    {order.items.reduce(
                      (total, item) => total + item.quantity,
                      0,
                    )}
                  </TableCell>

                  {/* TOTAL */}

                  <TableCell className="font-medium">
                    RM {getOrderTotal(order).toFixed(2)}
                  </TableCell>

                  {/* STATUS */}

                  <TableCell>
                    <Badge
                      variant={
                        order.payment_status === "C"
                          ? "default"
                          : order.payment_status === "F"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {getStatusLabel(order.payment_status)}
                    </Badge>
                  </TableCell>

                  {/* ACTIONS */}

                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openOrder(order.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ================= ORDER DETAILS ================= */}

      <Dialog
        open={selectedOrderId !== null}
        onOpenChange={(open) => {
          if (!open) {
            closeOrder();
          }
        }}
      >
        <DialogContent className="flex max-h-[90vh] w-[95vw] max-w-[95vw] flex-col gap-0 overflow-hidden p-0 lg:max-w-6xl xl:max-w-7xl">
          <DialogHeader className="border-b px-8 py-5">
            <DialogTitle className="text-xl">
              Order #{selectedOrder?.id}
            </DialogTitle>

            <DialogDescription>
              View order details and update payment status.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-8 py-6">
              {/* ORDER INFORMATION */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {(() => {
                  const customer = customersById.get(selectedOrder.customer);
                  const hasName = Boolean(
                    `${customer?.first_name ?? ""} ${customer?.last_name ?? ""}`.trim(),
                  );

                  return (
                    <div className="min-w-0 rounded-lg border p-5">
                      <p className="text-sm text-muted-foreground">Customer</p>

                      <p className="mt-1 break-words font-medium">
                        {getCustomerLabel(customer, selectedOrder.customer)}
                      </p>

                      {hasName && customer?.email && (
                        <p className="mt-0.5 break-words text-sm text-muted-foreground">
                          {customer.email}
                        </p>
                      )}
                    </div>
                  );
                })()}

                <div className="min-w-0 rounded-lg border p-5">
                  <p className="text-sm text-muted-foreground">Order Date</p>

                  <p className="mt-1 break-words font-medium">
                    {new Date(selectedOrder.placed_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* ORDER ITEMS */}

              <div>
                <h3 className="mb-3 font-semibold">Order Items</h3>

                <div className="min-w-0 overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[45%]">Product</TableHead>

                        <TableHead>Quantity</TableHead>

                        <TableHead>Unit Price</TableHead>

                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="whitespace-normal break-words">
                            {item.product.title}
                          </TableCell>

                          <TableCell>{item.quantity}</TableCell>

                          <TableCell>
                            RM {Number(item.unit_price).toFixed(2)}
                          </TableCell>

                          <TableCell className="text-right font-medium">
                            RM{" "}
                            {(Number(item.unit_price) * item.quantity).toFixed(
                              2,
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* ORDER TOTAL */}

              <div className="flex justify-end border-t pt-5">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>

                  <p className="text-2xl font-bold">
                    RM {getOrderTotal(selectedOrder).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* STATUS */}

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Status</label>

                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    setSelectedStatus(value as "P" | "C" | "F")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="P">Pending</SelectItem>

                    <SelectItem value="C">Complete</SelectItem>

                    <SelectItem value="F">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter className="border-t px-8 py-5">
            <Button type="button" variant="outline" onClick={closeOrder}>
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleStatusChange}
              disabled={updateOrder.isPending}
            >
              {updateOrder.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
