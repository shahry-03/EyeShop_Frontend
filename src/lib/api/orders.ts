import { apiClient } from "@/lib/api-client";
import type {
  Order,
  CheckoutRequest,
  DirectOrderRequest,
  OrderStatusUpdateRequest,
} from "@/types/order";
import type { PageResponse } from "@/types/product";

export const ordersApi = {
  async checkout(shippingAddressId: number): Promise<Order> {
    const res = await apiClient.post<{ data: Order }>("/orders/checkout", {
      shippingAddressId,
    } as CheckoutRequest);
    return res.data.data;
  },

  async placeDirectOrder(data: DirectOrderRequest): Promise<Order> {
    const res = await apiClient.post<{ data: Order }>("/orders", data);
    return res.data.data;
  },

  async getMyOrders(page = 0, size = 20, sort = "createdAt,desc"): Promise<PageResponse<Order>> {
    const res = await apiClient.get<{ data: PageResponse<Order> }>(
      `/orders/me?page=${page}&size=${size}&sort=${sort}`
    );
    return res.data.data;
  },

  async getOrderById(id: number): Promise<Order> {
    const res = await apiClient.get<{ data: Order }>(`/orders/${id}`);
    return res.data.data;
  },

  async cancelOrder(id: number): Promise<Order> {
    const res = await apiClient.put<{ data: Order }>(`/orders/${id}/cancel`);
    return res.data.data;
  },

  // Admin endpoints
  async getAllOrdersAdmin(
    page = 0,
    size = 20,
    sort = "createdAt,desc"
  ): Promise<PageResponse<Order>> {
    const res = await apiClient.get<{ data: PageResponse<Order> }>(
      `/admin/orders?page=${page}&size=${size}&sort=${sort}`
    );
    return res.data.data;
  },

  async updateOrderStatusAdmin(
    id: number,
    data: OrderStatusUpdateRequest
  ): Promise<Order> {
    const res = await apiClient.patch<{ data: Order }>(`/admin/orders/${id}/status`, data);
    return res.data.data;
  },
};
