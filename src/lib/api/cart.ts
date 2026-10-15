import { apiClient } from "@/lib/api-client";
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from "@/types/cart";

export const cartApi = {
  async getCart(): Promise<Cart> {
    const res = await apiClient.get<{ data: Cart }>("/users/me/cart");
    return res.data.data;
  },

  async addItem(data: AddToCartRequest): Promise<Cart> {
    const res = await apiClient.post<{ data: Cart }>("/users/me/cart/items", data);
    return res.data.data;
  },

  async updateItem(itemId: number, data: UpdateCartItemRequest): Promise<Cart> {
    const res = await apiClient.put<{ data: Cart }>(`/users/me/cart/items/${itemId}`, data);
    return res.data.data;
  },

  async removeItem(itemId: number): Promise<Cart> {
    const res = await apiClient.delete<{ data: Cart }>(`/users/me/cart/items/${itemId}`);
    return res.data.data;
  },

  async clearCart(): Promise<Cart> {
    const res = await apiClient.delete<{ data: Cart }>("/users/me/cart");
    return res.data.data;
  },
};
