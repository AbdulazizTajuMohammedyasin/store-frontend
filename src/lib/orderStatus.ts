import type { Order } from "@/types/order";

/** Readable label for each backend payment status code. */
export const ORDER_STATUS_LABEL: Record<Order["payment_status"], string> = {
  P: "Pending",
  C: "Completed",
  F: "Failed",
};

/** Badge colours — always shown together with the label, never on their own. */
export const ORDER_STATUS_CLASS: Record<Order["payment_status"], string> = {
  P: "bg-warning/15 text-warning",
  C: "bg-success/15 text-success",
  F: "bg-destructive/15 text-destructive",
};
