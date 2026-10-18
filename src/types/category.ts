export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: number | null;
  children?: Category[];
  createdAt?: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
  parentId?: number | null;
}
