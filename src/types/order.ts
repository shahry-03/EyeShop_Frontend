import type { Address } from "./address";

export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export interface OrderItem {
  productId: number;
  productName?: string;
  quantity: number;
  price: number;
}

export interface OrderStatusHistory {
  id: number;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  changedBy: string;
  note?: string | null;
  changedAt: string;
}

export interface Order {
  id: number;
  userId: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  shippingAddress: Address;
  items: OrderItem[];
  statusHistory: OrderStatusHistory[];
}

export interface CheckoutRequest {
  shippingAddressId: number;
}

export interface DirectOrderRequest {
  shippingAddressId: number;
  itemsList: { productId: number; quantity: number }[];
}

export interface OrderStatusUpdateRequest {
  status: OrderStatus;
  note?: string;
}
