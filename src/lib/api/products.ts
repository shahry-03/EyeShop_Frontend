import { apiClient } from "@/lib/api-client";
import type {
  Product,
  ProductImage,
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
    categoryId: number,
    page = 0,
    size = 20,
    sort = "createdAt,desc"
  ): Promise<PageResponse<Product>> {
    const res = await apiClient.get<{ data: PageResponse<Product> }>(
      `/products/category/${categoryId}?page=${page}&size=${size}&sort=${sort}`
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

  // ═══════════════════════════════════════════════════════════
  //  Image Management (Cloudinary)
  // ═══════════════════════════════════════════════════════════
  async getProductImages(productId: number): Promise<ProductImage[]> {
    const res = await apiClient.get<{ data: ProductImage[] }>(
      `/products/${productId}/images`
    );
    return res.data.data;
  },

  async uploadProductImage(productId: number, file: File): Promise<ProductImage> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post<{ data: ProductImage }>(
      `/products/${productId}/images`,
      formData
    );
    return res.data.data;
  },

  async deleteProductImage(productId: number, imageId: number): Promise<void> {
    await apiClient.delete(`/products/${productId}/images/${imageId}`);
  },

  async setPrimaryProductImage(
    productId: number,
    imageId: number
  ): Promise<ProductImage> {
    const res = await apiClient.patch<{ data: ProductImage }>(
      `/products/${productId}/images/${imageId}/primary`
    );
    return res.data.data;
  },
};
