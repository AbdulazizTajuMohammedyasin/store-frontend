export interface OrderItem {
  id: number;
  quantity: number;
  unit_price: number;

  product: {
    id: number;
    title: string;
    price: number;
  };
}

export interface Order {
  id: number;
  placed_at: string;
  payment_status: "P" | "C" | "F";
  customer: number;
  items: OrderItem[];
}

export interface OrderParams {
  search?: string;
  ordering?: string;
  page?: number;
}

export interface UpdateOrderData {
  payment_status: "P" | "C" | "F";
}