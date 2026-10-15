export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
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
  category: string;
}

export interface ProductUpdateRequest {
  name: string;
  description: string;
  price: number;
  category: string;
}
