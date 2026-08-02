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

export interface Collection {
  id: number;
  title: string;
  featured_product: {
    title: string;
    image: string | null;
  } | null;
}

export interface ProductParams {
    collection?: string;
    price_min?: number;
    price_max?: number;
}