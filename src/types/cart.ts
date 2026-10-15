export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  userId: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
