export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  hasSize?: boolean;
  rating: number;
  reviewCount: number;
  brand: string;
  inStock: boolean;
  onSale: boolean;
}
