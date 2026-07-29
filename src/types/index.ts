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