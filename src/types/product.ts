import type { Category } from "./category";

export interface ProductImage {
  id: number;
  url: string;
  publicId: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: Category | null;
  images?: ProductImage[];
  averageRating?: number | null;
  totalReviews?: number | null;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  sort?: string;
}

export interface ProductAddRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
}

export interface ProductUpdateRequest {
  name: string;
  description: string;
  price: number;
  categoryId: number;
}
