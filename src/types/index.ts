export interface ProductImage {
  id: number;
  image: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  collection: string;
  images: ProductImage[];
}

export interface ProductDetail {
  id: number;
  title: string;
  description: string;
  price: number;
  inventory: number;
  collection: number;
  images: ProductImage[];
}

export interface Collection {
  id: number;
  title: string;
  featured_product: {
    title: string;
    image: string | null;
  } | null;
}

export interface ProductParams {
    search?: string;
    collection?: string;
    price_min?: number;
    price_max?: number;
    ordering?: string;
    page?: number;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  reviewed_by: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface UpdateProductData {
  title?: string;
  description?: string;
  price?: number;
  inventory?: number;
  collection?: number;
}
