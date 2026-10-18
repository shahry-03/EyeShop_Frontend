import { apiClient } from "@/lib/api-client";
import type { Category, CategoryRequest } from "@/types/category";

export const categoriesApi = {
  async getCategoryTree(): Promise<Category[]> {
    const res = await apiClient.get<{ data: Category[] }>("/categories/tree");
    return res.data.data;
  },

  async getCategories(): Promise<Category[]> {
    const res = await apiClient.get<{ data: Category[] }>("/categories");
    return res.data.data;
  },

  async getCategoryById(id: number): Promise<Category> {
    const res = await apiClient.get<{ data: Category }>(`/categories/${id}`);
    return res.data.data;
  },

  async createCategory(data: CategoryRequest): Promise<Category> {
    const res = await apiClient.post<{ data: Category }>("/categories", data);
    return res.data.data;
  },

  async updateCategory(id: number, data: CategoryRequest): Promise<Category> {
    const res = await apiClient.put<{ data: Category }>(`/categories/${id}`, data);
    return res.data.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  },
};
