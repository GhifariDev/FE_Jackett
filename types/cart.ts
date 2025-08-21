// types/cart.ts
export interface CartItem {
  productId: number;
  quantity: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
}

export interface DisplayCartItem {
  product: Product;
  quantity: number;
}
