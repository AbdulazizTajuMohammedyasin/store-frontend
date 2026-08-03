import type { Product } from "./index";

export interface ProductRecommendation {
  product: Product;
  score: number;
}