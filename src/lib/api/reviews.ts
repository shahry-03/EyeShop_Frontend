import { apiClient } from "@/lib/api-client";
import type { Review, ReviewRequest } from "@/types/review";
import type { PageResponse } from "@/types/product";

export const reviewsApi = {
  async getProductReviews(
    productId: number,
    page = 0,
    size = 10,
    sort = "createdAt,desc"
  ): Promise<PageResponse<Review>> {
    const res = await apiClient.get<{ data: PageResponse<Review> }>(
      `/products/${productId}/reviews?page=${page}&size=${size}&sort=${sort}`
    );
    return res.data.data;
  },

  async addReview(productId: number, data: ReviewRequest): Promise<Review> {
    const res = await apiClient.post<{ data: Review }>(
      `/products/${productId}/reviews`,
      data
    );
    return res.data.data;
  },

  async deleteReview(productId: number, reviewId: number): Promise<void> {
    await apiClient.delete(`/products/${productId}/reviews/${reviewId}`);
  },
};
