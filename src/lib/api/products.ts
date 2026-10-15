import { apiClient } from "@/lib/api-client";
import type {
  Product,
  PageResponse,
  ProductAddRequest,
  ProductUpdateRequest,
} from "@/types/product";

export const productsApi = {
  async getProducts(page = 0, size = 20, sort = "createdAt,desc"): Promise<PageResponse<Product>> {
    const res = await apiClient.get<{ data: PageResponse<Product> }>(
      `/products?page=${page}&size=${size}&sort=${sort}`
    );
    return res.data.data;
  },

  async getProductsByCategory(
    category: string,
    page = 0,
    size = 20,
    sort = "createdAt,desc"
  ): Promise<PageResponse<Product>> {
    const res = await apiClient.get<{ data: PageResponse<Product> }>(
      `/products/category/${encodeURIComponent(category)}?page=${page}&size=${size}&sort=${sort}`
    );
    return res.data.data;
  },

  async getProductById(id: number): Promise<Product> {
    const res = await apiClient.get<{ data: Product }>(`/products/${id}`);
    return res.data.data;
  },

  async addProduct(data: ProductAddRequest): Promise<Product> {
    const res = await apiClient.post<{ data: Product }>("/products", data);
    return res.data.data;
  },

  async updateProduct(id: number, data: ProductUpdateRequest): Promise<Product> {
    const res = await apiClient.put<{ data: Product }>(`/products/${id}`, data);
    return res.data.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },
};
