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

export default function AdminOrders() {
  const { data: ordersResponse, isLoading, isError } = useOrders();
  const { data: customers } = useAllCustomers();

  const updateOrder = useUpdateOrder();

  const [search, setSearch] = useState("");

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<"P" | "C" | "F">("P");

  const orders = ordersResponse?.data ?? [];

  // id -> customer lookup, built once whenever the customer list changes.
  const customersById = useMemo(() => {
    const map = new Map<number, (typeof customers)[number]>();
    customers?.forEach((customer) => map.set(customer.id, customer));
    return map;
  }, [customers]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return orders;
    }

    return orders.filter((order) => {
      const customerLabel = getCustomerLabel(
        customersById.get(order.customer),
        order.customer,
      ).toLowerCase();

      return (
        String(order.id).toLowerCase().includes(query) ||
        customerLabel.includes(query)
      );
    });
  }, [orders, search, customersById]);

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

      {/* ================= SEARCH ================= */}

      <Card>
        <CardHeader>
          <CardTitle>Search Orders</CardTitle>
        </CardHeader>

        <CardContent>
          <Input
            placeholder="Search by order ID, customer name, or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
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
                  <TableCell colSpan={6} className="text-center">
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
        <DialogContent className="flex max-h-[85vh] w-[95vw] max-w-4xl flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>

            <DialogDescription>
              View order details and update payment status.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
              {/* ORDER INFORMATION */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {(() => {
                  const customer = customersById.get(selectedOrder.customer);
                  const hasName = Boolean(
                    `${customer?.first_name ?? ""} ${customer?.last_name ?? ""}`.trim(),
                  );

                  return (
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Customer</p>

                      <p className="mt-1 font-medium">
                        {getCustomerLabel(customer, selectedOrder.customer)}
                      </p>

                      {hasName && customer?.email && (
                        <p className="text-sm text-muted-foreground">
                          {customer.email}
                        </p>
                      )}
                    </div>
                  );
                })()}

                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Order Date</p>

                  <p className="mt-1 font-medium">
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

              <div className="flex justify-end border-t pt-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>

                  <p className="text-xl font-bold">
                    RM{" "}
                    {selectedOrder.items
                      .reduce(
                        (total, item) =>
                          total + Number(item.unit_price) * item.quantity,
                        0,
                      )
                      .toFixed(2)}
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

          <DialogFooter className="border-t px-6 py-4">
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
