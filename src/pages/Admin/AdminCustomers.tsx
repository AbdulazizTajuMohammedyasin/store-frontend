import { useMemo, useState } from "react";

import { useAllCustomers } from "@/hooks/useAllCustomers";
import { useUpdateCustomerMembership } from "@/hooks/useAdminCustomers";
import { useOrders } from "@/hooks/useOrders";

import type { MembershipCode } from "@/types/customer";

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

const MEMBERSHIP_LABELS: Record<MembershipCode, string> = {
  B: "Bronze",
  S: "Silver",
  G: "Gold",
};

const MEMBERSHIP_BADGE_VARIANT: Record<
  MembershipCode,
  "default" | "secondary" | "outline"
> = {
  G: "default",
  S: "secondary",
  B: "outline",
};

const getCustomerName = (customer: {
  first_name: string;
  last_name: string;
  email: string;
}) => `${customer.first_name} ${customer.last_name}`.trim() || customer.email;

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

export default function AdminCustomers() {
  const { data: customers, isLoading, isError } = useAllCustomers();
  const { data: ordersResponse } = useOrders();
  const updateMembership = useUpdateCustomerMembership();

  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  );
  const [selectedMembership, setSelectedMembership] =
    useState<MembershipCode>("B");

  const orders = ordersResponse?.data ?? [];

  // customer id -> that customer's orders, built once per orders fetch.
  const ordersByCustomer = useMemo(() => {
    const map = new Map<number, typeof orders>();
    orders.forEach((order) => {
      const existing = map.get(order.customer) ?? [];
      existing.push(order);
      map.set(order.customer, existing);
    });
    return map;
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query || !customers) return customers ?? [];

    return customers.filter((customer) => {
      const name = getCustomerName(customer).toLowerCase();
      return (
        name.includes(query) || customer.email.toLowerCase().includes(query)
      );
    });
  }, [customers, search]);

  const selectedCustomer = customers?.find((c) => c.id === selectedCustomerId);
  const selectedCustomerOrders = selectedCustomerId
    ? (ordersByCustomer.get(selectedCustomerId) ?? [])
    : [];

  const openCustomer = (customerId: number) => {
    const customer = customers?.find((c) => c.id === customerId);
    if (!customer) return;

    setSelectedCustomerId(customer.id);
    setSelectedMembership(customer.membership);
  };

  const closeCustomer = () => {
    setSelectedCustomerId(null);
  };

  const handleMembershipSave = () => {
    if (selectedCustomerId === null) return;

    updateMembership.mutate({
      id: selectedCustomerId,
      data: { membership: selectedMembership },
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading customers...</div>;
  }

  if (isError) {
    return <div className="p-6">Failed to load customers.</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* ================= HEADER ================= */}

      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-muted-foreground">
          View customer details, order history, and manage membership tiers.
        </p>
      </div>

      {/* ================= SEARCH ================= */}

      <Card>
        <CardHeader>
          <CardTitle>Search Customers</CardTitle>
        </CardHeader>

        <CardContent>
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </CardContent>
      </Card>

      {/* ================= CUSTOMERS TABLE ================= */}

      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Membership</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {getCustomerName(customer)}
                  </TableCell>

                  <TableCell className="max-w-[240px] truncate">
                    {customer.email}
                  </TableCell>

                  <TableCell>{customer.phone ?? "—"}</TableCell>

                  <TableCell>
                    <Badge
                      variant={MEMBERSHIP_BADGE_VARIANT[customer.membership]}
                    >
                      {MEMBERSHIP_LABELS[customer.membership]}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {(ordersByCustomer.get(customer.id) ?? []).length}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openCustomer(customer.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ================= CUSTOMER DETAILS ================= */}

      <Dialog
        open={selectedCustomerId !== null}
        onOpenChange={(open) => {
          if (!open) closeCustomer();
        }}
      >
        <DialogContent className="flex max-h-[90vh] w-[95vw] max-w-[95vw] flex-col gap-0 overflow-hidden p-0 lg:max-w-6xl xl:max-w-7xl">
          <DialogHeader className="border-b px-8 py-5">
            <DialogTitle className="text-xl">
              {selectedCustomer
                ? getCustomerName(selectedCustomer)
                : "Customer"}
            </DialogTitle>

            <DialogDescription>
              View customer details, order history, and manage membership.
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-8 py-6">
              {/* CUSTOMER INFO */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="min-w-0 rounded-lg border p-5">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="mt-1 break-words font-medium">
                    {selectedCustomer.email}
                  </p>
                </div>

                <div className="min-w-0 rounded-lg border p-5">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="mt-1 break-words font-medium">
                    {selectedCustomer.phone ?? "Not provided"}
                  </p>
                </div>

                <div className="min-w-0 rounded-lg border p-5">
                  <p className="text-sm text-muted-foreground">Birth Date</p>
                  <p className="mt-1 break-words font-medium">
                    {selectedCustomer.birth_date ?? "Not provided"}
                  </p>
                </div>

                <div className="min-w-0 rounded-lg border p-5">
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="mt-1 break-words font-medium">
                    {selectedCustomerOrders.length}
                  </p>
                </div>
              </div>

              {/* MEMBERSHIP */}

              <div className="space-y-2">
                <label className="text-sm font-medium">Membership Tier</label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Select
                    value={selectedMembership}
                    onValueChange={(value) =>
                      setSelectedMembership(value as MembershipCode)
                    }
                  >
                    <SelectTrigger className="sm:w-56">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="B">Bronze</SelectItem>
                      <SelectItem value="S">Silver</SelectItem>
                      <SelectItem value="G">Gold</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    size="sm"
                    onClick={handleMembershipSave}
                    disabled={
                      updateMembership.isPending ||
                      selectedMembership === selectedCustomer.membership
                    }
                  >
                    {updateMembership.isPending
                      ? "Saving..."
                      : "Save Membership"}
                  </Button>
                </div>
              </div>

              {/* ORDER HISTORY */}

              <div>
                <h3 className="mb-3 font-semibold">Order History</h3>

                <div className="min-w-0 overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {selectedCustomerOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            #{order.id}
                          </TableCell>

                          <TableCell>
                            {new Date(order.placed_at).toLocaleDateString()}
                          </TableCell>

                          <TableCell>
                            {order.items.reduce(
                              (total, item) => total + item.quantity,
                              0,
                            )}
                          </TableCell>

                          <TableCell>
                            RM {getOrderTotal(order).toFixed(2)}
                          </TableCell>

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
                        </TableRow>
                      ))}

                      {selectedCustomerOrders.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No orders yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t px-8 py-5">
            <Button type="button" variant="outline" onClick={closeCustomer}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
