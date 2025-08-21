export type ProductStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string[];
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}
