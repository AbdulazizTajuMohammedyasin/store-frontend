export interface CartProduct {
  id: number;
  title: string;
  price: number;
}

export interface CartItem {
  id: number;
  quantity: number;
  total_price: number;

  product: CartProduct;
}

export interface Cart {
  id: string;
  cartitem_set: CartItem[];
  total_price: number;
}