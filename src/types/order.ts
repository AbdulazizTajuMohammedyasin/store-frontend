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

  payment_status: string;

  customer: number;

  items: OrderItem[];
}